import { gql } from 'graphql-request'
import { restAdapter } from '../../utils/middleware'
import { request } from '../../utils/gql'

const ATTACH_PROJECT_COLLABORATORS = gql`
  mutation AttachProjectCollaborators($email: String!, $user_id: String!) {
    update_project_collaborator(
      where: { invite_email: { _eq: $email } }
      _set: { collaborator_id: $user_id }
    ) {
      affected_rows
    }
  }
`

const attachCollaborators = ({ email, id }) =>
  request(ATTACH_PROJECT_COLLABORATORS, { email, user_id: id })

export const attachProjectsToUser = restAdapter(async ({ body }) => {
  const { data } = body.event

  await attachCollaborators(data.new)

  return { message: `Projects were attached to user` }
})
