import { gql } from 'graphql-request'
import { restAdapter } from '../../utils/middleware'
import { request } from '../../utils/gql'
import * as sendGrid from '../../services/send-grid'

const GET_PROJECT_COLLABORATOR = gql`
  query ProjectCollaborator($id: uuid!) {
    project_collaborator_by_pk(id: $id) {
      project {
        id
        name
      }
      invited_by {
        name
      }
    }
  }
`

const findCollaborator = id => request(GET_PROJECT_COLLABORATOR, { id })

const UPDATE_COLLABORATOR = gql`
  mutation ProjectCollaborator(
    $id: uuid!
    $set: project_collaborator_set_input!
  ) {
    update_project_collaborator_by_pk(pk_columns: { id: $id }, _set: $set) {
      invite_sent
    }
  }
`

const updateCollaborator = (id, set) =>
  request(UPDATE_COLLABORATOR, { id, set })

export const sendInvitation = restAdapter(async ({ body }) => {
  const {
    data: { new: data },
  } = body.event

  if (data.invite_sent) {
    return { message: 'Invitation already sent' }
  }

  const { project, invited_by } = await findCollaborator(data.id)

  await sendGrid.sendInvitation({
    to: data.invite_email,
    project,
    referrer: invited_by,
  })

  try {
    await updateCollaborator(data.id, { invite_sent: true })
  } catch (error) {
    console.error(error)
  }

  return { message: 'Invitation sent' }
})
