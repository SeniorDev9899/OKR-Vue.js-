<template>
<v-card v-else elevation="0" color="#FAFAFA" class="mt-16 pa-2" width="300" height="100">
  <v-container fluid>
    <v-row>
      <v-text-field autofocus @keydown.enter="saveKanban" v-model="newKanban.kb_name" flat solo placeholder="请输入看板名称" dense></v-text-field>
    </v-row>
    <v-row class="justify-end">
      <v-btn class="mx-1" elevation="0" @click="cancel"  x-small>取消</v-btn>
      <v-btn :disabled="!newKanban.kb_name" class="mx-1" elevation="0" @click="saveKanban" x-small color="grey">保存</v-btn>
    </v-row>
  </v-container>
</v-card>
</template>

<script>
export default {
  name: 'KanbanFormCard',
  props: ['newKanban'],
  methods: {
    saveKanban() {
      this.$emit('save')
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>
