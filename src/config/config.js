import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  stripe: { key: process.env.STRIPE_SECRET_KEY },
  mongo: {
    url: process.env.MONGO_URL || "mongodb://localhost:27017/lms-db",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "secret",
    expires: process.env.JWT_EXPIRES || "1d",
  },
  renewJwt: {
    secret: process.env.JWT_RENEW_SECRET || "renew-secret",
    expires: process.env.JWT_RENEW_EXPIRES || "1d",
  },
  aws: {
    bucket_name: process.env.S3_BUCKET_NAME,
    config: {
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    },
  },
};

export default config;
