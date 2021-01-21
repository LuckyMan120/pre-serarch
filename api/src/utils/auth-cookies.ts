import { serialize, parse } from 'cookie'
import { Request, Response } from 'express'

const TOKEN_NAME = 'token'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export const setTokenCookie = (res: Response, token: string) => {
  const cookie = serialize(TOKEN_NAME, token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  })
  res.setHeader('Set-Cookie', cookie)
}

export const removeTokenCookie = (res: Response) => {
  const cookie = serialize(TOKEN_NAME, '', {
    maxAge: -1,
    path: '/',
  })

  res.setHeader('Set-Cookie', cookie)
}

export const parseCookies = (req: Request) => {
  if (req.cookies) return req.cookies

  const cookie = req.headers && req.headers.cookie
  return parse(cookie || '')
}

export const getTokenCookie = (req: Request) => {
  const cookies = parseCookies(req)
  return cookies[TOKEN_NAME]
}
