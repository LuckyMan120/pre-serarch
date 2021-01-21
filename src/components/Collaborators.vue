<template>
  <div class="collaborators">
    <div
      class="collaborator"
      :class="{
        is_online: recentlyOnline(project.author),
      }"
      :style="`z-index: ${collaborators.length + 1}`"
    >
      <v-tooltip bottom transition="none">
        <template v-slot:activator="{ on, attrs }">
          <v-avatar
            color="secondary"
            :size="avatar_size"
            v-bind="attrs"
            v-on="on"
          >
            <v-gravatar :email="project.author.email" />
          </v-avatar>
        </template>
        <div class="text-center">
          <strong>{{ project.author.name }}</strong>
          <br />
          {{ project.author.email }}
        </div>
      </v-tooltip>
    </div>
    <div
      class="collaborator"
      :class="{
        is_online: recentlyOnline(collaborator),
      }"
      :style="`z-index: ${collaborators.length - i}`"
      v-for="(collaborator, i) in collaborators"
      v-bind:key="collaborator.id"
    >
      <v-tooltip bottom transition="none">
        <template v-slot:activator="{ on, attrs }">
          <v-avatar
            color="secondary"
            :size="avatar_size"
            v-bind="attrs"
            v-on="on"
          >
            <v-gravatar :email="collaborator.email" />
          </v-avatar>
        </template>
        <div class="text-center">
          <strong>{{ collaborator.name }}</strong>
          <br />
          {{ collaborator.email }}
        </div>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Collaborators',
  props: ['project', 'avatar_size'],
  methods: {
    recentlyOnline(user) {
      const TEN_MINUTES = 10 * 60 * 1000
      const now = +new Date()
      let recentlyOnline = now - Date.parse(user.last_seen) < TEN_MINUTES
      return recentlyOnline
    },
  },
  computed: {
    collaborators() {
      return this.project.project_collaborators
        .map(x => x.collaborator)
        .filter(x => !!x)
    },
  },
}
</script>

<style lang="sass" scoped>
.collaborators
  align-items: center
  display: flex
  .collaborator
    margin-top: -2px !important
    margin-right: -10px !important
    position: relative
    display: inline-flex
    img
      border: 2px fff solid
    &:last-child
      margin-right: 0
    &:not(.is_online)
      img
        opacity: 0.5
</style>
