import AWS from 'aws-sdk';
import s3 from '../../config/s3.js';

class StorageService {
  constructor() {
    this._S3 = new AWS.S3();
  }

  writeFile(file, meta) {
    const parameter = {
      Bucket: s3.bucket,
      key: +new Date() + meta.filename,
      body: file._data,
      contentType: meta.headers['content-type'],
    };

    return new Promise((resolve, reject) => {
      this._S3.upload(parameter, (error, data) => {
        if (error) return reject(error);
        return resolve(data);
      });
    });
  }
}

export default StorageService;
