<template>
  <v-card width="300" height="450">
    <v-container fluid>
      <v-row class="px-5 pt-5">
        <v-text-field placeholder="搜索" prepend-inner-icon="mdi-magnify" height="30" dense outlined></v-text-field>
      </v-row>
      <v-row style="overflow-y:auto;max-height:360px;" class="px-5 mt-0">
        <v-tabs v-model="tab" >
          <v-tab>
            部门
          </v-tab>
          <v-tab >
            群组
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item >
            <DepartmentPicker @pick="pickDepartment" />
          </v-tab-item>
          <v-tab-item>
            
          </v-tab-item>
        </v-tabs-items>
      </v-row>
    </v-container>
  </v-card>
</template>
<script>
export default {
  name: 'DepartmentGroupPicker',
  components: {
    DepartmentPicker: () => import("@/components/common/DepartmentPicker.vue")
  },
  data() {
    return {
      tab: null
    }
  },
  methods: {
    pickDepartment(e) {
      this.$emit('pick', e.data)
    }
  }
}
</script>