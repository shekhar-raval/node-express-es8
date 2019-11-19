const multer = require('multer');
const path = require('path');
const APIError = require('./APIError');
const { INVALID_FILE_TYPE } = require('./constants');

const fileFilter = (req, file, cb) => {
  const type = (/\.(gif|jpg|jpeg|tiff|png)$/i).test(file.filename);
  if (!type) {
    const err = new APIError({
      message: INVALID_FILE_TYPE,
      status: 400,
    });
    return cb(err, false);
  }
  return cb(null, true);
};

/**
 * Upload File locally Using Multer
 */
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../public'),
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()}-${file.originalname}`);
  },
});

/**
 * Store file in memory without moving to system storage
 */
// const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // we are allowing only 5 MB files
  },
});

/**
 * Multer fileupload configuration
 * @public
 */
module.exports = upload;
