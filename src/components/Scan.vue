<template>
  <div class="my-5">
    <a :href="note.image" target="_blank">
      <v-card class="note">
        <div>
          <v-container class="pa-3 px-5">
            <v-row class="white">
              <div class="text-overline pl-2">
                {{ $luxon(note.created_at, 'med') }}
              </div>
              <v-spacer />
              <v-btn class="black--text" icon>
                <v-icon>
                  mdi-open-in-new
                </v-icon>
              </v-btn>
            </v-row>
          </v-container>
          <div v-if="!loading">
            <img class="image" :src="note.image" />
          </div>
          <div v-if="loading" class="template-loader">
            <v-img src="@/assets/preloader_puff.svg"></v-img>
          </div>
        </div>
      </v-card>
    </a>
  </div>
</template>

<script>
export default {
  name: 'Scan',
  props: ['note'],
  data() {
    return {
      loading: false,
    }
  },
}
</script>

<style lang="sass" scoped>
a
  text-decoration: none
.note
  .image
    width: 100%
.template-loader
  margin: 0 auto
  width: 50%
  border-radius: 50%
  padding: 10%
  background: #fff
  border: #ccc 1px solid
  margin-top: 30px
  .v-image
    width: 75%
    margin: 12.5%
</style>
