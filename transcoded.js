const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

const transcodeVideo = (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .output(outputPath)
            .on('end', () => {
                console.log('Trancoding finished successfully.');
                resolve();
            })
            .on('error', (err) => {
                console.log('Error during transcoding:', err.message);
                reject (new Error(`Trancoding failed: ${err.message}`));
            })
            .run();
    });
};

module.exports = { transcodeVideo };

