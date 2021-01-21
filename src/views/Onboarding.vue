<template>
  <div>
    <transition name="slide-up" appear>
      <v-col class="col-lg-5 col-md-7">
        <transition name="slide-up" appear>
          <div>
            <h2 class="headline text-h6 my-5 px-2">What‘s your name?</h2>
            <form @submit.prevent="updateUser({ name })">
              <v-text-field
                label="Your name"
                placeholder="Dmitri Mendeleev"
                solo
                v-model="name"
              ></v-text-field>
              <v-btn
                color="primary mt-1"
                medium
                depressed
                rounded
                type="submit"
              >
                Continue
              </v-btn>
            </form>
          </div>
        </transition>
      </v-col>
    </transition>
  </div>
</template>

<script>
import { UPDATE_USER } from '@/state/gql/user.js'

export default {
  name: 'Onboarding',
  data() {
    return {
      name: '',
    }
  },
  methods: {
    updateUser(payload) {
      this.$apollo.mutate({
        mutation: UPDATE_USER,
        variables: { id: this.id, payload },
        update: (store, { data: { update_user_private } }) => {
          if (update_user_private.returning) {
            this.$router.push({ path: '/dashboard' })
          }
        },
      })
    },
  },
}
</script>
