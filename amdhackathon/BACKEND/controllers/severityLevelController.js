const client = require('../supabase').client;

// GET /api/severity-levels/:companyId
exports.getSeverityLevels = async (req, res) => {
  try {

    const companyId = req.params.companyId;
    const { data, error } = await client
      .from('severity_levels')
      .select('*')
      .eq('company_id', companyId)
      .order('rank', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching severity levels:', error);
    res.status(500).json({ error: 'Error occurred while fetching severity levels' });
  }
};

// GET /api/severity-levels/:companyId/:id
exports.getSeverityLevel = async (req, res) => {
  try {
    const { companyId, id } = req.params;
    const { data, error } = await client
      .from('severity_levels')
      .select('*')
      .eq('company_id', companyId)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Severity level not found' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching severity level:', error);
    res.status(500).json({ error: 'Error occurred while fetching the severity level' });
  }
};

// POST /api/severity-levels/:companyId
exports.createSeverityLevel = async (req, res) => {
  try {

    const companyId = req.params.companyId;
    const { rank, name, definition } = req.body;

    if (!rank || !name || !definition) {
      return res.status(400).json({ error: 'rank, name, and definition are required' });
    }

    const { data, error } = await client
      .from('severity_levels')
      .insert({ company_id: companyId, rank, name, definition })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Already has a level with that rank or name' });
      }
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data);
  } catch (error) {
    console.error('Error creating severity level:', error);
    res.status(500).json({ error: 'An error occurred while creating the severity level' });
  }
};

// PATCH /api/severity-levels/:companyId/:id
exports.updateSeverityLevel = async (req, res) => {
  try {
    const { companyId, id } = req.params;

    const allowed = ['rank', 'name', 'definition'];
    const updates = {};
    for (const field of allowed) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const { data, error } = await client
      .from('severity_levels')
      .update(updates)
      .eq('company_id', companyId)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Already has a level with that rank or name' });
      }
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Severity level not found' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error updating severity level:', error);
    res.status(500).json({ error: 'Error occurred while updating the severity level' });
  }
};

// DELETE /api/severity-levels/:companyId/:id
exports.deleteSeverityLevel = async (req, res) => {
  try {
    const { companyId, id } = req.params;

    const { data, error } = await client
      .from('severity_levels')
      .delete()
      .eq('company_id', companyId)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Severity level not found' });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting severity level:', error);
    
    res.status(500).json({ error: 'An error occurred while deleting the severity level' });
  }
};