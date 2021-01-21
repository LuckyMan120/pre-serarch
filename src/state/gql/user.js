import gql from 'graphql-tag'

export const UserDataFragment = gql`
  fragment UserData on users {
    id
    name
    email
    created_at
    last_seen
  }
`

export const UserPrivateFragment = gql`
  fragment UserPrivateData on user_private {
    id
    name
    email
    created_at
    last_seen
  }
`

export const USER_SUBSCRIPTION = gql`
  query users {
    user: user_private {
      ...UserPrivateData
    }
  }
  ${UserPrivateFragment}
`

export const GET_USER = gql`
  query users {
    user: user_private {
      ...UserPrivateData
    }
  }
  ${UserPrivateFragment}
`

export const UPDATE_USER = gql`
  mutation update_users($payload: user_private_set_input!) {
    update_user_private(where: {}, _set: $payload) {
      returning {
        ...UserPrivateData
      }
    }
  }
  ${UserPrivateFragment}
`
