<template>
  <v-container class="pa-4">
    <div ref="messages" class="messages">
      <div class="message">
        <v-card flat>
          <v-card-text class="pa-0 pb-3">
            <div>
              <v-avatar size="24" class="mr-2 black" left>
                <v-icon color="white" small
                  >mdi-star-four-points-outline</v-icon
                >
              </v-avatar>
              <span class="font-weight-bold">New discussion</span>
            </div>
            <div class="pl-8">
              May we together become greater than the sum of us.
            </div>
          </v-card-text>
        </v-card>
      </div>
      <Message
        v-for="message in messages"
        :key="message.id"
        :message="message"
      />
    </div>
    <v-card flat class="mb-5">
      <v-list class="pa-0">
        <v-list-item class="pl-1 pr-0">
          <v-text-field
            :label="'Send a message'"
            @click:append="sendMessage"
            @keydown.enter="sendMessage"
            autocomplete="off"
            color="primary"
            flat
            hide-details
            maxlength="1023"
            append-icon="mdi-send"
            placeholder="Send a message"
            solo
            v-model="newMessage"
          ></v-text-field>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
import { USER_SUBSCRIPTION } from '@/state/gql/user.js'
import {
  EMIT_TYPING_EVENT,
  NOTIFY_NEW_MESSAGES,
  CREATE_MESSAGE,
} from '@/state/gql/experiment.js'

import Message from '@/components/Message.vue'

export default {
  name: 'Messages',
  components: {
    Message,
  },
  data() {
    return {
      user: {},
      messages: [],
      error: null,
      newMessage: '',
      visibility: 'all',
    }
  },
  apollo: {
    $subscribe: {
      user: {
        query: USER_SUBSCRIPTION,
        loadingKey: 'loadingUser',
        result({ data: { user } }) {
          this.user = user[0]
        },
      },
      messages: {
        query: NOTIFY_NEW_MESSAGES,
        loadingKey: 'loadingMessages',
        variables() {
          return {
            id: this.$route.params.experiment_id,
          }
        },
        result({ data }) {
          this.messages = data.messages
        },
      },
    },
  },
  watch: {
    newMessage: function(value) {
      if (
        (value.length !== 0 && value.length % 5 === 0) ||
        value.length === 1
      ) {
        this.emitTypingEvent()
      }
    },
  },
  methods: {
    emitTypingEvent() {
      this.$apollo.mutate({
        mutation: EMIT_TYPING_EVENT,
        variables: {
          payload: {
            last_typed: 'now()',
          },
        },
      })
    },
    sendMessage: function() {
      const text = this.newMessage && this.newMessage.trim()
      if (text.length > 0) {
        this.$apollo.mutate({
          mutation: CREATE_MESSAGE,
          variables: {
            payload: [
              {
                text,
                experiment_id: this.$route.params.experiment_id,
              },
            ],
          },
        })
        this.newMessage = ''
      }
    },
  },
  updated: function() {
    const el = this.$refs.messages
    el.scrollTop = el.scrollHeight
  },
  filters: {
    pluralize: (n, w) => (n === 1 ? w : w + 's'),
    capitalize: s => s.charAt(0).toUpperCase() + s.slice(1),
  },
}
</script>

<style lang="sass" scoped>
.messages
  height: calc(100vh - 475px)
  overflow-y: scroll
.message
  .v-card
    border: none !important
  .v-avatar
    border: 1px solid ddd
  .timestamp
    color: grey
    font-size: 0.75rem
.v-text-field .v-input__slot
  padding: 0 !important
</style>
