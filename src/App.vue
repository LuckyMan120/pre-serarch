<template>
  <v-app>
    <NavBar />
    <v-main class="pb-16">
      <v-container color="grey">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import NavBar from '@/components/NavBar.vue'

export default {
  components: {
    NavBar,
  },
  metaInfo: {
    title: 'Get your lab on the same page',
    titleTemplate: '%s | Presearch',
    description:
      'Presearch is a simple-to-use collaboration and communication tool for scientific researchers and their peers.',
    meta: [
      { property: 'og:title', content: '📜 Get your lab on the same page' },
      { property: 'og:site_name', content: 'Presearch' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: 'https://www.presearch.co/share.png' },
      {
        property: 'og:description',
        content:
          'Presearch is a simple-to-use collaboration and communication tool for scientific researchers and their peers.',
      },
    ],
  },
}
</script>

<style lang="sass">
.v-btn
  font-weight: 700
.v-breadcrumbs
  background: #fff
  border: 1px solid #ddd
  box-shadow: 0px 7px 8px -4px rgba(0, 0, 0, 0.06), 0px 12px 17px 2px rgba(0, 0, 0, 0.04), 0px 5px 22px 4px rgba(0, 0, 0, 0.02)
  width: 95% !important
  margin: 0 auto !important
  margin-bottom: -16px !important
  padding-top: 8px !important
  a
    color: #666 !important
    font-weight: 600 !important
.v-menu__content
  background: #fff
  border: 1px solid #ddd !important
  box-shadow: 0px 7px 8px -4px rgba(0, 0, 0, 0.06), 0px 12px 17px 2px rgba(0, 0, 0, 0.04), 0px 5px 22px 4px rgba(0, 0, 0, 0.02) !important
.v-card
  border: 1px solid #ddd !important
  box-shadow: 0px 7px 8px -4px rgba(0, 0, 0, 0.06), 0px 12px 17px 2px rgba(0, 0, 0, 0.04), 0px 5px 22px 4px rgba(0, 0, 0, 0.02) !important
  .v-card__text
    font-size: 0.95rem !important
    color: #333 !important
.v-application--is-ltr .v-list-item__icon:first-child
  margin-right: 10px
.v-tooltip__content
  font-size: 0.8em
  line-height: 1.5
  background: #000 !important
.text-editable
  border-bottom: 1.5px transparent solid
  &:hover
    border-bottom: 1.5px #aaa dotted
.ProseMirror
  &:focus
    outline: 0px solid transparent !important
    border-width: 0 !important
  h1
    margin-top: 0.9em
    font-size: 1.5em
    &:first-child
      margin-top: 0
  h2
    font-size: 1.2em
    margin-top: 0.75em
    &:first-child
      margin-top: 0
  h3
    font-size: 1em
  hr
    margin: 2rem 0
  li
    p
      margin: 8px 0
  ul[data-type="todo_list"]
    padding-left: 0
    padding-bottom: 15px
  li[data-type="todo_item"]
    display: flex
    flex-direction: row
    p
      margin: 0
  .todo-checkbox
    border: 2px solid #210700
    height: 0.9em
    width: 0.9em
    box-sizing: border-box
    margin-right: 10px
    margin-top: 0.3rem
    user-select: none
    -webkit-user-select: none
    cursor: pointer
    border-radius: 0.2em
    background-color: transparent
    transition: 0.4s background
  .todo-content
    flex: 1
    > p:last-of-type
      margin-bottom: 0
    > ul[data-type="todo_list"]
      margin: .5rem 0
  li[data-done="true"]
    > .todo-content
      > p
        text-decoration: line-through
    > .todo-checkbox
      background-color: #210700
  li[data-done="false"]
    text-decoration: none
  pre
    padding: .7rem 1rem
    border-radius: 5px
    background: #210700
    color: #fff
    font-weight: 400
    font-size: 1.1rem
    overflow-x: auto
    code
      background: #210700
      color: #fff
  table
    border-collapse: collapse
    table-layout: fixed
    width: 100%
    margin: 0
    overflow: hidden
    td, th
      min-width: 1em
      border: 2px solid #eee
      padding: 3px 5px
      vertical-align: top
      box-sizing: border-box
      position: relative
      > *
        margin-bottom: 0
    th
      font-weight: bold
      text-align: left
    .selectedCell:after
      z-index: 2
      position: absolute
      content: ""
      left: 0
      right: 0
      top: 0
      bottom: 0
      background: rgba(200, 200, 255, 0.4)
      pointer-events: none
    .column-resize-handle
      position: absolute
      right: -2px
      top: 0
      bottom: 0
      width: 4px
      z-index: 20
      background-color: #adf
      pointer-events: none
  .tableWrapper
    margin: 1em 0
    overflow-x: auto
  p.is-editor-empty:first-child::before
    content: attr(data-empty-text)
    float: left
    color: #aaa
    pointer-events: none
    height: 0
    font-style: italic
.resize-cursor
  cursor: ew-resize
  cursor: col-resize
  *.is-empty:nth-child(1)::before,
    *.is-empty:nth-child(2)::before
      content: attr(data-empty-text)
      float: left
      color: #aaa
      pointer-events: none
      height: 0
      font-style: italic

// TRANSITIONS

.slide-up-enter-active
  transform: translateY(0)
  transition: all .75s ease
  transition-delay: .15s

.slide-up-enter
  transform: translateY(15px)
  opacity: 0

.slide-up-over-enter-active
  transform: translateY(0)
  transition: all .75s ease

.slide-up-over-enter
  transform: translateY(15px)
  opacity: 0

.fade-enter-active, .fade-leave-active
  transition: opacity .2s ease

.fade-enter, .fade-leave-to
  opacity: 0
</style>
