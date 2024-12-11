const path = require('path');
const fs = require('fs');
const upload = require('./multer'); 
const { transcodeVideo } = require('./transcoded');


const uploadVideo = async (req, res, next) => {
  try {
    const inputPath = path.join(__dirname, '../uploads/media' , req.file.filename);
    const outputPath = inputPath.replace(path.extname(req.file.filename), '.mp4');
    console.log('Target path:', path.join(__dirname, '../uploads/videos', req.file?.filename));

    console.log('File path:', inputPath);

    if(!req.file) {
      return res.status(400).send({ message: 'no video uploaded'})
    }

    if (path.extname(req.file.filename).toLowerCase() !== '.mp4') {
      await transcodeVideo(inputPath, outputPath);
      fs.unlinkSync(inputPath);
    }

    res.status(200).send({
      message: 'Video successfully uploaded',
      filePath: `/videos/${req.file.filename}`,
    });

  } catch (error) {
    next(error)
  }
}

const streamVideo = (req, res) => {
  try {
    const videoPath = path.join(__dirname, '../uploads/media', req.params.filename);


    if (!fs.existsSync(videoPath)) {
      return res.status(404).send({ message: 'Video not found.' });
    }

    const { size: fileSize } = fs.statSync(videoPath);
    const range = req.headers.range;

    if (range) {

      const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
      const start = parseInt(startStr, 10);
      const end = endStr ? parseInt(endStr, 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize) {
        return res.status(416).send({ message: 'Requested range not satisfiable.' });
      }

      const chunkSize = end - start + 1;
      const stream = fs.createReadStream(videoPath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      });

      stream.pipe(res);
    } else {
  
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      });

      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    console.error('Error streaming video:', error.message);
    res.status(500).send({ message: 'An error occurred while streaming the video.' });
  }
};

module.exports = {
  uploadVideo,
  streamVideo
}