<template>
<v-container fluid>
  <v-data-table :items="items" :headers="headers">
    <template v-slot:item.item_owner="{ item }">
      {{ item.item_owner | username }}
    </template>
    <template v-slot:item.item_progress="{ item }">
      {{ item.item_progress }}%
    </template>
    <template v-slot:item.item_end_date="{ item }">
      <span :class="`${getRestDays(item.item_end_date).color}--text`">{{ getRestDays(item.item_end_date).text }}</span>
    </template>
  </v-data-table>
</v-container>
</template>

<script>
export default {
  name: 'ProjectTable',
  props: ['items'],
  data: () => ({
    headers: [{
        text: "名称 ",
        align: "start",
        sortable: false,
        value: "item_name",
      },
      {
        text: "项目进度",
        value: "item_progress",
      },
      {
        text: "截止日期",
        value: "item_end_date",
      },
      {
        text: "负责人",
        value: "item_owner",
      },
    ],
  }),
  methods: {
    getRestDays(endDate) {
      let temp;
      const today = new Date();
      const endDay = new Date(endDate);
      const oneDay = 24 * 60 * 60 * 1000;
      const diffDays = Math.round((endDay-today)/oneDay);
      if(diffDays >= 0) {
        temp = {text: `剩余${diffDays}天`, color: "blue"}
      } else {
        temp = {text: `过期${-diffDays}天`, color: "red"}
      }
      return temp
    }
  }
}
</script>
