<template>
  <v-card flat min-width="300">
    <v-treeview
      activatable
      :items="departTree"
      item-children="dp_departments"
      v-if="currentDepartment"
    >
      <template v-slot:prepend="{ item, open }">
        <v-btn :color="item.id==currentDepartment.id ? 'blue': ''" @click="select(item)" plain small>{{ item.departmentOaName }}</v-btn>
      </template>
    </v-treeview>
  </v-card>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "DepartmentOAPicker",
  computed: {
    ...mapGetters("department", ["departTree"]),
    ...mapGetters("auth", ["authUser"]),
  },
  data() {
    return {
      currentDepartment: null,
      ownDepartments: []
    };
  },
  methods: {
    ...mapActions('department', ['getDepartments']),
    select(item) {
      this.currentDepartment = item
      this.$emit("pick", { data: this.currentDepartment });
    },
  },
  mounted() {
    this.getDepartments()
    // const findItemNested = (arr, itemId, nestingKey) => (
    //   arr.reduce((a, item) => {
    //     if (a) return a;
    //     if (item.id === itemId) return item;
    //     if (item[nestingKey]) return findItemNested(item[nestingKey], itemId, nestingKey)
    //   }, null)
    // );
    // if(!!this.authUser.leader_dps) {
    //   let depart = {}, i = 0
    //   this.authUser.leader_dps.split(',').map(dp => {
    //     i++;
    //     depart = findItemNested(this.departTree, Number(dp), "dp_departments")
    //     if(i==1) this.currentDepartment = depart
    //     this.ownDepartments.push(depart)
    //   })
    // }
    this.currentDepartment = this.departTree[0];
    this.$emit("pick", { data: this.currentDepartment})
    this.$emit('rendered')
  }
};
</script>
