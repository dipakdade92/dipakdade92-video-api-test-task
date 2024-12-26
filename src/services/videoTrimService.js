const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const db = require('../utils/knex');

// Trim a video based on videoId and the start/end time
exports.trimVideo = (videoId, start, end) => {
  return new Promise(async (resolve, reject) => {
    try {
      const video = await db('videos').where({ id: videoId }).first();
      
      if (!video) {
        return reject(new Error('Video not found'));
      }

      const inputPath = path.join(__dirname, `../../${video.file_path}`);
      const outputPath = path.join(__dirname, `../../uploads/trimmed-${Date.now()}.mp4`);

      const finalPath = `uploads/${outputPath.split('/uploads/')[1]}`;
      
      ffmpeg(inputPath)
        .setStartTime(start)
        .setDuration(end - start)
        .output(outputPath)
        .on('end', () => resolve(finalPath))
        .on('error', (err) => reject(err))
        .run();
    } catch (err) {
      reject(err);
    }
  });
};