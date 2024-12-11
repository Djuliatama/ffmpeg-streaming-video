const multer = require('multer');
const path = require('path');
const fs = require('fs');


//Storage Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '../uploads/media');
      if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});


// Filefilter for confirming only format video can be uploaded 
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.mp4', '.avi', '.mkv', '.mov'];
  const ext = path.extname(file.originalname).toLocaleLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Format file unsupported'));
  }
};

//Middleware multer 
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {fileSize: 500 * 1024 * 1024},
});


module.exports = upload;
