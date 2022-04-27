<template>
<v-container style = "padding: 0px;">
    <v-row class = "pr_10 pl_10 w100 m_0" style = "border: 1px solid #a9b8bf; border-bottom: 0px; ">
        <div>
            <button class = "mr_5" @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
            <v-icon class = "textEditorIcon">mdi-format-bold</v-icon>
            </button>
            <button class = "mr_5" @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
            <v-icon class = "textEditorIcon">mdi-format-italic</v-icon>
            </button>
            <button class = "mr_5" @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }">
            <v-icon class = "textEditorIcon">mdi-format-quote-open</v-icon>
            </button>
            <button class = "mr_5" @click="addImage">
            <v-icon class = "textEditorIcon">mdi-image-outline</v-icon>
            </button>
            <button class = "mr_5" @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
            <v-icon class = "textEditorIcon">mdi-format-strikethrough</v-icon>
            </button>
            <button class = "mr_5" @click="editor.chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }">
            <v-icon class = "textEditorIcon">mdi-code-json</v-icon>
            </button>
            <button class = "mr_5" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
            <span class = "textEditorSpan">h1</span>
            </button>
            <button class = "mr_5" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
            <span class = "textEditorSpan">h2</span>
            </button>
            <button class = "mr_5" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
            <span class = "textEditorSpan">h3</span>
            </button>
            <button class = "mr_5" @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">
            <span class = "textEditorSpan">h4</span>
            </button>
            <button class = "mr_5" @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">
            <span class = "textEditorSpan">h5</span>
            </button>
            <button class = "mr_5" @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">
            <span class = "textEditorSpan">h6</span>
            </button>
            <button class = "mr_5" @click = "moreEditOptions = !moreEditOptions">
            <span class = "textEditorSpan">更多</span>
            </button>
            <div v-if = "moreEditOptions">
            <button class = "mr_5" @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
            <v-icon class = "textEditorIcon">mdi-format-list-bulleted-square</v-icon>
            </button>
            <button class = "mr_5" @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">
            <v-icon class = "textEditorIcon">mdi-order-numeric-ascending</v-icon>
            </button>
            <button class = "mr_5" @click="editor.chain().focus().setHorizontalRule().run()">
            <v-icon class = "textEditorIcon">mdi-arrow-split-horizontal</v-icon>
            </button>
            </div>
        </div>
    </v-row>    
    <v-row class = "w100 m_0">
        <v-col cols=12 class = "p_0">
            <editor-content class="content" :editor="editor" />
        </v-col>
    </v-row>                                 
</v-container>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Blockquote from '@tiptap/extension-blockquote';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Placeholder from '@tiptap/extension-placeholder';

export default {
    props: ['content'],
    data() {
        return {
            editor: null,
            prgValue: null,
            enableSubmitBtn: false,
            moreEditOptions: false, 
        }
    },
    components: {
        EditorContent,
    },
    created() {
    this.editor = new Editor({
      content: this.content,
      extensions: [
        StarterKit,
        Image,
        Document,
        Text,
        Paragraph,
        Blockquote,
        Placeholder.configure({
            placeholder: "请输入进展",
            // emptyNodeClass: 'is-empty',
            // emptyNodeText: this.$t('editor.placeholder'),
            // showOnlyWhenEditable: true
        }),
      ],
      onUpdate: () => {
        if(this.editor.getHTML() != "<p></p>")
        {
        this.enableSubmitBtn = true;
        this.prgValue = this.editor.getHTML();
        this.$emit('input', {
            enableSubmitBtn: this.enableSubmitBtn,
            prgValue: this.prgValue,
        });
        } else {
        this.prgValue = "";
        this.enableSubmitBtn = false;
        this.$emit("input", {
            enableSubmitBtn: this.enableSubmitBtn,
            prgValue: this.prgValue,
        });
        }
      }
    });
    },
    beforeDestroy() {
    this.editor.destroy();
    },
    methods: {
      addImage(){
        const url = window.prompt('URL');
        if(url)
        {
          this.editor.chain().focus().setImage({ src: url }).run()
        }
      },
    }
}
</script>

<style>
.content {
  box-shadow: inset 0 1px 2px rgb(10 10 10 / 10%);
  border-top: 1px solid #f1f1f1 !important;
  border: 1px solid #a9b8bf;
  display: block;
  max-width: 100%;
  min-width: 100%;
  padding: 0.625em;
  resize: vertical;
  background-color: white;
  height: 160px;
  overflow: auto;
}
.content .ProseMirror {
  outline: none;
  height: 100%;
}
.textEditorIcon {
  font-size: 1.1em !important; 
  color: #83909a !important;
}
.mr_5 {
  margin-right: 5px;
  transition: all .5s ease;
  padding: 2px;
  font-size: 12px;
}
.mr_5:hover {
  background-color: #d9e0e5;
}
.m_0 {
    margin: 0px !important;
}
.p_0 {
    padding: 0px;
}
/* Placeholder (only at the top) */
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #ced4da;
  pointer-events: none;
  height: 0;
}
/* Placeholder (on every new line) */
.ProseMirror p.is-empty::before {
  content: attr(data-placeholder);
  float: left;
  color: #ced4da;
  pointer-events: none;
  height: 0;
}
</style>