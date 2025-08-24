const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'text/csv') {
      cb(null, true);
    } else {
      cb(new Error('Only images and CSV files allowed'));
    }
  }
});

module.exports = upload;