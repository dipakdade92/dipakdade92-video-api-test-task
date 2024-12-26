const db = require('../utils/knex');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');


// Upload video details to the database
exports.uploadVideo = async (fileData) => {
  const { title, filePath, size, duration } = fileData;
  const [id] = await db('videos').insert({
    title,
    file_path: filePath,
    size,   
    duration,
  });
  return id;1
};

// Fetch a video by its ID
exports.getVideoById = async (id) => {
  return db('videos').where({ id }).first();
};

// Fetch all video IDs
exports.fetchAllVideo = async () => {
  return db('videos').select("*");
};

// Get video duration
exports.getVideoDuration = (filePath) => {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, function(err, metadata) {
        if (err) {
          return reject(err);
        }
        const duration = metadata.format.duration;
        resolve(duration);
      });
    });
};