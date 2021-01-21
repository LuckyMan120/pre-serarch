import {
  CreateWriteStreamOptions,
  GetSignedUrlConfig,
  Storage,
} from '@google-cloud/storage'

if (!process.env.GCP_PRIVATE_KEY) {
  throw new Error('GCP_PRIVATE_KEY is not set')
}

const bucketName = process.env.GCP_BUCKET as string

const storage = new Storage({
  credentials: {
    private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/gm, '\n'),
    client_email: process.env.GCP_CLIENT_EMAIL as string,
  },
  scopes: 'https://www.googleapis.com/auth/cloud-platform',
  projectId: process.env.GCP_PROJECT_ID as string,
})

const bucket = storage.bucket(bucketName)

export const getPublicUrl = filename =>
  `https://storage.googleapis.com/${bucketName}/${filename}`

export const uploadFile = async (
  buffer: Buffer,
  filename: string,
  options: CreateWriteStreamOptions
): Promise<string> => {
  const file = bucket.file(filename)
  const stream = file.createWriteStream(options)

  stream.write(buffer)
  stream.end()

  const url = getPublicUrl(filename)

  return new Promise((resolve, reject) => {
    stream.on('error', reject)

    stream.on('finish', () => resolve(url))
  })
}

export const generateV4UploadSignedUrl = async (
  filename: string,
  options?: Partial<GetSignedUrlConfig>
): Promise<string> => {
  const file = bucket.file(filename)
  const [uploadUrl] = await file.getSignedUrl({
    version: 'v4',
    action: 'write',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    ...options,
  })

  return uploadUrl
}
