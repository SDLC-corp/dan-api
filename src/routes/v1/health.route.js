const express = require('express');
const config = require('../../config/config');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'dan-api',
    env: config.env,
    version: process.env.npm_package_version,
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;