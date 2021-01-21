import { GraphQLClient } from 'graphql-request'
import { RequestDocument, Variables } from 'graphql-request/dist/types'

const ENDPOINT = process.env.HASURA_GRAPHQL_ENDPOINT as string

const client = new GraphQLClient(ENDPOINT, {
  headers: {
    'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET as string,
  },
})

type RequestOptions = {
  autopick?: boolean
}

export const request = async <T = Record<string, any>>(
  document: RequestDocument,
  variabes?: Variables,
  options: RequestOptions = {
    autopick: true,
  }
) => {
  const data = await client.request(document, variabes)

  // Pick first result
  const result = options.autopick ? data[Object.keys(data)[0]] : data

  return result as T
}
