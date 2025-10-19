const { S3Client } = require('@aws-sdk/client-s3')
const dotenv = require('dotenv')
dotenv.config()

const region = process.env.AWS_REGION
const bucket = process.env.S3_BUCKET_NAME
const forcePathStyle = String(process.env.S3_FORCE_PATH_STYLE || '').toLowerCase() === 'true'

const credentials = (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)
  ? {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  : undefined

const s3 = new S3Client({
  region,
  credentials,
  ...(endpoint ? { endpoint } : {}),
  forcePathStyle
})

module.exports = {
  s3,
  bucket,
  region
}