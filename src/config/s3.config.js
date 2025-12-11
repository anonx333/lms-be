import { S3Client } from "@aws-sdk/client-s3";
import config from "./config.js";

const s3Client = new S3Client({
  region: config.aws.config.region,
  credentials: config.aws.config.credentials,
});

export { s3Client };
