const client = require('../supabase').client;



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
