<template>
  <v-card flat min-width="300">
    <v-treeview
      activatable
      :items="departTree"
      item-children="dp_departments"
    >
      <template v-slot:prepend="{ item, open }">
        <v-btn @click="select(item)" plain small>{{ item.departmentOaName }}</v-btn>
      </template>
    </v-treeview>
  </v-card>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "DepartmentPicker",
  computed: {
    ...mapGetters("department", ["departTree"]),
  },
  data() {
    return {
      selection: [],
      open: [1, 2],
    };
  },
  methods: {
    ...mapActions('department', ['getDepartments']),
    select(item) {
      this.$emit("pick", { data: item });
    },
  },
  mounted() {
    this.getDepartments()
    this.$emit('rendered')
  }
};
</script>
