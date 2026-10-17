const client = require('../supabase').client;





// GET /api/tickets/:companyId
exports.getTickets = async (req, res) => {
  try {

    const companyId = req.params.companyId;
    const { data, error } = await client
      .from('tickets')
      .select(`
        id,
        company_id,
        category_id,
        issue_category (
        category,
        description
        ),
        description,
        severity_score,
        resolved,
        assigned_team,
        created_at,
        teams (
          id,
          description,
          supervisors_email,
          name
      ),
        companies(
          company_name
      )

        `)
      .eq('company_id', companyId);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    const tickets = data.map((row) => {
      const elapsedMs = Math.max(
        0,
        Date.now() - new Date(row.created_at).getTime()
      );

      const totalMinutes = Math.floor(elapsedMs / 60000);
      const days = Math.floor(totalMinutes / 1440);
      const hours = Math.floor((totalMinutes % 1440) / 60);
      const minutes = totalMinutes % 60;

      let dateCreated = new Date(row.created_at);
      let formattedDate = dateCreated.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      let timeActive;
      if (days > 0) {
        timeActive = `${days}d ${hours}h`;
      } else if (hours > 0) {
        timeActive = `${hours}h ${minutes}m`;
      } else {
        timeActive = `${minutes}m`;
      }


      return {
        ticketId: row.id,
        companyId: row.company_id,
        companyName: row.companies?.company_name ?? '',
        categoryId: row.category_id,
        categoryDescription: row.issue_category?.description ?? '',
        category: row.issue_category?.category ?? '',
        assignedTeamId: row.assigned_team,
        description: row.description,
        created_at: formattedDate,
        time_active: timeActive,
        severity_score: row.severity_score,
        resolved: row.resolved,
        team: {
          id: row.teams?.id ?? '',
          name: row.teams?.name ?? '',
          description: row.teams?.description ?? '',
          supervisors_email: row.teams?.supervisors_email ?? '',
        },
      };
    });


    return res.status(200).json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'An error occurred while fetching tickets' });
  }
};

// GET /api/tickets/:companyId/:id
exports.getTicket = async (req, res) => {
  try {
    const { companyId, id } = req.params;
    const { data, error } = await client
      .from('tickets')
      .select('*')
      .eq('company_id', companyId)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ error: 'An error occurred while fetching the ticket' });
  }
};

// PATCH /api/tickets/:companyId/:id
exports.updateTicket = async (req, res) => {
  try {
    const { companyId, id } = req.params;

    const allowed = ['resolved', 'assigned_team', 'category_id', 'severity_score', 'description'];
    const updates = {};
    for (const field of allowed) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const { data, error } = await client
      .from('tickets')
      .update(updates)
      .eq('company_id', companyId)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ error: 'An error occurred while updating the ticket' });
  }
};
