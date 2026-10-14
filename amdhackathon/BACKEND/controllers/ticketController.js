const client = require('../supabase').client;



// GET /api/tickets/:companyId
exports.getTickets = async (req, res) => {
  try {

    const companyId = req.params.companyId;
    console.log('Received companyId:', companyId);
    const { data, error } = await client
      .from('tickets')
      .select('*')
      .eq('company_id', companyId);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }


    return res.status(200).json(data);
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