<template>
  <div>
    <v-fab-transition>
      <v-btn
        class="hidden-md-and-up"
        v-if="this.$route.name == 'Experiment'"
        color="primary"
        elevation="8"
        fixed
        bottom
        right
        fab
        @click="scan"
      >
        <v-icon>mdi-qrcode-scan</v-icon>
      </v-btn>
    </v-fab-transition>
    <v-snackbar v-model="snackbar" :timeout="3000">{{ message }}</v-snackbar>
  </div>
</template>

<script>
import { Plugins } from '@capacitor/core'

import { UPLOAD_SCAN } from '@/state/gql/experiment.js'

export default {
  name: 'ScanButton',
  data: function() {
    return {
      snackbar: false,
      message: '',
    }
  },
  methods: {
    async scan() {
      // eslint-disable-next-line no-undef
      cordova.plugins.GeniusScan.scanWithConfiguration(
        { source: 'camera', multiPage: false, highlightColor: '#dd2c00' },
        this.upload,
        error => {
          console.log(error)
          this.message = error.message
          this.snackbar = true
        }
      )
    },
    async upload(scan) {
      try {
        const { experiment_id } = this.$route.params

        const imageFile = await Plugins.Filesystem.readFile({
          path: scan.scans[0].enhancedUrl,
        })
        const image_upload = imageFile.data

        await this.$apollo.mutate({
          mutation: UPLOAD_SCAN,
          variables: {
            payload: {
              experiment_id,
              image_upload,
            },
          },
        })

        this.message = 'Scan uploaded.'
      } catch (error) {
        console.log(error)
        this.message = error.message
      } finally {
        this.snackbar = true
      }
    },
  },
}
</script>
