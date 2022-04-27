<template>
<v-container fluid>
  <!-- item banner -->
  <div v-if="item">
    <v-container fluid>
      <v-row class="pl-4 align-center">
        <span class="text-subtitle-2">关联对象:</span>
        <span v-if="keyResults[0]" class="text-subtitle-2 blue--text">{{ keyResults[0].kr_name }}</span>
        <span v-else class="text-subtitle-2 blue--text">暂无关联</span>
      </v-row>
      <v-row>
        <!-- item owner -->
        <v-col cols="1">
          <v-avatar color="orange" size="80"><span class="white--text">{{ item.item_owner | username }}</span></v-avatar>
        </v-col>
        <v-col class="pt-3" cols="6">
          <!-- item name -->
          <div v-if="!itemName" class="my-2 align-center">{{ item.item_name }}
            <v-icon v-if="item.item_status==0" @click="itemName=item.item_name" class="ml-2">mdi-pencil-outline</v-icon>
          </div>
          <v-text-field @keyup.enter="changeItemName" v-else v-model="itemName"></v-text-field>

          <!-- add label -->
          <v-menu :close-on-content-click="false" v-model="labelMenu" offset-x offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" max-height="25" max-width="25" fab small color="grey">
                <v-icon small color="green">mdi-plus</v-icon>
              </v-btn>
            </template>
            <LabelForm @pick="addItemLabel" />
          </v-menu>
          <!-- show labels -->
          <v-chip @click:close="removeLabel(id)" close v-if="labels.length > 0" class="ma-1" v-for="(id, i) in labelIds" :key="i">
            <div :class="`${colors[getLabel(id).tag_color]} rounded-circle pa-1`"></div><span class="ml-2 text-caption">{{ getLabel(id).tag_name }}</span>
          </v-chip>
          <v-skeleton-loader v-else height="50" max-width="300" type="chip"></v-skeleton-loader>
        </v-col>
        <v-spacer></v-spacer>
        <!-- remind update progress-->
        <v-btn class="my-4 mx-1" dark color="blue" small>
          <v-icon small>mdi-cursor-pointer</v-icon>提醒更新进展
        </v-btn>
        <!-- copy item -->
        <!-- <v-btn class="my-4 mx-1" dark color="blue" small>复制项目</v-btn> -->
        <!-- options of item -->
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" class="mt-4" small text>
              <v-icon small>mdi-cog-outline</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
            <!-- complete item -->
              <v-btn v-if="item.item_status==0" @click="completeItem" text small>完成项目</v-btn>
              <v-btn v-else @click="restartItem" text small>重启项目</v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn @click="removeItem" text small>删除项目</v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-row>
      <v-row class="pl-16 align-center">
        <!-- item daterange -->
        <span class="text-caption">起止时间</span>
        <span class="text-caption ml-3">{{ item.item_start_date }} - {{ item.item_end_date }}</span>
        <span :class="`text-subtitle-2 ${getRestDays(item.item_end_date).color}--text ml-3`">{{ getRestDays(item.item_end_date).text }}</span>
        <!--item change item daterange -->
        <date-range-picker v-if="item.item_status==0" ref="picker" opens="right" control-container-class="mx-2" :locale-data="{ 
                            firstDay: 1,
                            format: 'yyyy-mm-dd',
                            applyLabel: '确定',
                            cancelLabel: '取消',
                            daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                            monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
                        }" :minDate="minDate" :maxDate="maxDate" :dateRange="{startDate: item.item_start_date, endDate: item.item_end_date}" :ranges="false" @update="updateItemDate">
          <template v-slot:input="picker">
            <v-icon  style="cursor:pointer;">mdi-pencil-outline</v-icon>
          </template>
        </date-range-picker>              
        <span class="text-caption ml-16">进度</span>
        <v-col cols="1">
          <v-progress-linear height="8" rounded :value="item.item_progress"></v-progress-linear>
        </v-col>
        <span class="text-caption">{{ item.item_progress }}%</span>
        <!-- item progress edit -->
        <v-icon v-if="item.item_status==0" class="mx-2" @click="openProgressDlg">mdi-pencil-outline</v-icon>
      </v-row>
      <v-row>
        <v-divider></v-divider>
      </v-row>
    </v-container>
  </div>
  <ItemProgressDlg @save="updateProgerss" v-bind:newProgress="itemProgress" ref="itemProgressDlg" />
</v-container>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex'
import DateRangePicker from 'vue2-daterange-picker';
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
export default {
  name: 'ItemBanner',
  components: {
    LabelForm: () => import('@/components/itemDetail/shared/LabelForm.vue'),
    ItemProgressDlg: () => import('@/components/itemDetail/shared/ItemProgressDlg.vue'),
    DateRangePicker,
  },
  props: ['item'],
  computed: {
    ...mapGetters('label', ['labels']),
    ...mapGetters('keyResult', ['keyResults']),
    labelIds: function () {
      const ids = this.item.item_tag.split(',')
      if (ids[0] == '') {
        ids.splice(0, 1)
      }
      return ids
    }
  },
  data: () => ({
    itemName: null,
    labelMenu: false,
    colors: [
      'red', 'pink', 'orange', 'green', 'blue', 'purple'
    ],
    itemProgress: {
      pr_parent_type: 3,
      pr_description: '',
      pr_percent: 0
    },
    dateMenu: false,
    minDate: '2018-01-01',
    maxDate: '2050-12-31',
  }),
  methods: {
    ...mapActions('label', ['getLabels']),
    ...mapActions('item', ['updateItemByField']),
    ...mapActions('keyResult', ['getKeyResults']),
    getRestDays(endDate) {
      let temp;
      const today = new Date();
      const endDay = new Date(endDate);
      const oneDay = 24 * 60 * 60 * 1000;
      const diffDays = Math.round((endDay - today) / oneDay);
      if (diffDays >= 0) {
        temp = {
          text: `剩余${diffDays}天`,
          color: "blue"
        }
      } else {
        temp = {
          text: `过期${-diffDays}天`,
          color: "red"
        }
      }
      return temp
    },
    addItemLabel(e) {
      this.$emit('changeLabel', e)
    },
    getLabel(id) {
      const index = this.labels.findIndex(label => label.tag_id == id)
      return this.labels[index]
    },
    removeLabel(id) {
      this.$emit('removeLabel', id)
    },
    changeItemName() {
      this.updateItemByField({
        item_id: this.item.item_id,
        item_name: this.itemName
      })
      this.itemName = null
    },
    openProgressDlg() {
      this.itemProgress.pr_percent = this.item.item_progress
      this.itemProgress.pr_parent = this.item.item_id
      this.$refs.itemProgressDlg.open()
    },
    updateProgerss() {
      this.$emit('addProgress', this.itemProgress)
    },
    updateItemDate(param) {
      let start = param.startDate
      let end = param.endDate
      start = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate();
      end = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate();
      this.$emit('updateDate', {
        item_id: this.item.item_id,
        item_start_date: start,
        item_end_date: end,
      })
    },
    completeItem() {
      this.$emit('complete')
    },
    restartItem() {
      this.$emit('restart')
    },
    removeItem() {
      this.$emit('remove')
    }
  },
  mounted() {
    this.getLabels()
    this.getKeyResults({kr_id: this.item.item_parent_kr})
  }
}
</script>
