<template>
<v-dialog v-model="dialog" width="350">
  <v-card height="450">
    <v-container class="pt-4" fluid>
      <v-row style="height:400px;">
        <v-treeview :items="myItems">
          <template v-slot:prepend="{ item, open }">
            <v-btn v-if="item.item_name" @click="select(item)" plain small>
              <v-icon class="mx-1" small>mdi-calendar-clock</v-icon>{{ item.item_name }}
            </v-btn>
          </template>
        </v-treeview>
      </v-row>
      <v-divider></v-divider>
      <v-row class="justify-end mt-4 mx-3">
        <v-btn @click="cancel" class="mx-1" small>取消</v-btn>
        <v-btn @click="assignItem" class="mx-1" color="primary" small>确定</v-btn>
      </v-row>
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
  name: 'ItemPicker',
  computed: {
    ...mapGetters("item", ["items"]),
    ...mapGetters("auth", ["authUser"]),
    myItems: function () {
      return [{
          name: "我负责的",
          children: this.items.filter(item => item.item_owner == this.authUser.id && item.item_parent_object != this.parent.item_parent_object)
        },
        {
          name: "我参与的",
          children: this.items.filter(item => {
            const paticipants = item.item_participant.split(',')
            if (paticipants.includes(this.authUser.id.toString()) && item.item_parent_object != this.parent.item_parent_object) {
              return item
            }
          })
        }
      ]
    }
  },
  data() {
    return {
      dialog: false,
      parent: null,
      selectedItem: null,
    }
  },
  methods: {
    ...mapActions("item", ["getItems", "updateItem"]),
    open(parent) {
      this.dialog = true
      this.parent = parent
      this.getItems({
        item_owner: this.authUser.id,
        item_participant: this.authUser.id
      })
    },
    select(item) {
      this.selectedItem = item
    },
    cancel() {
      this.dialog = false
    },
    assignItem() {
      const payload = {
        item_id : this.selectedItem.item_id,
        ...this.parent
      }
      this.updateItem(payload)
      this.dialog = false
    }
  }
}
</script>
