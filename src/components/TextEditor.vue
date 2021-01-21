<template>
  <div>
    <editor-menu-bar :editor="editor" v-slot="{ commands, isActive, focused }">
      <div
        class="menubar"
        :class="{
          'is-hidden is-mobile': $vuetify.breakpoint.smAndDown,
          'is-focused': focused,
        }"
        v-if="showMenu"
      >
        <v-btn
          class="menubar__button mr-2"
          :class="{ 'is-active': isActive.bold() }"
          @click="commands.bold"
          icon
          title="Bold"
        >
          <v-icon>mdi-format-bold</v-icon>
        </v-btn>

        <v-btn
          class="menubar__button mr-2"
          :class="{ 'is-active': isActive.italic() }"
          @click="commands.italic"
          icon
          title="Italic"
        >
          <v-icon>mdi-format-italic</v-icon>
        </v-btn>

        <v-btn
          class="menubar__button mr-2"
          :class="{ 'is-active': isActive.strike() }"
          @click="commands.strike"
          icon
          title="Strikethrough"
        >
          <v-icon>mdi-format-strikethrough</v-icon>
        </v-btn>

        <v-btn
          class="menubar__button mr-2"
          :class="{ 'is-active': isActive.underline() }"
          @click="commands.underline"
          icon
          title="Underline"
        >
          <v-icon>mdi-format-underline</v-icon>
        </v-btn>

        <v-btn
          class="menubar__button mr-2"
          :class="{
            'is-active':
              isActive.heading({ level: 1 }) ||
              isActive.heading({ level: 2 }) ||
              isActive.heading({ level: 3 }),
            'mr-2': true,
          }"
          @click="toggleHeading(commands, isActive)"
          icon
          title="Header"
        >
          <v-icon>mdi-format-size</v-icon>
        </v-btn>

        <v-btn
          :class="{
            'is-active': isActive.bullet_list(),
            'is-hidden':
              isActive.bullet_list() && $vuetify.breakpoint.smAndDown,
            'mr-2': true,
          }"
          @click="commands.bullet_list"
          icon
          title="Bullet list"
        >
          <v-icon>mdi-format-list-bulleted</v-icon>
        </v-btn>

        <v-btn
          :class="{
            'is-active': isActive.ordered_list(),
            'is-hidden':
              !isActive.bullet_list() && $vuetify.breakpoint.smAndDown,
            'mr-2': true,
          }"
          @click="commands.ordered_list"
          icon
          title="Numbered list"
        >
          <v-icon>mdi-format-list-numbered</v-icon>
        </v-btn>

        <v-btn
          :class="{
            'is-active': isActive.todo_list(),
            'mr-2': true,
          }"
          @click="commands.todo_list"
          icon
          title="To-do list"
        >
          <v-icon>mdi-checkbox-marked-outline</v-icon>
        </v-btn>

        <v-btn
          class="hidden-sm-and-down"
          :class="{
            'is-active': isActive.code_block(),
            'mr-2': true,
          }"
          @click="commands.code_block"
          icon
          title="Code block"
        >
          <v-icon>mdi-code-tags</v-icon>
        </v-btn>

        <v-btn
          class="hidden-sm-and-down menubar__button mr-2"
          @click="commands.horizontal_rule"
          icon
          title="Section break"
        >
          <v-icon>mdi-minus</v-icon>
        </v-btn>

        <v-btn
          class="hidden-sm-and-down menubar__button mr-2"
          @click="
            commands.createTable({
              rowsCount: 3,
              colsCount: 3,
              withHeaderRow: false,
            })
          "
          icon
          title="Table"
        >
          <v-icon>mdi-table</v-icon>
        </v-btn>

        <span v-if="isActive.table()">
          <v-btn
            class="hidden-sm-and-down menubar__button mr-2"
            @click="commands.deleteTable"
            title="Delete table"
            icon
          >
            <v-icon class="red--text">mdi-table-remove</v-icon>
          </v-btn>
          <v-btn
            class="hidden-sm-and-down menubar__button mr-2"
            @click="commands.addColumnBefore"
            title="Add column before"
            icon
          >
            <v-icon>mdi-table-column-plus-before</v-icon>
          </v-btn>
          <v-btn
            class="hidden-sm-and-down menubar__button mr-2"
            @click="commands.addColumnAfter"
            title="Add column after"
            icon
          >
            <v-icon>mdi-table-column-plus-after</v-icon>
          </v-btn>
          <v-btn
            class="hidden-sm-and-down menubar__button mr-2"
            @click="commands.deleteColumn"
            title="Delete column"
            icon
          >
            <v-icon class="red--text">mdi-table-column-remove</v-icon>
          </v-btn>
          <v-btn
            class="hidden-sm-and-down menubar__button mr-2"
            @click="commands.addRowBefore"
            title="Add row before"
            icon
          >
            <v-icon>mdi-table-row-plus-before</v-icon>
          </v-btn>
          <v-btn
            class="hidden-sm-and-down menubar__button mr-2"
            @click="commands.addRowAfter"
            title="Add row after"
            icon
          >
            <v-icon>mdi-table-row-plus-after</v-icon>
          </v-btn>
          <v-btn
            class="hidden-sm-and-down menubar__button mr-2"
            @click="commands.deleteRow"
            title="Delete row"
            icon
          >
            <v-icon class="red--text">mdi-table-row-remove</v-icon>
          </v-btn>
        </span>
        <v-spacer />
        <div v-if="autosave">
          <v-tooltip bottom transition="none" v-if="saved">
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="text-right" v-bind="attrs" v-on="on" icon>
                <v-icon>mdi-cloud-check-outline</v-icon>
              </v-btn>
            </template>
            Saved to cloud
          </v-tooltip>
          <v-tooltip bottom transition="none" v-else>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="text-right"
                color="primary"
                v-bind="attrs"
                v-on="on"
                icon
              >
                <v-icon>mdi-cloud-sync-outline</v-icon>
              </v-btn>
            </template>
            Saving to cloud
          </v-tooltip>
        </div>
      </div>
    </editor-menu-bar>
    <v-container :class="{ 'mt-3': !showMenu }">
      <editor-content :editor="editor" />
    </v-container>
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Blockquote,
  BulletList,
  CodeBlock,
  HardBreak,
  Heading,
  ListItem,
  OrderedList,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  HorizontalRule,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  History,
  Placeholder,
} from 'tiptap-extensions'

import debounce from '@/utils/debounce'

export default {
  name: 'TextEditor',
  props: ['text', 'editable', 'showMenu', 'placeholder', 'autosave'],
  data() {
    return {
      keepInBounds: true,
      editor: null,
      saved: true,
    }
  },
  created() {
    const update = debounce(({ getHTML }) => {
      this.$emit('update', getHTML())
      this.saved = true
    }, 300)

    this.editor = new Editor({
      extensions: [
        new Blockquote(),
        new BulletList(),
        new CodeBlock(),
        new HardBreak(),
        new Heading({ levels: [1, 2, 3] }),
        new ListItem(),
        new OrderedList(),
        new TodoItem({
          nested: true,
        }),
        new TodoList(),
        new Link(),
        new Bold(),
        new Code(),
        new Italic(),
        new Strike(),
        new Underline(),
        new HorizontalRule(),
        new Table({
          resizable: true,
        }),
        new TableHeader(),
        new TableCell(),
        new TableRow(),
        new History(),
        new Placeholder({
          emptyEditorClass: 'is-editor-empty',
          emptyNodeClass: 'is-empty',
          emptyNodeText: this.placeholder || '',
          showOnlyWhenEditable: true,
          showOnlyCurrent: true,
        }),
      ],
      content: this.text,
      editable: this.editable,
      onUpdate: context => {
        this.saved = false
        update(context)
      },
    })
  },
  watch: {
    text: function(newVal) {
      this.editor.setContent(newVal)
    },
    editable() {
      this.editor.setOptions({
        editable: this.editable,
      })
    },
  },
  beforeDestroy() {
    // Always destroy your editor instance when it's no longer needed
    this.editor.destroy()
  },
  methods: {
    toggleHeading(commands, isActive) {
      if (isActive.heading({ level: 1 })) {
        commands.heading({ level: 2 })
      } else if (isActive.heading({ level: 2 })) {
        commands.heading({ level: 3 })
      } else if (isActive.heading({ level: 3 })) {
        commands.heading({ level: 3 })
      } else {
        commands.heading({ level: 1 })
      }
    },
  },
  components: {
    EditorContent,
    EditorMenuBar,
  },
}
</script>

<style lang="sass" scoped>
.menubar
  display: flex
.is-hidden
  display: none
.is-focused
  display: flex
.is-mobile
  position: fixed
  bottom: 0
  width: 100vw
  left: 0
  background: #fff
  z-index: 10
  border-top: 1px solid #ddd
  justify-content: center
</style>
