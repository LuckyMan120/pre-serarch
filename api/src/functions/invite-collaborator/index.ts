import { gql } from 'graphql-request'
import { restAdapter } from '../../utils/middleware'
import { request } from '../../utils/gql'

const GET_PROJECT = gql`
  query Project($id: uuid!) {
    projects_by_pk(id: $id) {
      id
      author {
        id
      }
    }
  }
`

const findProject = id => {
  return request(GET_PROJECT, { id })
}

const GET_USERS = gql`
  query Users($email: String!) {
    users(where: { email: { _eq: $email } }) {
      id
    }
  }
`

const findUser = email => request<{ id: string }[]>(GET_USERS, { email })

const INSERT_PROJECT_COLLABORATOR = gql`
  mutation InsertProjectCollaborator(
    $payload: project_collaborator_insert_input!
  ) {
    insert_project_collaborator_one(object: $payload) {
      id
    }
  }
`

const insertProjectCollaborator = async ({
  project_id,
  invited_by_id,
  email,
  collaborator_id,
}) =>
  request(INSERT_PROJECT_COLLABORATOR, {
    payload: {
      project_id,
      invited_by_id,
      invite_email: email,
      ...(collaborator_id && { collaborator_id }),
    },
  })

export const inviteCollaborator = restAdapter(async ({ body }) => {
  const { project_id, email } = body.input.payload
  const userId = body.session_variables['x-hasura-user-id'] as string

  const project = await findProject(project_id)

  // ToDo: check if the user with this email already exists

  if (project.author.id !== userId) {
    throw new Error('Failed to invite to project: insufficient permissions')
  }
  const [collaborator] = await findUser(email)

  await insertProjectCollaborator({
    project_id,
    email,
    invited_by_id: userId,
    collaborator_id: collaborator?.id,
  })

  return { data: { success: true } }
})
