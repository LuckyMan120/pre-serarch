<template>
  <div>
    <h2 class="headline text-h6 my-5 px-2">
      Enter your email to log in or sign up
    </h2>
    <form @submit.prevent="handleLogin">
      <v-text-field
        label="Your email"
        placeholder="darwin@example.lab"
        solo
        v-model="email"
      ></v-text-field>
      <!-- {{ magic.auth.loading }}
      {{ magic.auth.loggingIn }}
      {{ magic.auth.loggingOut }} -->
      <v-btn
        color="primary mt-1"
        medium
        depressed
        rounded
        type="submit"
        :loading="loggingIn"
      >
        <v-icon left>mdi-shield-key</v-icon>
        Enter Presearch
      </v-btn>
    </form>
  </div>
</template>

<script>
import { Magic } from 'magic-sdk'
import gql from 'graphql-tag'
import { onLogin } from '../vue-apollo'

const magic = new Magic(process.env.VUE_APP_MAGIC_PUBLISHABLE_KEY)

const AUTHENTICATE = gql`
  mutation($didToken: String!) {
    authenticate(didToken: $didToken) {
      success
      token
    }
  }
`

export default {
  name: 'AuthForm',
  data() {
    return {
      loggingIn: false,
      email: '',
    }
  },
  methods: {
    async handleLogin() {
      const email = this.email
      if (email) {
        try {
          this.loggingIn = true

          const didToken = await magic.auth.loginWithMagicLink({ email })

          const { data = {} } = await this.$apollo.mutate({
            mutation: AUTHENTICATE,
            variables: { didToken },
          })

          onLogin(this.$apollo.getClient(), data.authenticate.token)

          this.$router.push({ path: '/dashboard' })
          this.$root.$emit('loggedIn')
        } catch (err) {
          this.loggingIn = false
          console.error('An unexpected error occurred:', err)
        }
      }
    },
  },
}
</script>
