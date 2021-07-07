if (
	process.env.VERCEL_ENV !== 'production' &&
	process.env.VERCEL_ENV !== 'preview'
) {
	require('dotenv').config()
}

console.log(process.env.MONGO_URL, process.env.WEBHOOK_SECRET)

export const { MONGO_URL, WEBHOOK_SECRET, SENDGRID_KEY } = process.env
