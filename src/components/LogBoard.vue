<template>
  <v-list-item>
    <v-list-item-avatar>
      <v-gravatar :email="email" />
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title>
        {{ $luxon(created_at, 'yyyy-MM-dd, hh:mm') }}
      </v-list-item-title>
      <v-list-item-subtitle v-html="text"> </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  name: 'LogBoard',
  props: ['email', 'created_at', 'type', 'template', 'variables'],
  data() {
    return {
      text: '',
    }
  },
  mounted() {
    switch (this.type) {
      case 'EXPERIMENT_CREATED':
        this.text =
          this.variables.user_name +
          ' created ' +
          this.variables.experiment_name +
          '.'
        break
      case 'EXPERIMENT_RENAMED':
        this.text =
          this.variables.user_name +
          ' renamed ' +
          this.variables.experiment_name_old +
          ' to ' +
          this.variables.experiment_name_new +
          '.'
        break
      case 'EXPERIMENT_STATUS_CHANGED':
        this.text =
          this.variables.user_name +
          ' changed ' +
          this.variables.experiment_name +
          ' status to ' +
          this.variables.experiment_status +
          '.'
        break
      case 'INVITE_SENT':
        this.text =
          this.variables.user_name +
          ' invited ' +
          this.variables.another_user_name +
          '.'
        break
      default:
        return false
    }
  },
}
</script>
