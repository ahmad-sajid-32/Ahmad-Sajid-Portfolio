import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { NodeHttpHandler } from '@smithy/node-http-handler'
import { createRequire } from 'module'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Socials } from './globals/Socials'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { Media } from './collections/Media'
import { PostCategories } from './collections/PostCategories'
import { Posts } from './collections/Posts'
import { Projects } from './collections/Projects'
import { Technologies } from './collections/Technologies'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Local-development only: some sandboxes can only reach the internet
// through an HTTP proxy, which the AWS SDK does not pick up on its own.
// Set LOCAL_S3_PROXY (e.g. http://proxy:3128) in .env.local to route S3
// through it. On Vercel the variable is absent and S3 connects directly.
const s3RequestHandler = process.env.LOCAL_S3_PROXY
  ? new NodeHttpHandler({
      httpsAgent: new (createRequire(import.meta.url)('https-proxy-agent').HttpsProxyAgent)(
        process.env.LOCAL_S3_PROXY,
      ),
    })
  : undefined

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname, '..'),
    },
  },
  collections: [Users, Media, Projects, Technologies, Posts, PostCategories, ContactSubmissions],
  globals: [Socials],
  // Email via Resend when RESEND_API_KEY is set; without it Payload
  // logs mail to the console (safe for local dev). The onboarding
  // sender can only deliver to the Resend account owner's inbox —
  // which is exactly the contact-notification target. Switch the
  // From address once a sending domain is verified in Resend.
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        defaultFromAddress: 'onboarding@resend.dev',
        defaultFromName: 'Ahmad Sajid — Portfolio',
        apiKey: process.env.RESEND_API_KEY,
      })
    : undefined,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET || 'media',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        forcePathStyle: true,
        ...(s3RequestHandler ? { requestHandler: s3RequestHandler } : {}),
      },
    }),
  ],
})
