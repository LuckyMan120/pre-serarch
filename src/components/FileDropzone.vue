<template>
  <div>
    <vue-dropzone
      id="file-dropzone"
      :options="dropzoneOptions"
      :useCustomSlot="true"
    >
      <div class="dropzone-custom-content">
        <h3 class="text-h6 accent--text">Drag and drop experiment files</h3>
        <p class="subtitle">
          ...or click to select files from your computer
        </p>
      </div>
    </vue-dropzone>
  </div>
</template>

<script lang="ts">
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'

export default {
  name: 'FileDropzone',
  components: {
    vueDropzone: vue2Dropzone,
  },
  data: function() {
    return {
      dropzoneOptions: {
        url: 'https://httpbin.org/post',
        thumbnailWidth: 150,
        maxFilesize: 0.5,
      },
    }
  },
}
</script>

<style lang="sass" scoped>
.vue-dropzone
  color: #3797a4
  background: #e7f3f4
  border-color: rgba(55, 151, 164, 0.3)
  border-style: dashed
  border-radius: 5px
  &:hover
    background: rgba(55, 151, 164, 0.2)
</style>
