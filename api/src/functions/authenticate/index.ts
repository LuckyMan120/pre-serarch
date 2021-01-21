import { gql } from 'graphql-request'
import { restAdapter } from '../../utils/middleware'
import { encryptSession } from '../../utils/jwt'
import { request } from '../../utils/gql'

import { Magic } from '@magic-sdk/admin'

const magic = new Magic(process.env.MAGIC_SECRET_KEY)

const INSERT_USER = gql`
  mutation InsertUser($payload: users_insert_input!) {
    insert_users_one(
      object: $payload
      on_conflict: { constraint: users_auth_id_key, update_columns: [] }
    ) {
      id
    }
  }
`

const insertUser = ({ email, id }) =>
  request(INSERT_USER, { payload: { email, id } })

export const authenticate = restAdapter(async ({ body }) => {
  const { didToken } = body.input

  const metadata = await magic.users.getMetadataByToken(didToken)
  const { email, issuer: userId } = metadata

  // Insert user if doesn't exist
  await insertUser({ email, id: userId })

  const token = await encryptSession({
    'x-hasura-default-role': 'user',
    // We can do some custom logic to decide allowed roles
    'x-hasura-allowed-roles': ['user'],
    'x-hasura-user-id': userId,
  })

  return { data: { success: true, token } }
})
