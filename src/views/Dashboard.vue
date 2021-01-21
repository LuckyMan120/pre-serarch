<template>
  <div>
    <v-col
      class="col-lg-8 offset-lg-2 col-md-10 offset-md-1"
      :class="{
        'px-0 pt-0': $vuetify.breakpoint.smAndDown,
      }"
    >
      <div class="subtitle text-overline black--text text-center">
        My projects
      </div>
      <transition-group name="slide-up" tag="div" appear>
        <v-card class="mt-4 mb-8" v-if="$apollo.loading" key="skeleton">
          <v-skeleton-loader
            type="card-heading, divider, list-item-three-line"
          ></v-skeleton-loader>
        </v-card>
        <div v-else key="projects">
          <div v-for="project in projects" :key="project.id">
            <ProjectCard :project="project" />
          </div>
        </div>
      </transition-group>
    </v-col>
  </div>
</template>

<script>
import ProjectCard from '@/components/ProjectCard.vue'

import { GET_PROJECTS, PROJECTS_SUBSCRIPTION } from '@/state/gql/project.js'

export default {
  name: 'Dashboard',
  data() {
    return {
      projects: [],
    }
  },
  apollo: {
    projects: {
      query: GET_PROJECTS,
      subscribeToMore: {
        document: PROJECTS_SUBSCRIPTION,
        updateQuery: (previousResult, { subscriptionData }) => {
          return subscriptionData.data
        },
      },
    },
  },
  components: {
    ProjectCard,
  },
}
</script>

<style lang="sass" scoped>
.new-project
  box-shadow: none !important
  border-style: dashed !important
  text-transform: uppercase
  .headline
    font-size: 1em !important
    color: #666 !important
    span
      vertical-align: middle
</style>
