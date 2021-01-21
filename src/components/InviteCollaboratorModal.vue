<template>
  <v-dialog class="rounded-lg" v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="hidden-sm-and-down"
        color="primary"
        rounded
        depressed
        v-bind="attrs"
        v-on="on"
      >
        <v-icon left>
          mdi-account-plus-outline
        </v-icon>
        Share
      </v-btn>
      <v-btn
        class="hidden-md-and-up"
        color="primary"
        icon
        depressed
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>
          mdi-account-plus-outline
        </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Invite a collaborator</span>
      </v-card-title>
      <v-card-text>
        <v-text-field
          label="Email"
          placeholder="nicola@example.lab"
          v-model="email"
        />
        <v-container>
          <v-row>
            <v-spacer></v-spacer>
            <v-btn color="primary" rounded @click="sendInvite">
              Send invite
            </v-btn>
          </v-row>
        </v-container>
        <v-list two-line>
          <v-list-item class="px-0" :key="project.author.id">
            <v-list-item-avatar class="my-0">
              <v-gravatar :email="project.author.email" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title
                v-html="project.author.name"
              ></v-list-item-title>
              <v-list-item-subtitle>Author</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <template v-for="collaborator in collaborators">
            <v-list-item class="px-0" :key="collaborator.id">
              <v-list-item-avatar class="my-0">
                <v-gravatar :email="collaborator.email" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{
                  collaborator.name || collaborator.email
                }}</v-list-item-title>
                <v-list-item-subtitle>Collaborator</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon>
                  <v-icon color="grey">mdi-close</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { INVITE_COLLABORATOR, LOG_INVITATION } from '@/state/gql/project.js'

export default {
  name: 'InviteCollaboratorModal',
  props: ['project'],
  data() {
    return {
      dialog: false,
      email: '',
    }
  },
  methods: {
    async sendInvite() {
      const email = this.email
      if (email) {
        await this.$apollo.mutate({
          mutation: INVITE_COLLABORATOR,
          variables: {
            payload: { project_id: this.project.id, email },
          },
        })

        // log invitations for each experiment
        await this.$apollo.mutate({
          mutation: LOG_INVITATION,
          variables: {
            payload: [
              {
                experiment_id: this.project.experiments[0].id,
                project_id: this.project.id,
                user_id: this.project.author.id,
                type: 'INVITE_SENT',
                merge_vars: {
                  user_name: this.project.author.name,
                  another_user_name: this.email,
                },
              },
            ],
          },
          update: (cache, { data: { insert_events } }) => {
            this.$emit('inviteInfo', insert_events.returning[0])
          },
        })

        this.dialog = false
      }
    },
  },
  computed: {
    collaborators() {
      return this.project.project_collaborators.map(
        x => x.collaborator || { email: x.invite_email }
      )
    },
  },
}
</script>
