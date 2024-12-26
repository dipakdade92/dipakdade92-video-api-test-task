const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const db = require('../utils/knex');

exports.mergeVideos = async (videoIds) => {
  return new Promise(async (resolve, reject) => {
    try {
      
      const videos = await db('videos').whereIn('id', videoIds);
      if (videos.length !== videoIds.length) {
        return reject(new Error('One or more videos not found!!'));
      }

      const outputPath = path.join(__dirname, `../../uploads/merged-${Date.now()}.mp4`);
      const ffmpegCommand = ffmpeg();

      videos.forEach((video) => {
        const inputPath = path.join(__dirname, `../../${video.file_path}`);
        ffmpegCommand.input(inputPath);
      });
      
      ffmpegCommand
        .mergeToFile(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
};