<template>
<v-card elevation="0">
  <v-container fluid class="align-center">
    <v-row >
      <v-col cols="3">
        <v-container>
          <v-row>
            <v-avatar class="mr-3" color="green" size="30">{{ item.item_owner | surename }}</v-avatar>
            <span class="pt-1 blue-grey--text">{{ item.item_name }}</span>
          </v-row>
        </v-container> 
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="1">
        <v-container>
          <v-row class="justify-center">
            <span>{{ item.item_progress }}%</span>
          </v-row>
          <v-row>
            <v-progress-linear rounded :value="item.item_progress" height="6"></v-progress-linear>  
          </v-row>
        </v-container>
      </v-col>
      <v-col>
        <span class="text-caption ml-2">{{ item.item_start_date }}-{{ item.item_end_date }}</span>
      </v-col>
      <v-col>
        <span class="text-caption ml-3">{{ item.item_task_status }}</span>
      </v-col>
      <v-col cols="3">
        <v-avatar color="orange" size="30" v-for="(user, i) in item.item_participant" :key="i">{{ user | surename }}</v-avatar>
      </v-col>
    </v-row>
  </v-container>
</v-card>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'ProjectCard',
  props: ['item'],
}
</script>
