<template>
  <div>
    <v-col class="col-lg-10 offset-lg-1 px-0">
      <transition name="slide-up" appear>
        <div v-if="!$apollo.loading">
          <v-card class="mx-auto py-3 px-4 pb-15">
            <v-list-item
              :class="{
                'pt-0 px-2': $vuetify.breakpoint.smAndDown,
                'pt-2': $vuetify.breakpoint.mdAndUp,
              }"
            >
              <v-list-item-content>
                <v-list-item-title
                  class="headline black--text"
                  :class="{
                    'text-h5': $vuetify.breakpoint.smAndDown,
                    'text-h4': $vuetify.breakpoint.mdAndUp,
                  }"
                >
                  <v-text-field
                    class="headline-edit pt-0 black--text"
                    :class="{
                      'text-h5': $vuetify.breakpoint.smAndDown,
                      'text-h4': $vuetify.breakpoint.mdAndUp,
                    }"
                    append-icon="mdi-check"
                    v-if="editingProjectName"
                    v-model="newProjectName"
                    @click:append="updateProjectName"
                    @keyup.enter="updateProjectName"
                  ></v-text-field>
                  <div
                    class="text-editable"
                    @click="editingProjectName = true"
                    v-else
                  >
                    {{ project.name }}
                  </div>
                </v-list-item-title>
                <v-list-item-subtitle class="pt-1">
                  <v-tooltip bottom transition="none">
                    <template v-slot:activator="{ on, attrs }">
                      <span class="mr-1" v-bind="attrs" v-on="on">
                        <v-icon small>mdi-flare</v-icon>
                        {{ $luxon(project.created_at, 'relative') }}
                      </span>
                    </template>
                    {{ $luxon(project.created_at, 'full') }}
                  </v-tooltip>
                  <v-tooltip bottom transition="none">
                    <template v-slot:activator="{ on, attrs }">
                      <span v-bind="attrs" v-on="on">
                        <v-icon small>mdi-pencil-outline</v-icon>
                        {{ $luxon(project.updated_at, 'relative') }}
                      </span>
                    </template>
                    {{ $luxon(project.updated_at, 'full') }}
                  </v-tooltip>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider class="my-5 mt-2"></v-divider>
            <v-layout class="d-flex flex-row mt-3 px-3">
              <Collaborators class="mr-4" :project="project" avatar_size="30" />
              <InviteCollaboratorModal
                :project="project"
                @inviteInfo="saveInviteInfo"
              />
              <v-spacer />
              <v-btn
                class="hidden-sm-and-down mr-2"
                color="primary"
                rounded
                depressed
                @click="createExperiment"
              >
                <v-icon left>
                  mdi-plus
                </v-icon>
                Experiment
              </v-btn>
              <v-menu left bottom transition="slide-y-transition">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" rounded icon>
                    <v-icon>
                      mdi-dots-vertical
                    </v-icon>
                  </v-btn>
                </template>

                <v-list dense>
                  <v-dialog
                    v-model="deleteProjectDialog"
                    persistent
                    max-width="400"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-list-item>
                        <v-list-item-icon>
                          <v-icon>mdi-archive-arrow-down-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>
                            Export archive
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item v-bind="attrs" v-on="on">
                        <v-list-item-icon>
                          <v-icon>mdi-text-box-remove-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>
                            Delete project
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                    <v-card>
                      <v-card-title class="text-overline font-weight-bold">
                        Delete project
                      </v-card-title>
                      <v-card-text>
                        Type the project name below to confirm deletion. This
                        action is irreversible.
                        <v-text-field
                          :label="project.name"
                          ref="deleteProjectName"
                          @keyup.enter="deleteProject()"
                        ></v-text-field>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" text @click="deleteProject()">
                          Delete
                        </v-btn>
                        <v-btn text @click="deleteProjectDialog = false">
                          Cancel
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-list>
              </v-menu>
            </v-layout>

            <v-divider class="my-5"></v-divider>

            <v-alert text color="grey" border="left" dense>
              <div class="black--text lighten-3">
                <TextEditor
                  :text="project.note"
                  :editable="true"
                  :showMenu="true"
                  :autosave="true"
                  @update="updateProject({ note: $event })"
                />
              </div>
            </v-alert>

            <div v-for="experiment in project.experiments" :key="experiment.id">
              <ExperimentCard
                :experiment="experiment"
                :author="project.author"
                :collaborators="project.project_collaborators"
                :inviteLog="invitationLog"
              />
            </div>
          </v-card>
        </div>
      </transition>
    </v-col>
  </div>
</template>

<script lang="ts">
// import isEqual from 'lodash.isequal'
import Collaborators from '@/components/Collaborators.vue'
import ExperimentCard from '@/components/ExperimentCard.vue'
import TextEditor from '@/components/TextEditor.vue'
import InviteCollaboratorModal from '@/components/InviteCollaboratorModal.vue'

import {
  GET_PROJECT_BY_ID,
  PROJECT_SUBSCRIPTION,
  GET_INVITATION_LOG_BY_USER_PROJECT_ID,
  UPDATE_PROJECT,
} from '@/state/gql/project.js'

import {
  CREATE_EXPERIMENT,
  LOG_CREATE_EXPERIMENT,
} from '@/state/gql/experiment.js'

export default {
  data() {
    return {
      deleteProjectDialog: false,
      editingProjectName: false,
      newProjectName: '',
      id: this.$route.params.project_id,
    }
  },
  props: ['author'],
  apollo: {
    project: {
      query: GET_PROJECT_BY_ID,
      loadingKey: 'loading',
      variables() {
        return { id: this.id }
      },
      update: function({ project }) {
        this.newProjectName = project.name

        return project
      },
      subscribeToMore: {
        document: PROJECT_SUBSCRIPTION,
        variables() {
          return { id: this.id }
        },
        updateQuery: (previousResult, { subscriptionData }) => {
          return subscriptionData.data
        },
      },
    },
    invitationLog: {
      query: GET_INVITATION_LOG_BY_USER_PROJECT_ID,
      loadingKey: 'loading',
      variables() {
        return {
          project_id: this.id,
          type: 'INVITE_SENT',
        }
      },
    },
  },
  methods: {
    updateProjectName() {
      this.updateProject({ name: this.newProjectName })
      this.editingProjectName = false
    },
    deleteProject: function() {
      if (
        this.project.name ===
        this.$refs.deleteProjectName.$el.querySelector('input').value
      ) {
        this.$apollo.mutate({
          mutation: UPDATE_PROJECT,
          variables: {
            id: this.id,
            payload: {
              is_deleted: true,
            },
          },
          update: (store, { data: { update_projects } }) => {
            if (update_projects.returning) {
              this.$router.push({ path: '/dashboard' })
            }
          },
        })
      }
    },
    createExperiment: function() {
      this.$apollo.mutate({
        mutation: CREATE_EXPERIMENT,
        variables: {
          payload: [
            {
              name: 'Experiment #' + (this.project.experiments.length + 1),
              project_id: this.$route.params.project_id,
            },
          ],
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
    updateProject: function(payload) {
      this.$apollo.mutate({
        mutation: UPDATE_PROJECT,
        variables: { id: this.id, payload },
      })
    },
    saveInviteInfo: function(info) {
      this.invitationLog = [...this.invitationLog, info]
    },
  },
  components: {
    Collaborators,
    ExperimentCard,
    TextEditor,
    InviteCollaboratorModal,
  },
}
</script>

<style lang="sass" scoped>
.v-list-item__title
  white-space: normal
</style>
