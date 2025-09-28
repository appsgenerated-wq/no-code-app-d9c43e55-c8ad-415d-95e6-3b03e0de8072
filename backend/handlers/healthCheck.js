module.exports = async (req, res, manifest) => {
  const timestamp = new Date().toISOString();
  const appId = req.get('X-App-ID') || 'Unknown';

  console.log(`🔍 [HEALTH] Health check at ${timestamp}, App ID: ${appId}`);

  try {
    // Set CORS headers for all origins (including StackBlitz)
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-App-ID');
    res.header('Access-Control-Allow-Credentials', 'true');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      return res.status(200).send();
    }

    const healthStatus = {
      status: 'ok',
      timestamp: timestamp,
      appId: appId,
      manifest: 'running',
      version: '1.0.0'
    };

    console.log(`✅ [HEALTH] Health check successful:`, healthStatus);

    res.status(200).json(healthStatus);
  } catch (error) {
    console.error(`❌ [HEALTH] Health check failed:`, error);

    // Set CORS headers for error response
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-App-ID');
    res.header('Access-Control-Allow-Credentials', 'true');

    const errorStatus = {
      status: 'error',
      timestamp: timestamp,
      appId: appId,
      error: error.message,
      manifest: 'disconnected'
    };

    res.status(500).json(errorStatus);
  }
};