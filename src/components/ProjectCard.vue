<template>
  <v-card
    class="mx-auto"
    :class="{
      'my-4': $vuetify.breakpoint.smAndDown,
      'my-8': $vuetify.breakpoint.mdAndUp,
    }"
    @click="goToProject(project.id)"
    v-ripple="{ class: `secondary--text` }"
  >
    <v-list-item two-line class="pt-2">
      <v-list-item-content>
        <v-list-item-title
          class="headline text-xs-title black--text"
          :class="{
            'text-h6 font-weight-bold': $vuetify.breakpoint.smAndDown,
          }"
        >
          {{ project.name }}
        </v-list-item-title>
        <v-list-item-subtitle :title="this.$luxon(project.created_at)">{{
          this.$luxon(project.created_at, 'relative')
        }}</v-list-item-subtitle>
      </v-list-item-content>
      <v-spacer></v-spacer>
      <div class="reviewers align-self-start mt-3">
        <v-avatar color="secondary" size="24" class="mr-1"
          ><v-gravatar :email="project.author.email"
        /></v-avatar>
        <v-avatar
          color="secondary mr-1"
          size="24"
          v-for="collaborator in project.project_collaborators.collaborators"
          v-bind:key="collaborator.id"
        >
          <v-gravatar :email="collaborator.email" />
        </v-avatar>
      </div>
    </v-list-item>

    <v-card-text class="pt-1 pb-5">
      <v-btn medium depressed rounded small @click.stop="createExperiment">
        <v-icon left>
          mdi-plus
        </v-icon>
        Experiment
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import gql from 'graphql-tag'
import { LOG_CREATE_EXPERIMENT } from '@/state/gql/experiment.js'
import { GET_INVITATION_LOG_BY_USER_PROJECT_ID } from '@/state/gql/project.js'

const CREATE_EXPERIMENT = gql`
  mutation($name: String!, $projectId: uuid!) {
    insert_experiments(objects: { name: $name, project_id: $projectId }) {
      affected_rows
      returning {
        id
        name
        project_id
        created_at
      }
    }
  }
`

export default {
  name: 'ProjectCard',
  props: ['project'],
  apollo: {
    invitationLog: {
      query: GET_INVITATION_LOG_BY_USER_PROJECT_ID,
      loadingKey: 'loading',
      variables() {
        return {
          project_id: this.project.id,
          type: 'INVITE_SENT',
        }
      },
    },
  },
  methods: {
    goToProject(id) {
      this.$router.push({
        name: 'Project',
        params: { project_id: id, author: this.project.author },
      })
    },
    createExperiment: function() {
      this.$apollo.mutate({
        mutation: CREATE_EXPERIMENT,
        variables: {
          name: 'Experiment #' + (this.project.experiments.length + 1),
          projectId: this.project.id,
        },
        update: (cache, { data: { insert_experiments } }) => {
          // log new experiment
          this.$apollo.mutate({
            mutation: LOG_CREATE_EXPERIMENT,
            variables: {
              payload: [
                {
                  experiment_id: insert_experiments.returning[0].id,
                  project_id: insert_experiments.returning[0].project_id,
                  user_id: this.project.author.id,
                  type: 'EXPERIMENT_CREATED',
                  merge_vars: {
                    user_name: this.project.author.name,
                    experiment_name: insert_experiments.returning[0].name,
                  },
                },
              ],
            },
          })
          // Read the data from our cache for this query.
          // eslint-disable-next-line
          this.$router.push({
            name: 'Experiment',
            params: {
              project_id: insert_experiments.returning[0].project_id,
              experiment_id: insert_experiments.returning[0].id,
              author: this.project.author,
              inviteLog: this.invitationLog,
            },
          })
        },
      })
    },
  },
}
</script>

<style lang="sass" scoped>
.reviewers
  .v-avatar
    margin-right: 3px
.v-list-item__content
  flex: 8 1
.v-card
  transition: transform .2s
  &:hover
    transform: scale(1.03)
    box-shadow: 0px 7px 12px -4px rgba(0, 0, 0, 0.06), 0px 12px 21px 2px rgba(0, 0, 0, 0.04), 0px 5px 26px 4px rgba(0, 0, 0, 0.02) !important
</style>
