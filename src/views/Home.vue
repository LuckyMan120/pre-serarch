<template>
  <div>
    <transition name="slide-up" appear>
      <v-col class="col-lg-5 col-md-7">
        <transition name="slide-up" appear>
          <AuthForm />
        </transition>
      </v-col>
    </transition>
  </div>
</template>

<script>
import AuthForm from '../components/AuthForm.vue'
export default {
  name: 'Home',
  components: {
    AuthForm,
  },
}
</script>
