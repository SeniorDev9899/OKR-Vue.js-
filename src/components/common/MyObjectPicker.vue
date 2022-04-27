<template>
<v-card class="pa-4" width="350" height="500">
  <v-container>
    <v-tabs height="30" v-model="tab">
      <v-tabs-slider></v-tabs-slider>
      <v-tab active-class="tab-active" class="text-caption">
        目标
      </v-tab>
      <v-tab active-class="tab-active" class="text-caption">
        项目
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <!-- objects -->
      <v-tab-item transition="scale-transition">
        <v-card class="card-scroll" color="#FAFAFA" height="380">
          <v-treeview open-all :items="myObjects">
            <template v-slot:prepend="{item}">
              <v-icon :color="getObjectColor(item.ob_id)" v-if="item.ob_name">mdi-target</v-icon>
              <v-btn v-if="item.ob_name" :color="getObjectColor(item.ob_id)" class="text-caption" @click="pickObject(item.ob_id)" small text>{{ item.ob_name }}</v-btn>
              <span class="text-caption" v-if="item.category">{{item.category}}</span>
            </template>
          </v-treeview>
        </v-card>
      </v-tab-item>
      <!-- projects -->
      <v-tab-item transition="scale-transition">
        <v-card class="card-scroll" color="#FAFAFA" height="380">
          <v-treeview open-all :items="myItems">
            <template v-slot:prepend="{item}">
              <v-icon :color="getItemColor(item.item_id)" v-if="item.item_name">mdi-calendar-clock</v-icon>
              <v-btn v-if="item.item_name" :color="getItemColor(item.item_id)" class="text-caption" @click="pickItem(item.item_id)" small text>{{ item.item_name }}</v-btn>
              <span class="text-caption" v-if="item.category">{{item.category}}</span>
            </template>
          </v-treeview>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
    <v-card-actions class="justify-end pa-2">
      <v-btn @click="onCancel" small>取消</v-btn>
      <v-btn color="primary" @click="onOk" small>确定</v-btn>
    </v-card-actions>
  </v-container>

</v-card>
</template>

<script>
import {
  mapActions,
  mapGetters
} from 'vuex'
export default {
  name: 'myObjectPicker',
  data() {
    return {
      tab: null,
      payload: {}
    }
  },
  computed: {
    ...mapGetters('okr', ['okrObj']),
    ...mapGetters('auth', ['authUser']),
    ...mapGetters('item', ['items']),
    myObjects: function () {
      return [{
          category: '我负责的',
          children: this.okrObj.filter(item => item.ob_owner == this.authUser.id)
        },
        {
          category: '我参与的',
          children: this.okrObj.filter(item => {
            const participant = item.ob_participant ? item.ob_participant.split(',') : []
            if (participant.includes(this.authUser.id.toString())) {
              return item
            }
          })
        }
      ]
    },
    myItems: function () {
      return [
        {
          category: '我负责的',
          children: this.items.filter(item => item.item_owner == this.authUser.id)
        },
        { 
          category: '我参与的',
          children: this.items.filter(item => {
            const participant = item.item_participant ? item.item_participant.split(',') : []
            if (participant.includes(this.authUser.id.toString())) {
              return item
            }
          })
        }
      ]
    }
  },
  methods: {
    ...mapActions('okr', ['getOkrs']),
    ...mapActions('item', ['getItems']),
    pickObject(id) {
      this.payload = {
        ob_id: id
      }
    },
    pickItem(id) {
      this.payload = {item_id: id}
    },
    getObjectColor(id) {
      if (Object.keys(this.payload).includes('ob_id')) {
        return this.payload.ob_id === id ? "blue" : 'gray'
      } else {
        return 'gray'
      }
    },
    getItemColor(id) {
      if (Object.keys(this.payload).includes('item_id')) {
        return this.payload.item_id === id ? "blue" : 'gray'
      } else {
        return 'gray'
      }
    },
    onOk() {
      this.$emit('pick', this.payload)
    },
    onCancel() {
      this.$emit('pick', {})
      this.payload = {}
    }
  },
  mounted() {
    this.getOkrs({})
    this.getItems({item_participant: this.authUser.id})
  }
}
</script>

<style>
.tab-active {
  border: 1px solid #E3F2FD;
}

.card-scroll {
  overflow-y: auto;
}
</style>
