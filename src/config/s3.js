import 'dotenv/config';

export default {
  keyId: process.env.AWS_ACCESS_KEY_ID,
  accessKey: process.env.AWS_SECRET_ACCESS_KEY,
  bucket: process.env.AWS_BUCKET_NAME,
};
