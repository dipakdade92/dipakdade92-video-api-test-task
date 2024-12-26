const crypto = require('crypto');

exports.generateLink = (videoId, expiry) => {
  const token = crypto.randomBytes(16).toString('hex');
  return `http://localhost:3000/api/videos/share/${videoId}?token=${token}&expires=${Date.now() + expiry * 1000}`;
};