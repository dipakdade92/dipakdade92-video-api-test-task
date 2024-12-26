const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const videoController = require('../controllers/videoController');
const { upload } = require('../middlewares/multerConfig');

const router = express.Router();

router.use(authenticate);

router.post('/upload', upload.single('video'), videoController.uploadVideo);
router.post('/trim', upload.single('video'), videoController.trimVideo);
router.post('/merge', videoController.mergeVideos);
router.get('/share/:id', videoController.generateLink);
router.get('/', videoController.getAllVideo);

module.exports = router;