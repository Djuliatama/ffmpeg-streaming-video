const express = require('express');
const { uploadVideo, streamVideo } = require('./controller.js')
const multer = require('multer');
const upload = require('./multer');

const app = express();

// Middleware parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing 
app.post('/upload', upload.single('video'), uploadVideo);
app.get('/videos/:filename', streamVideo); 

app.use((err, req, res, next) => {
    console.error(err.stack); 
    res.status(500).send({ message: err.message || 'Internal Server Error' }); 
  });

//Server  
const PORT = 3000; 
app.listen(PORT,()  => {
    console.log(`Server running on port ${PORT}`);
});
