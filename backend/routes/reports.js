
const express = require('express');
const multer = require('multer');
const reportController = require('../controllers/reportController');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/xml' || file.originalname.endsWith('.xml')) {
      cb(null, true);
    } else {
      cb(new Error('Only XML files are allowed'), false);
    }
  },
});
router.post('/upload', upload.single('file'), reportController.uploadReport);
router.get('/', reportController.getAllReports);
router.get('/:id', reportController.getReportById);
router.get('/search/pan/:pan', reportController.getReportByPan);
router.get('/search/phone/:phone', reportController.getReportByPhone);
router.get('/stats/overview', reportController.getReportStats);
router.delete('/:id', reportController.deleteReport);

module.exports = router;