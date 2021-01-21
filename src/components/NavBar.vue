<template>
  <v-app-bar
    :class="{
      'app-bar-mobile': $vuetify.breakpoint.smAndDown,
      'mb-5': $vuetify.breakpoint.mdAndUp,
    }"
    color="white"
    flat
    :app="$vuetify.breakpoint.smAndDown"
  >
    <v-container
      class="v-align-center"
      :class="{
        'px-3 pr-0': $vuetify.breakpoint.smAndDown,
        'py-0 pt-12 px-0': $vuetify.breakpoint.mdAndUp,
      }"
    >
      <v-row align="center">
        <v-toolbar-title class="font-weight-black">
          <router-link to="/">
            <img
              class="ml-4 hidden-sm-and-down"
              src="@/assets/logo.svg"
              height="32"
            />
            <img
              class="hidden-md-and-up mt-2"
              src="@/assets/icon.svg"
              height="28"
            />
          </router-link>
        </v-toolbar-title>

        <div class="ml-6 hidden-sm-and-down">
          <v-btn to="/dashboard" active-class="no-active">
            <v-icon left>
              mdi-text-box-outline
            </v-icon>
            Projects
          </v-btn>
          <v-btn to="/scans" active-class="no-active">
            <v-badge color="primary" dot :value="scansToSummarize">
              <v-icon left>
                mdi-image-filter-center-focus
              </v-icon>
              Scans
            </v-badge>
          </v-btn>
        </div>

        <v-spacer></v-spacer>

        <transition name="fade" appear>
          <div v-if="user && user.email">
            <!-- <v-btn icon>
              <v-icon color="black">
                mdi-bell
              </v-icon>
            </v-btn> -->
            <v-menu
              left
              bottom
              transition="slide-y-transition"
              :offset-y="true"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  text
                  large
                  rounded
                  :icon="$vuetify.breakpoint.smAndDown"
                  class="ml-2 px-0"
                >
                  <v-avatar color="secondary" size="24"
                    ><v-gravatar :email="user.email"
                  /></v-avatar>
                  <v-icon class="hidden-sm-and-down ml-2"
                    >mdi-chevron-down</v-icon
                  >
                </v-btn>
              </template>

              <v-list style="width: 150px">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      Settings
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider />
                <v-list-item @click.prevent="handleLogout()">
                  <v-list-item-content>
                    <v-list-item-title>
                      Log out
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-btn
              class="ml-2 hidden-sm-and-down"
              :color="this.$route.name == 'Dashboard' ? 'primary' : ''"
              medium
              depressed
              rounded
              @click="createProject"
            >
              <v-icon left>
                mdi-plus
              </v-icon>
              Project
            </v-btn>
            <v-fab-transition>
              <v-btn
                class="hidden-md-and-up"
                v-if="this.$route.name == 'Dashboard'"
                @click="createProject"
                color="primary"
                elevation="8"
                fixed
                bottom
                right
                fab
              >
                <v-icon>mdi-text-box-plus-outline</v-icon>
              </v-btn>
            </v-fab-transition>
            <v-fab-transition>
              <v-btn
                class="hidden-md-and-up"
                v-if="this.$route.name == 'Project'"
                @click="createExperiment"
                color="primary"
                elevation="8"
                fixed
                bottom
                right
                fab
              >
                <v-icon>mdi-flask-plus-outline</v-icon>
              </v-btn>
            </v-fab-transition>
            <ScanButton />
          </div>
        </transition>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
import { Magic } from 'magic-sdk'
import ScanButton from './ScanButton.vue'
const magic = new Magic(process.env.VUE_APP_MAGIC_PUBLISHABLE_KEY)

import { USER_SUBSCRIPTION, UPDATE_USER } from '@/state/gql/user.js'
import { GET_PROJECT_BY_ID, CREATE_PROJECT } from '@/state/gql/project.js'
import {
  CREATE_EXPERIMENT,
  GET_EXPERIMENT_WITH_NEW_NOTES,
  EXPERIMENT_WITH_NEW_NOTES_SUBSCRIPTION,
  LOG_CREATE_EXPERIMENT,
} from '@/state/gql/experiment.js'

export default {
  name: 'NavBar',
  components: {
    ScanButton,
  },
  data() {
    return {
      isLoggedIn: false,
      scansToSummarize: 0,
      user: {},
      project: {},
    }
  },
  apollo: {
    experiments: {
      query: GET_EXPERIMENT_WITH_NEW_NOTES,
      loadingKey: 'loading',
      result({ data }) {
        this.scansToSummarize = data.experiments.length
      },
      subscribeToMore: {
        document: EXPERIMENT_WITH_NEW_NOTES_SUBSCRIPTION,
        updateQuery: (previousResult, { subscriptionData }) => {
          return subscriptionData.data
        },
      },
    },
    $subscribe: {
      user: {
        query: USER_SUBSCRIPTION,
        result({ data: { user } }) {
          user = user[0]
          if (user && !user.name) {
            this.$router.push({ name: 'Onboarding' })
          } else if (this.$route.name === 'Onboarding') {
            this.$router.push({ name: 'Dashboard' })
          }
          this.user = user
        },
        skip() {
          return !this.isLoggedIn
        },
      },
    },
  },
  computed: {
    projectId() {
      return this.$route.params.project_id
    },
  },
  watch: {
    projectId: function(value) {
      if (value) {
        this.$apollo
          .query({
            query: GET_PROJECT_BY_ID,
            loadingKey: 'loading',
            variables: {
              id: value,
            },
          })
          .then(result => {
            this.project = result.data.project
          })
      }
    },
  },
  mounted() {
    this.updateLoginStatus()
    this.$root.$on('loggedIn', () => {
      this.updateLoginStatus()
    })
    setInterval(
      function() {
        this.$apollo
          .mutate({
            mutation: UPDATE_USER,
            variables: {
              payload: { last_seen: new Date().toISOString() },
            },
          })
          .catch(error => {
            console.error(error)
          })
      }.bind(this),
      30000
    )
  },
  methods: {
    async updateLoginStatus() {
      this.isLoggedIn = await magic.user.isLoggedIn()
    },
    async handleLogout() {
      await magic.user.logout()
      localStorage.removeItem('access_token')
      this.$router.push({ path: '/' })
      this.isLoggedIn = false
    },
    createProject: function() {
      // create Project and first Experiment
      this.$apollo.mutate({
        mutation: CREATE_PROJECT,
        variables: {
          payload: [
            {
              name: 'Untitled',
              author_id: this.user.id,
              experiments: {
                data: {
                  name: 'Experiment #1',
                },
              },
            },
          ],
        },
        update: (cache, { data: { insert_projects } }) => {
          // log Creating First Experiment
          this.$apollo.mutate({
            mutation: LOG_CREATE_EXPERIMENT,
            variables: {
              payload: [
                {
                  experiment_id: insert_projects.returning[0].experiments[0].id,
                  project_id: insert_projects.returning[0].id,
                  user_id: this.user.id,
                  type: 'EXPERIMENT_CREATED',
                  merge_vars: {
                    user_name: this.user.name,
                    experiment_name:
                      insert_projects.returning[0].experiments[0].name,
                  },
                },
              ],
            },
          })

          // go project page
          this.$router.push({
            name: 'Project',
            params: {
              project_id: insert_projects.returning[0].id,
            },
          })
        },
      })
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
          // Read the data from our cache for this query.
          // eslint-disable-next-line
          this.$router.push({
            name: 'Experiment',
            params: {
              project_id: insert_experiments.returning[0].project.id,
              experiment_id: insert_experiments.returning[0].id,
            },
          })
        },
      })
    },
  },
}
</script>

<style lang="sass" scoped>
.v-toolbar
  flex: none
.v-application .app-bar-mobile
  transform: none !important
  contain: none !important
  border-bottom: 1px solid #ddd !important
.v-btn--active.no-active:not(:focus):not(:hover)::before
  opacity: 0 !important
</style>
