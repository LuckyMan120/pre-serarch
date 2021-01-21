<template>
  <div class="message">
    <v-card flat>
      <v-card-text class="pa-0 pb-3">
        <div>
          <v-avatar size="24" class="mr-2" left>
            <v-gravatar :email="message.author.email" />
          </v-avatar>
          <span class="font-weight-bold">{{ message.author.name }}</span>
          <span class="timestamp ml-2 mt-2">{{
            this.$luxon(message.created_at, 'HH:mm')
          }}</span>
        </div>
        <div class="pl-8">
          {{ message.text }}
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'Messages',
  props: ['message'],
  directives: {
    focus(el, { value }, { context }) {
      if (value) {
        context.$nextTick(() => {
          context.$refs.input.focus()
        })
      }
    },
  },
}
</script>

<style lang="sass" scoped>
.message
  .v-card
    border: none !important
  .v-avatar
    border: 1px solid #ddd
  .timestamp
    color: grey
    font-size: 0.75rem
</style>
