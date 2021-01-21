import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET_KEY as string

export const encryptSession = (session: Record<string, any>) => {
  const payload = { 'https://hasura.io/jwt/claims': session }

  return jwt.sign(payload, SECRET, { algorithm: 'HS256' })
}
