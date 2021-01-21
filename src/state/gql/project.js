import gql from 'graphql-tag'
import { ExperimentDataFragment } from './experiment'
import { UserDataFragment } from './user'

export const ProjectDataFragment = gql`
  fragment ProjectData on projects {
    id
    name
    note
    created_at
    updated_at
    is_deleted
    author {
      ...UserData
    }
    project_collaborators {
      invite_email
      collaborator {
        ...UserData
      }
    }
  }
  ${UserDataFragment}
`

export const GET_PROJECTS = gql`
  query {
    projects(
      where: { is_deleted: { _eq: false } }
      order_by: { updated_at: desc }
    ) {
      ...ProjectData
      experiments(
        where: { is_deleted: { _eq: false } }
        order_by: { is_bookmarked: desc, created_at: desc }
      ) {
        ...ExperimentData
      }
    }
  }
  ${ProjectDataFragment}
  ${ExperimentDataFragment}
`

export const PROJECTS_SUBSCRIPTION = gql`
  subscription {
    projects(
      where: { is_deleted: { _eq: false } }
      order_by: { updated_at: desc }
    ) {
      ...ProjectData
      experiments(
        where: { is_deleted: { _eq: false } }
        order_by: { is_bookmarked: desc, created_at: desc }
      ) {
        ...ExperimentData
      }
    }
  }
  ${ProjectDataFragment}
  ${ExperimentDataFragment}
`

export const GET_PROJECT_BY_ID = gql`
  query projectsDetail($id: uuid!) {
    project: projects_by_pk(id: $id) {
      ...ProjectData
      experiments(
        where: { is_deleted: { _eq: false } }
        order_by: { is_bookmarked: desc, created_at: desc }
      ) {
        ...ExperimentData
      }
    }
  }
  ${ProjectDataFragment}
  ${ExperimentDataFragment}
`
export const GET_LOGS_BY_ID = gql`
  query logs(
    $project_id: uuid!
    $experiment_id: uuid!
    $type: event_type_enum!
  ) {
    logs: events(
      where: {
        project_id: { _eq: $project_id }
        experiment_id: { _eq: $experiment_id }
        type: { _neq: $type }
      }
    ) {
      merge_vars
      created_at
      type
      event_type {
        event_templates {
          template
        }
      }
    }
  }
`

export const PROJECT_SUBSCRIPTION = gql`
  subscription projects($id: uuid!) {
    project: projects_by_pk(id: $id) {
      ...ProjectData
      experiments(
        where: { is_deleted: { _eq: false } }
        order_by: { is_bookmarked: desc, created_at: desc }
      ) {
        ...ExperimentData
      }
    }
  }
  ${ProjectDataFragment}
  ${ExperimentDataFragment}
`

export const CREATE_PROJECT = gql`
  mutation($payload: [projects_insert_input!]!) {
    insert_projects(objects: $payload) {
      affected_rows
      returning {
        id
        name
        created_at
        updated_at
        experiments {
          id
          name
        }
      }
    }
  }
`

export const UPDATE_PROJECT = gql`
  mutation update_projects($id: uuid!, $payload: projects_set_input!) {
    update_projects(where: { id: { _eq: $id } }, _set: $payload) {
      returning {
        ...ProjectData
      }
    }
  }
  ${ProjectDataFragment}
`

export const INVITE_COLLABORATOR = gql`
  mutation invite_collaborator($payload: invite_collaborator_input!) {
    invite_collaborator(payload: $payload) {
      success
    }
  }
`
export const LOG_INVITATION = gql`
  mutation($payload: [events_insert_input!]!) {
    insert_events(objects: $payload) {
      returning {
        merge_vars
        created_at
        type
        event_type {
          event_templates {
            template
          }
        }
      }
    }
  }
`

export const GET_INVITATION_LOG_BY_USER_PROJECT_ID = gql`
  query($project_id: uuid!, $type: event_type_enum!) {
    invitationLog: events(
      where: { project_id: { _eq: $project_id }, type: { _eq: $type } }
    ) {
      merge_vars
      created_at
      type
      event_type {
        event_templates {
          template
        }
      }
    }
  }
`
