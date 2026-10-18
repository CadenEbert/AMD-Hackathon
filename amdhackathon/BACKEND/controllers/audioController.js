const client = require('../supabase').client;

// POST /api/audio/call/:companyId
exports.audioCall = async (req, res) => {
  try {
    const companyId = req.params.companyId;

    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }
    if (!req.file.mimetype.startsWith('audio/')) {
      return res.status(400).json({ error: 'File must be an audio file' });
    }

    const safeName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${companyId}/${Date.now()}-${safeName}`;

    const { data, error } = await client.storage
      .from('call-recordings')
      .upload(path, req.file.buffer, { contentType: req.file.mimetype });

    if (error) {
      console.error('Supabase storage error:', error);
      return res.status(500).json({ error: error.message });
    }

    // Record it. The Python worker picks it up from here.
    const { data: row, error: dbError } = await client
      .from('call_recordings')
      .insert({
        company_id: companyId,
        storage_path: data.path,
        original_name: req.file.originalname,
        content_type: req.file.mimetype,
        size_bytes: req.file.size,
      })
      .select('id, status')
      .single();

    if (dbError) {
      // Don't leave an orphaned file behind
      await client.storage.from('call-recordings').remove([data.path]);
      console.error('Supabase insert error:', dbError);
      return res.status(500).json({ error: dbError.message });
    }

    return res.status(202).json({ id: row.id, status: row.status });
  } catch (error) {
    console.error('Error ingesting call:', error);
    res.status(500).json({ error: 'An error occurred while uploading the call' });
  }
};

// GET /api/audio/call/status/:id
exports.callStatus = async (req, res) => {
  const { data, error } = await client
    .from('call_recordings')
    .select('id, status, error, transcript, ticket_id')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ error: 'Call not found' });
  res.json(data);
};