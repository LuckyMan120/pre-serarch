<template>
  <v-card
    class="mx-auto my-3 pa-2 pr-0 pb-5"
    flat
    outlined
    @click="goToExperiment(experiment.project_id, experiment.id)"
    v-ripple="{ class: `secondary--text` }"
  >
    <v-list-item three-line class="pt-2 align-start">
      <v-list-item-content class="py-0">
        <v-list-item-title
          class="headline black--text"
          :class="{
            'text-h6 font-weight-bold': $vuetify.breakpoint.smAndDown,
          }"
        >
          {{ experiment.name }}
        </v-list-item-title>
        <v-list-item-subtitle :title="this.$luxon(experiment.created_at)"
          >Started
          {{
            this.$luxon(experiment.created_at, 'relative')
          }}</v-list-item-subtitle
        >
        <div>
          <v-chip
            class="mt-2 text-uppercase font-weight-medium lighten-5"
            :class="{ 'pl-2': experiment.status == 'COMPLETED' }"
            :color="statusColor"
            :text-color="statusColor"
            small
          >
            <v-icon
              :color="statusColor"
              v-if="experiment.status == 'COMPLETED'"
              class="mr-1"
              small
              >mdi-lock</v-icon
            >
            {{ experiment.status.replace('_', ' ') }}
          </v-chip>
        </div>
      </v-list-item-content>
      <v-list-item-action class="align-start mt-0">
        <v-btn
          :color="experiment.is_bookmarked ? 'primary' : 'grey'"
          rounded
          icon
          @click.stop="
            updateExperiment({ is_bookmarked: !experiment.is_bookmarked })
          "
        >
          <v-icon>{{
            experiment.is_bookmarked ? 'mdi-bookmark' : 'mdi-bookmark-outline'
          }}</v-icon></v-btn
        >
      </v-list-item-action>
    </v-list-item>
  </v-card>
</template>

<script>
import { UPDATE_EXPERIMENT } from '@/state/gql/experiment.js'

export default {
  name: 'ExperimentCard',
  props: ['experiment', 'author', 'collaborators', 'inviteLog'],
  computed: {
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
  methods: {
    goToExperiment(project_id, id) {
      this.$router.push({
        name: 'Experiment',
        params: {
          project_id: project_id,
          experiment_id: id,
          author: this.author,
          inviteLog: this.inviteLog,
        },
      })
    },
    updateExperiment: function(payload) {
      this.$apollo.mutate({
        mutation: UPDATE_EXPERIMENT,
        variables: { id: this.experiment.id, payload },
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
.v-card:hover
  background: #f8f8f8
</style>
