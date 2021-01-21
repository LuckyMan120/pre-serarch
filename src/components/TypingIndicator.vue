<template>
  <div class="typing-indicator">
    {{ text }}
  </div>
</template>

<script>
import { NOTIFY_USER_TYPING } from '@/state/gql/experiment.js'

export default {
  name: 'TypingIndicator',
  data() {
    return {
      text: '',
    }
  },
  props: ['self_id'],
  apollo: {
    $subscribe: {
      userTyping: {
        query: NOTIFY_USER_TYPING,
        variables() {
          return {
            self_id: this.self_id,
          }
        },
        result({ data }) {
          if (data.user_typing.length !== 0) {
            this.text = `${data.user_typing[0].name} is typing...`
          } else {
            this.text = ''
          }
        },
      },
    },
  },
}
</script>

<style lang="sass" scoped>
.typing-indicator
  color: #aaa
  font-weight: 600
  font-size: 0.9em
</style>
