<template>
  <div>
    <v-col
      class="col-md-12 col-lg-10 offset-lg-1"
    >
      <div v-if="!$apollo.loading">
        <div v-if="experiment">
          <div class="subtitle text-overline black--text text-center">
            {{ experiment.project.name }} ⁘ {{ experiment.name }}
          </div>
          <transition-group name="slide-up" tag="div" appear>
            <Scan v-for="note in experiment.notes" :key="note.id" :note="note" />
          </transition-group>
          <div class="summary">
            <v-card class="pa-2 summary-input" color="amber lighten-4">
              <TextEditor
                text="<p></p>"
                :editable="true"
                :showMenu="true"
                placeholder="Summarize your notes (appended to the experiment summary)"
                @update="scanSummary = $event"
              />
              <v-row class="summary-ui pr-3 pb-3" justify="end">
                <v-btn tile text @click="updateExperimentSummary">
                  Add to summary
                </v-btn>
              </v-row>
            </v-card>
          </div>
        </div>
        <div v-else>
          <div class="subtitle text-overline black--text text-center">
            No scans to review
          </div>
          <div class="mt-2 text-center">
            <div class="hidden-sm-and-down">
              Use the Presearch app to scan your handwritten notes.
              <div class="mt-6">
                <a href="#" class="mr-2"><img src="@/assets/app-android.png" width="150" /></a>
                <a href="#"><img src="@/assets/app-ios.png" width="150" /></a>
              </div>
            </div>
            <div class="hidden-md-and-up">
              Tap <v-icon class="mx-1">mdi-qrcode-scan</v-icon> to scan your handwritten notes.
            </div>
          </div>
        </div>
      </div>
    </v-col>
  </div>
</template>

<script>
import {
  GET_EXPERIMENT_WITH_NEW_NOTES,
  UPDATE_EXPERIMENT,
  UPDATE_NOTES,
} from '@/state/gql/experiment.js'

import TextEditor from '@/components/TextEditor.vue'
import Scan from '@/components/Scan.vue'

export default {
  name: 'Scans',
  data() {
    return {
      experiment: {},
      scanSummary: '',
      error: null,
    }
  },
  apollo: {
    experiments: {
      query: GET_EXPERIMENT_WITH_NEW_NOTES,
      loadingKey: 'loading',
      result({ data }) {
        this.experiment = data.experiments[0]
      },
    },
  },
  methods: {
    updateExperimentSummary() {
      this.updateExperiment({
        note: this.experiment.note + this.scanSummary,
      })
      this.updateNotes({
        is_summarized: true,
      })
      this.$router.push({
        name: 'Experiment',
        params: {
          project_id: this.experiment.project.id,
          experiment_id: this.experiment.id,
        },
      })
    },
    updateExperiment: function(payload) {
      this.$apollo.mutate({
        mutation: UPDATE_EXPERIMENT,
        variables: { id: this.experiment.id, payload },
      })
    },
    updateNotes: function(payload) {
      this.$apollo.mutate({
        mutation: UPDATE_NOTES,
        variables: { experiment_id: this.experiment.id, payload },
      })
    },
  },
  components: {
    TextEditor,
    Scan,
  },
}
</script>

<style lang="sass" scoped>
.summary
  position: fixed
  left: 0
  bottom: 35px
  width: 100%
  .summary-input
    opacity: 0.97
    max-width: 850px
    margin: 0 auto

a
  text-decoration: none
.note
  .image
    width: 100%
</style>
