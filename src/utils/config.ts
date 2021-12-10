if (
	process.env.VERCEL_ENV !== 'production' &&
	process.env.VERCEL_ENV !== 'preview'
) {
	require('dotenv').config()
}

console.log(process.env.MONGO_URL, process.env.WEBHOOK_SECRET)

export const {
	USER_SECRET,
	MONGO_URL,
	WEBHOOK_SECRET,
	SENDGRID_KEY,
	FIREBASE_PROJECT_ID,
	FIREBASE_CLIENT_EMAIL,
	FIREBASE_PRIVATE_KEY,
} = process.env
export const PORT = process.env.PORT ?? 4000
