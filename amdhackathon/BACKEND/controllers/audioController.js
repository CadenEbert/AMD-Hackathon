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

    // Supabase rejects some characters in file paths, so replace anything outta the ordinary
    const safeName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${companyId}/${Date.now()}-${safeName}`;

    const { data, error } = await client.storage
      .from('call-recordings')
      .upload(path, req.file.buffer, { contentType: req.file.mimetype });

    if (error) {
      console.error('Supabase storage error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ path: data.path });
  } catch (error) {
    console.error('Error ingesting call:', error);
    res.status(500).json({ error: 'An error occurred while uploading the call' });
  }
};