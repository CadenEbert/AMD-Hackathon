const client = require('../supabase').client;

// GET /api/teams/:companyId
exports.getTeams = async (req, res) => {
    try {
        const companyId = req.params.companyId;
        const { data, error } = await client
            .from('teams')
            .select('*')
            .eq('company_id', companyId);

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).json({ error: 'An error occurred while fetching teams' });
    }
};

// GET /api/teams/:companyId/:id
exports.getTeam = async (req, res) => {
  try {
    const { companyId, id } = req.params;
    const { data, error } = await client
      .from('teams')
      .select('*')
      .eq('company_id', companyId)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Team not found' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ error: 'An error occurred while fetching the team' });
  }
};

// POST /api/teams/:companyId
//kept supervisor email cause I saw it on the schema
exports.createTeam = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    const { name, description, supervisors_email } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }

    const { data, error } = await client
      .from('teams')
      .insert({ company_id: companyId, name, description, supervisors_email })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data);
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ error: 'An error occurred while creating the team' });
  }
};

// PATCH /api/teams/:companyId/:id
exports.updateTeam = async (req, res) => {
  try {
    const { companyId, id } = req.params;

    const allowed = ['name', 'description', 'supervisors_email'];
    const updates = {};
    for (const field of allowed) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const { data, error } = await client
      .from('teams')
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
      return res.status(404).json({ error: 'Team not found' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({ error: 'An error occurred while updating the team' });
  }
};
