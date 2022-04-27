<template>
<v-dialog v-model="dialog" persistent width="650">
  <v-card>
    <v-toolbar height="35" dark color="primary">
      <v-container class="d-flex justify-start align-center">
        设置直线上级
        <v-spacer></v-spacer>
        <v-icon @click="close" small>mdi-close</v-icon>
      </v-container>
    </v-toolbar>
    <v-container>
      <v-menu max-width="300" offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" color="grey darken-1" class="px-0" height="40" width="628" outlined>
            <v-container>
              <v-row class="pa-3">               
                <v-chip v-if="dSuperior" class="mx-1" color="blue lighten-2" label @click:close="dSuperior=null" close outlined>{{ dSuperior.id | username }}</v-chip>              
                <span v-else>请选择</span>                
                <v-spacer></v-spacer>               
                <v-icon>mdi-menu-down</v-icon>                
              </v-row>
            </v-container>
          </v-btn>
        </template>
        <v-sheet>
          <UserPicker @pick="pickUser" />
        </v-sheet>
      </v-menu>
    </v-container>
    <v-container class="pt-0 d-flex justify-end">
      <v-spacer></v-spacer>
      <v-btn class="mx-3" @click="close">取消</v-btn>
      <v-btn class="mx-3 mr-5" color="primary" @click="onOk">确认</v-btn>
    </v-container>
  </v-card>
</v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'DSuperiorDlg',
  components: {
    UserPicker: () => import('@/components/common/UserPicker.vue')
  },
  data() {
    return {
      dialog: false,
      dSuperior:null,
      selectedUsers: []
    }
  },
  methods: {
    ...mapActions('user', ['updateUser']),
    open(users) {
      this.dialog = true
      this.selectedUsers = users
    },
    close() {
      this.dialog = false
    },
    onOk() {
      this.dialog = false
      let ids=[]
      this.selectedUsers.map(user => {
        ids.push(user.id)
      })
      this.updateUser({
        ids: ids.join(),
        user_dot_superior: this.dSuperior.id
      })
    },
    pickUser(e) {
      this.dSuperior = e.user
    }
  }
}
</script>
