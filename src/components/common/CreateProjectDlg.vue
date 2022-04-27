<template>
<v-dialog v-model="dialog" width="700">
  <v-toolbar dark dense color="primary">
    <v-container class="d-flex">
      <span>创建项目</span>
      <v-spacer></v-spacer>
      <v-icon @click="dialog=false">mdi-close</v-icon>
    </v-container>
  </v-toolbar>
  <v-card>
    <v-container>
      <v-row class="mx-4 my-1">
        <span style="width: 60px;" class="mr-2 mt-2 text-caption">起止时间</span>
        <v-text-field placeholder="项目名称最多100个字" v-model="newProject.item_name" dense></v-text-field>
      </v-row>
      <v-row class="mx-4 mt-2">
        <span style="width: 60px;" class="mr-2 mt-2 text-caption">起止时间</span>
        <date-range-picker ref="picker" opens="right" 
          control-container-class="d-flex item-date-picker"
          :locale-data="{ 
                            firstDay: 1,
                            format: 'yyyy-mm-dd',
                            applyLabel: '确定',
                            cancelLabel: '取消',
                            daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                            monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
                        }" :minDate="minDate" :maxDate="maxDate" :dateRange="{startDate: newProject.item_start_date, endDate: newProject.item_end_date}" :ranges="false" @update="setDateRange">
          <template v-slot:input="picker" >
            {{ picker.startDate | formatDate }} - {{ picker.endDate | formatDate }}
            <v-spacer></v-spacer>
            <v-icon>mdi-chevron-down</v-icon>
          </template>
        </date-range-picker>
      </v-row>
      <v-row class="mx-4 mt-2">
        <span style="width: 60px;" class="mr-2 mt-3 text-caption">负责人</span>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="pa-0 input-owner justify-start" tag="div" plain width="570" v-bind="attrs" v-on="on" ><v-avatar color="orange" size="30">{{ newProject.item_owner | surename }}</v-avatar><span class="mx-1">{{ newProject.item_owner | username }}</span></v-btn>
          </template>
          <v-card>
            <UserPicker @pick="setOwner"/>
          </v-card>
        </v-menu>
      </v-row>
      <v-row class="mx-4 mt-7">
        <span style="width: 60px;" class="mr-2 mt-2 text-caption">内部成员</span>
        <div class="pa-0 input-avatar justify-start">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="green" fab small v-bind="attrs" v-on="on">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <v-card>
              <UserPicker @pick="addMember"/>
            </v-card>
          </v-menu>
          <v-avatar :key="i" class="mx-1" style="cursor: pointer;" @click="removeMember(i)" v-for="(user,i) in newProject.item_intern_members" size="30" color="orange">{{ user | surename }}</v-avatar>
        </div>
      </v-row>
      <v-row class="mx-4 mt-6">
        <span style="width: 60px;" class="mr-2 mt-4 text-caption">关注者</span>
        <div class="pa-0 input-avatar justify-start">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="green" fab small v-bind="attrs" v-on="on">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <v-card>
              <UserPicker @pick="addFollower"/>
            </v-card>
          </v-menu>
          <v-avatar :key="i" class="mx-1" style="cursor: pointer;" @click="removeFollower(i)" v-for="(user,i) in newProject.item_followers" size="30" color="orange">{{ user | surename }}</v-avatar>
        </div>
      </v-row>
      <v-row class="mx-4 mt-6">
        <span style="width: 60px;" class="mr-2 mt-4 text-caption">审批人</span>
        <div class="pa-0 input-avatar justify-start">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="green" fab small v-bind="attrs" v-on="on">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <v-card>
              <UserPicker @pick="addApprover"/>
            </v-card>
          </v-menu>
          <v-avatar :key="i" class="mx-1" style="cursor: pointer;" @click="removeApprover(i)" v-for="(user,i) in newProject.item_approver" size="30" color="orange">{{ user | surename }}</v-avatar>
        </div>
      </v-row>
      <v-row class="mx-4 mt-8">
        <span style="width: 60px;" class="mr-2 mt-1 text-caption">项目描述</span>
        <v-text-field v-model="newProject.item_description" dense></v-text-field>
      </v-row>
      <v-row class="mx-4 my-1">
        <span style="width: 60px;" class="mr-2 mt-5 text-caption">可见范围</span>
        <v-radio-group v-model="newProject.item_visible_range" row>
          <v-radio value="1">
            <template v-slot:label>
              <span class="text-subtitle-2">仅相关成员</span>
            </template>
          </v-radio>
          <v-radio value="2">
            <template v-slot:label>
              <span class="text-subtitle-2">全公司</span>
            </template>
          </v-radio>
        </v-radio-group>
      </v-row>
      <v-row>
        <span class="text-subtitle-2 ml-5">您可以按照输入组件附加文件</span> 
      </v-row>
      <v-row class="pa-2">
        <v-file-input chips multiple v-model="files" label="点击这里上传文件"></v-file-input>
      </v-row>
      <v-row class="justify-end ma-3">
        <v-btn @click="cancel" class="mx-2" small>取消</v-btn>
        <v-btn :disabled="!newProject.item_name" @click="create" class="mx-2" small color="primary">创建</v-btn>
      </v-row>
    </v-container>
  </v-card>
</v-dialog>
</template>

<script>
import {
  mapGetters, mapActions
} from 'vuex'
import DateRangePicker from 'vue2-daterange-picker';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
export default {
  name: 'CreatProjectDlg',
  components: {
    DateRangePicker,
    UserPicker: () => import('@/components/common/UserPicker.vue'),
  },
  data() {
    return {
      dialog: false,
      newProject: {},
      minDate: '2018-01-01',
      maxDate: '2050-12-31',
      files: []
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
    ...mapGetters('user', ['users']),
  },
  methods: {
    ...mapActions("fileUpload", ["filesUpload"]),
    cancel() {
      this.dialog = false
    },
    create() {
      if(this.files.length > 0) {
        let formData = new FormData()
        for(let i=0;i< this.files.length; i++) {
          let file = this.files[i]
          formData.append('files', file)
        }
        this.filesUpload(formData).then(res => {
          let fileIds = []
          res.map(file => {
            fileIds.push(file.file_id)
          })
          this.newProject.item_uploaded_file = fileIds.join()
          this.dialog = false
          this.newProject.item_intern_members = this.newProject.item_intern_members.toString()
          this.newProject.item_followers = this.newProject.item_followers.toString()
          this.newProject.item_approver = this.newProject.item_approver.toString()
          this.$emit('create', this.newProject)
        })
      } else {
        this.newProject.item_intern_members = this.newProject.item_intern_members.toString()
        this.newProject.item_followers = this.newProject.item_followers.toString()
        this.newProject.item_approver = this.newProject.item_approver.toString()
        this.$emit('create', this.newProject)
      }
      this.dialog = false
    },
    open(parent) {
      this.dialog = true
      let now = new Date();
      let quarter = Math.floor((now.getMonth() / 3));
      let start = new Date(now.getFullYear(), quarter * 3, 1);
      let end = new Date(start.getFullYear(), start.getMonth() + 3, 0);
      start = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate();
      end = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate();
      this.newProject = {
        item_name: '',
        item_start_date: start,
        item_end_date: end,
        item_owner: this.authUser.id,
        item_intern_members: [],
        item_followers: [],
        item_approver: [],
        item_description: '',
        item_visible_range: '1',
        item_company_id: this.authUser.user_company_id,
        item_uploaded_file: ""
      }
      if(!!parent) {
        if(Object.keys(parent).includes('kr_id')) {
          this.newProject.item_parent_kr = parent.kr_id
        } else if (Object.keys(parent).includes('ob_id')) {
          this.newProject.item_parent_object = parent.ob_id
        }
      }
    },
    setDateRange(param) {
      let start = param.startDate;
      let end = param.endDate;
      start = new Date(start);
      end = new Date(end);
      start = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate();
      end = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate();
      this.newProject.item_start_date = start;
      this.newProject.item_end_date = end;
    },
    setOwner(e) {
      this.newProject.item_owner = e.user.id
    },
    addMember(e) {
      this.newProject.item_intern_members.push(e.user.id)
    },
    removeMember(index) {
      this.newProject.item_intern_members.splice(index, 1)
    },
    addFollower(e) {
      this.newProject.item_followers.push(e.user.id)
    },
    removeFollower(index) {
      this.newProject.item_followers.splice(index, 1)
    },
    addApprover(e) {
      this.newProject.item_approver.push(e.user.id)
    },
    removeApprover(index) {
      this.newProject.item_approver.splice(index, 1)
    }
  }
}
</script>
<style lang="css">
.item-date-picker {
  border-bottom: 1px  solid gray;
  width: 575px;
  margin-bottom: 20px;
  margin-top: 5px;
}
.input-owner {
  padding-left: 20px;
  border-bottom: 1px solid gray;
  border-radius: 0px;
  margin: 0;
}
.input-avatar {
  border-bottom: 1px solid gray;
  width: 575px;
}
</style>