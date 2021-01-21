<template>
  <v-col class="col-12 col-sm-6 col-md-4">
    <a
      :href="
        `https://storage.googleapis.com/presearch-templates/${template}.pdf`
      "
      target="_blank"
      download
    >
      <v-card class="note">
        <div class="dotted-paper">
          <v-container class="pa-3 px-5">
            <v-row class="white">
              <div class="text-overline pl-2">{{ template }}</div>
              <v-spacer />
              <v-btn class="black--text" icon>
                <v-icon>
                  mdi-printer
                </v-icon>
              </v-btn>
            </v-row>
          </v-container>
          <div v-if="icon && !loading" class="template-icon">
            <v-img :src="require(`@/assets/icons_${icon}.svg`)"></v-img>
          </div>
          <div v-if="loading" class="template-loader">
            <v-img src="@/assets/preloader_puff.svg"></v-img>
          </div>
        </div>
      </v-card>
    </a>
  </v-col>
</template>

<script>
export default {
  name: 'NoteTemplate',
  props: ['experiment', 'template', 'icon'],
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
  transition: transform .2s
  &:hover
    transform: scale(1.03)
    box-shadow: 0px 7px 12px -4px rgba(0, 0, 0, 0.06), 0px 12px 21px 2px rgba(0, 0, 0, 0.04), 0px 5px 26px 4px rgba(0, 0, 0, 0.02) !important
.dotted-paper
  width: 100%
  height: 0
  padding-bottom: 130%
  background: radial-gradient(#666 .7px, transparent .7px)
  background-size: 15px 15px
.experiment-info
  margin: 30px
  padding: 7px 30px 17px
  background: #fff
  min-width: 400px
  display: inline-block
.experiment-qr
  padding: 5px
  background: #fff
  position: absolute
  right: 67px
  top: 60px
.template-icon
  margin: 0 auto
  width: 50%
  border-radius: 50%
  padding: 10%
  background: #fff
  border: #ccc 1px solid
  margin-top: 30px
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
