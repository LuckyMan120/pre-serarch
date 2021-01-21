<template>
  <v-container class="pa-4">
    <div class="mb-8">
      <v-row v-if="notes && notes.length">
        <Note v-for="note in notes" :key="note.id" :note="note" />
      </v-row>
      <div v-else class="mt-2">
        <div class="hidden-sm-and-down">
          Use the Presearch app to scan your handwritten notes.
          <div class="mt-3">
            <a href="#" class="mr-2"><img src="@/assets/app-android.png" width="150" /></a>
            <a href="#"><img src="@/assets/app-ios.png" width="150" /></a>
          </div>
        </div>
        <div class="hidden-md-and-up">
          Tap <v-icon class="mx-1">mdi-qrcode-scan</v-icon> to scan your handwritten notes.
        </div>
      </div>
    </div>
    <div class="hidden-sm-and-down">
      <div class="text-h5">Templates</div>
      <v-row>
        <NoteTemplate :experiment="experiment" template="Blank Dotted" />
        <NoteTemplate
          :experiment="experiment"
          template="Western Blot"
          icon="westernblot"
        />
        <NoteTemplate :experiment="experiment" template="qPCR" icon="qpcr" />
      </v-row>
    </div>
  </v-container>
</template>

<script>
import NoteTemplate from '@/components/NoteTemplate.vue'
import { NOTIFY_NEW_NOTES } from '@/state/gql/experiment.js'

import Note from '@/components/Note.vue'

export default {
  name: 'Notes',
  props: ['experiment'],
  data() {
    return {
      notes: [],
      error: null,
    }
  },
  apollo: {
    $subscribe: {
      notes: {
        query: NOTIFY_NEW_NOTES,
        loadingKey: 'loadingNotes',
        variables() {
          return {
            id: this.$route.params.experiment_id,
          }
        },
        result({ data }) {
          this.notes = data.notes
        },
      },
    },
  },
  components: {
    Note,
    NoteTemplate,
  },
}
</script>
