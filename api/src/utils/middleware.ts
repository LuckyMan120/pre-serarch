import { Request, Response } from 'express'

type RestHandler = (
  req: Request,
  res: Response
) => Promise<{
  data?: any
  statusCode?: number
  error?: boolean
  message?: string
}>

export const assertAPIKey = headers => {
  if (headers['x-api-key'] !== process.env.API_KEY) {
    throw new Error(`API key is not valid`)
  }
}

export const restAdapter = (handler: RestHandler) => {
  return async (req: Request, res: Response) => {
    try {
      assertAPIKey(req.headers)

      const { statusCode = 200, data } = await handler(req, res)

      return res.status(statusCode).send(data)
    } catch (error) {
      console.error(error)
      const { message } = error

      return res.status(400).send({ error: true, message })
    }
  }
}
