const client = require('../supabase').client;

exports.createTicket = async (req, res) => {
  try {


  } catch (error) {
    console.log('this is an example create');
  }
}

exports.getTickets = async (req, res) => {
  try {
    const { data, error } = await client
      .from('tickets')
      .select('*');

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('Fetched tickets:', data);
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'An error occurred while fetching tickets' });
  }
};
