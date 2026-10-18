const { client } = require('../supabase.js');


exports.createCategory = async (req, res) => {
    try {
        const { company_id, name, description } = req.body;

        if (!company_id || !name || !description) {
            return res.status(400).json({ error: 'company_id, name, and description are required' });
        }

        const { data, error } = await client
            .from('issue_category')
            .insert([{ company_id, category: name, description }])
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({ error: error.message });
        }

        return res.status(201).json(data);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'An error occurred while creating the category' });
    }
};
