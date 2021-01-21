import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#dd2c00',
        secondary: '#eee',
        accent: '#01a9b4',
        error: '#af2d2d',
        black: '#210700',
      },
    },
  },
})
