import gql from 'graphql-tag'
import { UserDataFragment } from './user'

export const ExperimentDataFragment = gql`
  fragment ExperimentData on experiments {
    id
    name
    note
    project_id
    status
    is_bookmarked
    is_deleted
    created_at
    updated_at
    project {
      id
      name
    }
  }
`

export const GET_EXPERIMENT_BY_ID = gql`
  query experiments($id: uuid!) {
    experiment: experiments_by_pk(id: $id) {
      ...ExperimentData
    }
  }
  ${ExperimentDataFragment}
`

export const CREATE_EXPERIMENT = gql`
  mutation insert_experiment($payload: [experiments_insert_input!]!) {
    insert_experiments(objects: $payload) {
      affected_rows
      returning {
        id
        name
        project_id
        created_at
        updated_at
      }
    }
  }
`

export const UPDATE_EXPERIMENT = gql`
  mutation update_experiments($id: uuid!, $payload: experiments_set_input!) {
    update_experiments(where: { id: { _eq: $id } }, _set: $payload) {
      returning {
        ...ExperimentData
      }
    }
  }
  ${ExperimentDataFragment}
`

export const UPDATE_NOTES = gql`
  mutation update_notes($experiment_id: uuid!, $payload: notes_set_input!) {
    update_notes(
      where: { experiment_id: { _eq: $experiment_id } }
      _set: $payload
    ) {
      returning {
        id
        image
        transcript
        created_at
        experiment {
          name
          created_at
          updated_at
        }
      }
    }
  }
`

export const NOTIFY_NEW_MESSAGES = gql`
  subscription notify_new_messages($id: uuid!) {
    messages(
      where: { experiment_id: { _eq: $id } }
      order_by: { created_at: asc }
    ) {
      id
      text
      created_at
      author {
        ...UserData
      }
      experiment {
        name
        created_at
        updated_at
      }
    }
  }
  ${UserDataFragment}
`

export const CREATE_MESSAGE = gql`
  mutation insert_message($payload: [messages_insert_input!]!) {
    insert_messages(objects: $payload) {
      affected_rows
      returning {
        id
        text
        author_id
        experiment_id
        created_at
        updated_at
      }
    }
  }
`

export const NOTIFY_NEW_NOTES = gql`
  subscription notify_new_notes($id: uuid!) {
    notes(
      where: { experiment_id: { _eq: $id } }
      order_by: { created_at: asc }
    ) {
      id
      image
      transcript
      created_at
      experiment {
        name
        created_at
        updated_at
      }
    }
  }
  ${UserDataFragment}
`
export const GET_EXPERIMENT_WITH_NEW_NOTES = gql`
  query experiments_with_new_notes {
    experiments(where: { notes: { is_summarized: { _eq: false } } }, limit: 1) {
      id
      name
      note
      created_at
      updated_at
      project {
        id
        name
      }
      notes(where: { is_summarized: { _eq: false } }) {
        id
        image
        created_at
      }
    }
  }
`

export const EXPERIMENT_WITH_NEW_NOTES_SUBSCRIPTION = gql`
  subscription experiments_with_new_notes {
    experiments(where: { notes: { is_summarized: { _eq: false } } }, limit: 1) {
      id
      name
      note
      created_at
      updated_at
      project {
        id
        name
      }
      notes(where: { is_summarized: { _eq: false } }) {
        id
        image
        created_at
      }
    }
  }
`

export const UPLOAD_SCAN = gql`
  mutation($payload: upload_scan_input!) {
    upload_scan(payload: $payload) {
      success
    }
  }
`

export const EMIT_TYPING_EVENT = gql`
  mutation update_users($payload: user_private_set_input!) {
    update_user_private(where: {}, _set: $payload) {
      affected_rows
    }
  }
`

export const NOTIFY_USER_TYPING = gql`
  subscription notify_user_typing($self_id: String!) {
    user_typing: users(
      where: { id: { _neq: $self_id } }
      limit: 1
      order_by: { last_typed: desc }
    ) {
      name
      last_typed
    }
  }
`

export const LOG_CREATE_EXPERIMENT = gql`
  mutation($payload: [events_insert_input!]!) {
    insert_events(objects: $payload) {
      affected_rows
      returning {
        created_at
      }
    }
  }
`
