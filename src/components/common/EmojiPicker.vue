<template>
  <span class="file_input  pa-3">
    <v-sheet class="textarea-emoji-picker" v-click-outside="closePickerWindow">
        <picker
            set="emojione"
            :showCategories="showCategories"
            v-show="showEmojiPicker"
            title="选择你的表情..."
            emoji="point_up"
            @select="addEmoji"
            :i18n="multiLanguage"
        />
        <span
            class="emoji-trigger"
            :class="{ 'triggered': showEmojiPicker }"
            @mousedown.prevent="toggleEmojiPicker"
        >
          <v-icon class="btn_2-icons">mdi-sticker-emoji</v-icon>
          <span style="font-size: 13px;line-height: 20px;color: rgb(86, 94, 102);font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\8F6F\96C5\9ED1,Arial,sans-serif;">表情</span>
        </span>
    </v-sheet>
  </span>
</template>

<script>
import { Picker } from 'emoji-mart-vue'

export default {
    components: { Picker },
    data () {
        return {
          showEmojiPicker: false,
          showCategories: false,
          multiLanguage: {
            search: "搜索",
            notfound: "未找到表情符号",
            categories: {
              search: "搜索结果",
              recent: '经常使用',
              people: '笑脸与人物',
              nature: '动物与自然',
              foods: '食品和饮料',
              activity: '活动',
              places: '旅行和地方',
              objects: '对象',
              symbols: '符号',
              flags: '旗帜',
              // custom: '定制',
            },
          },
        }
    },

    methods: {
        toggleEmojiPicker () {
        this.showEmojiPicker = !this.showEmojiPicker
        },
        addEmoji (emoji) {
            this.showEmojiPicker = false;
            this.$emit("inputEmoji", emoji.native.toString());
        },
        closePickerWindow() {
          this.showEmojiPicker = false;
        }
    }
}
</script>

<style scoped>
.textarea-emoji-picker {
  position: relative;
  width: 70px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color:rgb(255 255 255) !important;
}
.textarea {
  width: 100%;
  min-height: 300px;
  outline: none;
  box-shadow: none;
  font-size: 15px;
  border: 1px solid #BABABA;
  color: #333;
  border-radius: 2px;
  box-shadow: 0px 2px 4px 0 rgba(0,0,0,0.1) inset;
  resize: vertical;
}

.emoji-mart {
  position: absolute;
  top: -437px;
  z-index: 10;
  right: -138px 
}

.emoji-trigger {
  cursor: pointer;
  height: 20px;
}

.emoji-trigger path {
  transition: 0.1s all;
}

.emoji-trigger:hover path {
  fill: #000000;
}

.emoji-trigger.triggered path {
  fill: darken(#FEC84A, 15%);
}
</style>