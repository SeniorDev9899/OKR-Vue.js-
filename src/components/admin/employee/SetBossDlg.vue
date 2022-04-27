<template>
<v-dialog v-model="dialog" persistent width="650">
  <v-card>
    <v-toolbar height="35" dark color="primary">
      <v-container class="d-flex justify-start align-center">
        设置公司老板
        <v-spacer></v-spacer>
        <v-icon @click="close" small>mdi-close</v-icon>
      </v-container>
    </v-toolbar>
    <v-container>
      <v-menu max-width="300" offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" color="grey darken-1" class="px-0" height="40" width="628" outlined>
            <v-container>
              <v-row class="px-3">
                <span v-if="bosses.length==0">
                  请选择
                </span>         
                <v-chip v-else class="mx-1 text-capitalize" v-for="(boss, i) in bosses" :key="i" color="blue lighten-2" label @click:close="removeBoss(i)" close outlined>{{ boss.employeeName }}</v-chip>                
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
import {
  mapGetters,
  mapActions
} from 'vuex'
export default {
  name: 'SetBossDlg',
  components: {
    UserPicker: () => import('@/components/common/UserPicker.vue')
  },
  computed: {
    ...mapGetters('user', ['users']),
    bosses: function() {
      return this.users.filter(user => user.user_role == 'admin')
    }
  },
  data() {
    return {
      dialog: false,
    }
  },
  methods: {
    ...mapActions('user', ['updateUser']),
    open() {
      this.dialog = true
    },
    close() {
      this.dialog = false
    },
    onOk() {
      this.dialog = false
    },
    addBoss(user) {
      this.updateUser({
        id: user.id,
        user_role: 'admin'
      })
    },
    delBoss(user) {
      this.updateUser({
        id: user.id,
        user_role: 'user'
      })
    },
    removeBoss(index) {
      this.delBoss(this.bosses[index])
    },
    pickUser(e) {
      this.addBoss(e.user)
    }
  }
}
</script>
