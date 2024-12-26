const videoService = require('../services/videoService');
const videoMergeService = require('../services/videoMergeService');
const videoTrimService = require('../services/videoTrimService');
const linkService = require('../services/linkService');
const fs = require('fs');

// Video Upload
exports.uploadVideo = async (req, res) => {
  try {
    const file = req.file;
    const { title } = req.body;
    
    if (!file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const filePath = file.path;
    const size = file.size;
    const duration = await videoService.getVideoDuration(filePath);

    const videoId = await videoService.uploadVideo({
      title,
      filePath,
      size,
      duration,
    });

    res.status(200).json({ message: 'Video uploaded successfully', videoId, filePath });
  } catch (err) {
    console.error('Error uploading video:', err);
    res.status(500).json({ message: 'Error uploading video', error: err.message });
  }
};

// Trim Video
exports.trimVideo = async (req, res) => {
  try {
    
    const { videoId, start, end } = req.body;

    if (start >= end) {
      return res.status(400).json({ message: 'Invalid start and end times' });
    }

    const trimmedPath = await videoTrimService.trimVideo(videoId, start, end);

    const trimmedVideoId = await videoService.uploadVideo({
      title: `Trimmed Video ${Date.now()}`,
      filePath: trimmedPath,
      size: fs.statSync(trimmedPath).size,
      duration: end - start,
    });

    res.status(200).json({
      message: 'Video trimmed successfully',
      trimmedPath,
      trimmedVideoId,
    });
  } catch (err) {
    console.error('Error trimming video:', err);
    res.status(500).json({ message: 'Error trimming video', error: err.message });
  }
};

// Merge Videos
exports.mergeVideos = async (req, res) => {
  try {
    const { videoIds } = req.body;

    if (!Array.isArray(videoIds) || videoIds.length === 0) {
      return res.status(400).json({ message: 'No videos to merge' });
    }
    
    const mergedPath = await videoMergeService.mergeVideos(videoIds);

    const mergedVideoId = await videoService.uploadVideo({
      title: `Merged Video ${Date.now()}`,
      filePath: mergedPath,
      size: fs.statSync(mergedPath).size,
      duration: 'calculated from video duration logic',
    });

    res.status(200).json({
      message: 'Videos merged successfully',
      mergedPath,
      mergedVideoId,
    });
  } catch (err) {
    console.error('Error merging videos:', err);
    res.status(500).json({ message: 'Error merging videos', error: err.message });
  }
};

// Merge Videos
exports.generateLink = (req, res) => {
  try {
    const { id } = req.params;
    const expiry = process.env.LINK_EXPIRY_SECONDS;
    const link = linkService.generateLink(id, expiry);
    res.status(200).json({ message: 'Link generated successfully', link });
  } catch (err) {
    console.error('Error generating link:', err);
    res.status(500).json({ message: 'Error generating link', error: err.message });
  }
};

// Get All Uploaded Videos
exports.getAllVideo = async (req, res) => {
  try {
    const videos = await videoService.fetchAllVideo();
    res.status(200).json({ message: 'Uploaded video fetched successfully', videos });
  } catch (err) {
    console.error('Error to fetch video:', err);
    res.status(500).json({ message: 'Error to fetch video', error: err.message });
  }
};