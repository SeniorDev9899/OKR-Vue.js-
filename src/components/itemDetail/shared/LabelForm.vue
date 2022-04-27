<template>
<v-card min-height="120" width="400">
  <v-container fluid>
    <v-row class="py-1 px-4 align-center">
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-avatar v-bind="attrs" :color="colors[newLabel.tag_color]" v-on="on" size="20"></v-avatar>
        </template>
        <v-avatar @click="newLabel.tag_color=i" class="ma-2" size="24" :color="color" :key="i" v-for="(color, i) in colors"><v-icon v-if="i==newLabel.tag_color" color="white" small>mdi-check</v-icon></v-avatar>
      </v-menu>
      <v-text-field v-model="newLabel.tag_name"></v-text-field>
      <v-btn :disabled="newLabel.tag_name==''" @click="addNewLabel" dark small color="blue" tile>添加</v-btn>
    </v-row>
    <v-row class="pa-1">
      <v-chip @click="pickLabel(label.tag_id)" class="ma-1" v-for="(label, i) in labels" :key="i"><div :class="`${colors[label.tag_color]} rounded-circle pa-1`" ></div><span class="ml-2 text-caption">{{ label.tag_name }}</span></v-chip>
    </v-row>
  </v-container>
</v-card>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'LabelForm',
  computed: {
    ...mapGetters('label', ['labels']),
  },
  data() {
    return {
      colors: [
        'red', 'pink', 'orange', 'green', 'blue', 'purple'      
      ],
      newLabel: {
        tag_name: '',
        tag_color: 0
      }
    }
  },
  methods: {
    ...mapActions('label', ['getLabels', 'addLabel']),
    addNewLabel() {
      this.addLabel(this.newLabel)
      this.newLabel = {
         tag_name: '',
        tag_color: 0
      }
    },
    pickLabel(id) {
      this.$emit('pick', id)
    }
  },
  mounted() {
    this.getLabels()
  }
}
</script>