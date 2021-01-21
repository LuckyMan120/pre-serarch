<template>
  <div>
    <v-col class="col-lg-10 offset-lg-1 px-0">
      <transition name="slide-up" appear>
        <v-breadcrumbs :items="breadcrumbs" divider="·"></v-breadcrumbs>
      </transition>
      <transition name="slide-up-over" appear>
        <div>
          <v-card class="mx-auto py-3 px-4 pb-8" v-if="!$apollo.loading">
            <v-list>
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
                      v-if="editingExperimentName"
                      v-model="newExperimentName"
                      @click:append="updateExperimentName"
                      @keyup.enter="updateExperimentName"
                    ></v-text-field>
                    <div
                      class="text-editable"
                      @click="editingExperimentName = true"
                      v-else
                    >
                      {{ experiment.name }}
                    </div>
                  </v-list-item-title>
                  <v-list-item-subtitle class="pt-1">
                    <v-tooltip bottom transition="none">
                      <template v-slot:activator="{ on, attrs }">
                        <span class="mr-1" v-bind="attrs" v-on="on">
                          <v-icon small>mdi-flare</v-icon>
                          {{ $luxon(experiment.created_at, 'relative') }}
                        </span>
                      </template>
                      {{ $luxon(experiment.created_at, 'full') }}
                    </v-tooltip>
                    <v-tooltip bottom transition="none">
                      <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on">
                          <v-icon small>mdi-pencil-outline</v-icon>
                          {{ $luxon(experiment.updated_at, 'relative') }}
                        </span>
                      </template>
                      {{ $luxon(experiment.updated_at, 'full') }}
                    </v-tooltip>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <v-divider class="my-5 mt-2"></v-divider>

            <v-layout class="d-flex flex-row mt-3 px-3">
              <v-menu left bottom transition="slide-y-transition" rounded="lg">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    :color="statusColor + ' lighten-5'"
                    class="text-uppercase"
                    :class="statusColor + '--text'"
                    depressed
                    rounded
                  >
                    <v-icon v-if="locked" class="mr-2" small>mdi-lock</v-icon>
                    {{ experiment.status.replace('_', ' ') }}
                    <v-icon>mdi-chevron-down</v-icon>
                  </v-btn>
                </template>

                <v-list dense>
                  <v-list-item
                    @click="updateExperiment({ status: 'IN_PROGRESS' })"
                  >
                    <v-list-item-icon>
                      <v-icon color="orange">mdi-dots-horizontal-circle</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        In progress
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    @click="updateExperiment({ status: 'COMPLETED' })"
                  >
                    <v-list-item-icon>
                      <v-icon color="green">mdi-check-circle</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        Completed
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="updateExperiment({ status: 'BLOCKED' })">
                    <v-list-item-icon>
                      <v-icon color="primary">mdi-alert-circle</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        Blocked
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-spacer />
              <v-menu left bottom transition="slide-y-transition">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" rounded icon>
                    <v-icon>
                      mdi-dots-vertical
                    </v-icon>
                  </v-btn>
                </template>

                <v-list dense>
                  <v-list-item-group>
                    <v-dialog
                      v-model="activityLogDialog"
                      scrollable
                      max-width="560"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-list-item v-bind="attrs" v-on="on">
                          <v-list-item-icon>
                            <v-icon>mdi-history</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>
                              Activity log
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                      <v-card>
                        <v-card-title class="text-overline font-weight-bold">
                          Activity log (placeholder)
                        </v-card-title>
                        <div>
                          <v-list two-line>
                            <!-- logs of changes -->
                            <LogBoard
                              v-show="logChanges.length > 0"
                              v-for="(logChange, index) in logChanges"
                              :key="index + 'change'"
                              :email="author.email"
                              :created_at="logChange.created_at"
                              :type="logChange.type"
                              :template="
                                logChange.event_type.event_templates[0].template
                              "
                              :variables="logChange.merge_vars"
                            />

                            <!-- invitation logs -->
                            <LogBoard
                              v-show="inviteLog.length > 0"
                              v-for="(invite, index) in inviteLog"
                              :key="index + 'invite'"
                              :email="author.email"
                              :created_at="invite.created_at"
                              :type="invite.type"
                              :template="
                                invite.event_type.event_templates[0].template
                              "
                              :variables="invite.merge_vars"
                            />

                            <!-- extra logs -->
                            <LogBoard
                              v-for="(log, index) in logs"
                              :key="index"
                              :email="author.email"
                              :created_at="log.created_at"
                              :type="log.type"
                              :template="
                                log.event_type.event_templates[0].template
                              "
                              :variables="log.merge_vars"
                            />
                          </v-list>
                        </div>
                      </v-card>
                    </v-dialog>
                    <v-dialog
                      v-model="deleteExperimentDialog"
                      persistent
                      max-width="400"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-list-item v-bind="attrs" v-on="on">
                          <v-list-item-icon>
                            <v-icon>mdi-flask-remove-outline</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>
                              Delete experiment
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                      <v-card>
                        <v-card-title class="text-overline font-weight-bold">
                          Delete experiment
                        </v-card-title>
                        <v-card-text>
                          Type the experiment name below to confirm deletion.
                          This action is irreversible.
                          <v-text-field
                            :label="experiment.name"
                            ref="deleteExperimentName"
                            @keyup.enter="deleteExperiment()"
                          ></v-text-field>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            color="primary"
                            text
                            @click="deleteExperiment()"
                          >
                            Delete
                          </v-btn>
                          <v-btn text @click="deleteExperimentDialog = false">
                            Cancel
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-list-item-group>
                </v-list>
              </v-menu>
            </v-layout>

            <v-divider class="my-5"></v-divider>

            <v-tabs class="mt-2" v-model="tab">
              <v-tab class="font-weight-bold" key="summary">
                Summary
              </v-tab>
              <v-tab class="font-weight-bold" key="notes">
                Notes
              </v-tab>
              <v-tab class="font-weight-bold" key="discussion">
                <v-badge color="primary" dot>
                  <span class="hidden-sm-and-down">Discussion</span>
                  <v-btn class="hidden-md-and-up" icon depressed>
                    <v-icon>
                      mdi-message-text-outline
                    </v-icon>
                  </v-btn>
                </v-badge>
              </v-tab>
            </v-tabs>

            <v-divider class="mb-2"></v-divider>

            <v-tabs-items v-model="tab">
              <v-tab-item key="summary">
                <TextEditor
                  :text="experiment.note"
                  :editable="!locked"
                  :showMenu="!locked"
                  :autosave="true"
                  @update="updateExperiment({ note: $event })"
                />
              </v-tab-item>
              <v-tab-item key="notes">
                <Notes :experiment="experiment" />
              </v-tab-item>
              <v-tab-item key="discussion">
                <Messages />
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </div>
      </transition>
    </v-col>
  </div>
</template>

<script lang="ts">
import Notes from '@/components/Notes.vue'
import Messages from '@/components/Messages.vue'
import TextEditor from '@/components/TextEditor.vue'
import LogBoard from '@/components/LogBoard.vue'

import { GET_LOGS_BY_ID, LOG_INVITATION } from '@/state/gql/project.js'

import {
  GET_EXPERIMENT_BY_ID,
  CREATE_EXPERIMENT,
  UPDATE_EXPERIMENT,
} from '@/state/gql/experiment.js'

export default {
  name: 'Experiment',
  data() {
    return {
      breadcrumbs: [],
      tab: null,
      activityLogDialog: false,
      deleteExperimentDialog: false,
      editingExperimentName: false,
      newExperimentName: '',
      id: this.$route.params.experiment_id,
      logChanges: [],
    }
  },
  props: ['author', 'inviteLog'],
  computed: {
    locked() {
      return this.experiment.status == 'COMPLETED'
    },
    statusColor() {
      let color
      switch (this.experiment.status) {
        case 'IN_PROGRESS':
          color = 'orange'
          break

        case 'COMPLETED':
          color = 'green'
          break

        case 'BLOCKED':
          color = 'red'
          break
      }
      return color
    },
  },
  apollo: {
    experiment: {
      query: GET_EXPERIMENT_BY_ID,
      loadingKey: 'loading',
      variables() {
        return { id: this.id }
      },
      update: function({ experiment }) {
        this.newExperimentName = experiment.name
        this.breadcrumbs = [
          {
            text: experiment.project.name,
            disabled: false,
            exact: true,
            to: { path: '/project/' + experiment.project_id },
          },
        ]

        return experiment
      },
    },
    logs: {
      query: GET_LOGS_BY_ID,
      loadingKey: 'loading',
      variables() {
        return {
          project_id: this.$route.params.project_id,
          experiment_id: this.$route.params.experiment_id,
          type: 'INVITE_SENT',
        }
      },
    },
  },
  methods: {
    updateExperimentName() {
      this.updateExperiment({ name: this.newExperimentName })
      this.editingExperimentName = false
    },
    duplicateExperiment() {
      this.$apollo.mutate({
        mutation: CREATE_EXPERIMENT,
        variables: {
          payload: [
            {
              name: this.experiment.name + ' (copy)',
              note: this.experiment.note,
              project_id: this.experiment.project_id,
            },
          ],
        },
        update: (cache, { data: { insert_experiments } }) => {
          // Read the data from our cache for this query.
          // eslint-disable-next-line
          this.$router.push({
            name: 'Experiment',
            params: {
              project_id: insert_experiments.returning[0].project_id,
              experiment_id: insert_experiments.returning[0].id,
            },
          })
        },
      })
    },
    deleteExperiment: function() {
      if (
        this.experiment.name ===
        this.$refs.deleteExperimentName.$el.querySelector('input').value
      ) {
        this.$apollo.mutate({
          mutation: UPDATE_EXPERIMENT,
          variables: {
            id: this.id,
            payload: {
              is_deleted: true,
            },
          },
          update: (store, { data: { update_experiments } }) => {
            if (update_experiments.returning) {
              this.$router.push({
                name: 'Project',
                params: { project_id: this.$route.params.project_id },
              })
            }
          },
        })
      }
    },
    updateExperiment: function(payload) {
      this.$apollo.mutate({
        mutation: UPDATE_EXPERIMENT,
        variables: { id: this.id, payload },
      })

      // log with type
      Object.keys(payload).forEach(item => {
        if (item === 'name') {
          this.$apollo.mutate({
            mutation: LOG_INVITATION,
            variables: {
              payload: [
                {
                  experiment_id: this.experiment.id,
                  project_id: this.experiment.project_id,
                  user_id: this.author.id,
                  type: 'EXPERIMENT_RENAMED',
                  merge_vars: {
                    user_name: this.author.name,
                    experiment_name_old: this.experiment.name,
                    experiment_name_new: this.newExperimentName,
                  },
                },
              ],
            },
            update: (cache, { data: { insert_events } }) => {
              this.logChanges.unshift(insert_events.returning[0])
            },
          })
        } else if (item === 'status') {
          this.$apollo.mutate({
            mutation: LOG_INVITATION,
            variables: {
              payload: [
                {
                  experiment_id: this.experiment.id,
                  project_id: this.experiment.project_id,
                  user_id: this.author.id,
                  type: 'EXPERIMENT_STATUS_CHANGED',
                  merge_vars: {
                    user_name: this.author.name,
                    experiment_name: this.experiment.name,
                    experiment_status: payload.status,
                  },
                },
              ],
            },
            update: (cache, { data: { insert_events } }) => {
              this.logChanges.unshift(insert_events.returning[0])
            },
          })
        }
      })
    },
  },
  components: {
    Notes,
    Messages,
    TextEditor,
    LogBoard,
  },
}
</script>
<style lang="sass" scoped>
.v-list-item__title
  white-space: normal
</style>
