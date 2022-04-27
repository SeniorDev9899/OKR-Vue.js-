<template>
 <v-sheet
    class="overflow-show rg_tg animate"
    :class = "app ? 'rg_tg_1' : 'rg_tg_2'"
  >
    <v-container 
      fill-height
    >
      <v-row
        align-center
        justify-center
        :class = "app ? 'moveRight' : ''"
      >
        <v-btn
          dark
          @click.stop="Toggle"
          class = "tg_btn"
          :class = "app ? 'tg_btn_right' : 'tg_btn_left'"
        >
          <v-icon
            v-if = "disapp"
            class = "ma_icon_arrow"
          >
            mdi-arrow-left
          </v-icon>
          <v-icon
            v-if = "app"
            class = "ma_icon_arrow"
          >
            mdi-arrow-right
          </v-icon>
        </v-btn>
      </v-row>
    </v-container>

    <v-navigation-drawer
      absolute
      right
      :class = "app ? 'left' : 'right'"
    >
      <template v-slot:prepend>
        <v-list-item  
          two-line
          :class = "app ? 'move_right_list' : ''"
        >
          <v-list-item-avatar>
            <img src="https://randomuser.me/api/portraits/women/81.jpg">
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>Jane Smith</v-list-item-title>
            <v-list-item-subtitle>Logged In</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-divider
      ></v-divider>

      <v-list 
        dense
        :clas = "app ? 'move' : ''"
      >
        <v-list-item
          v-for="item in items"
          :key="item.title"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-sheet>
</template>

<script> 
export default {
    data() {
        return {
            app: false,
            disapp: true,
            items: [
                { title: 'Home', icon: 'mdi-view-dashboard' },
                { title: 'About', icon: 'mdi-forum' },
            ],
        }
    },
    computed : {
        drawer() {
            return this.drawer;
        }
    },
    methods : {
        Toggle() {
            this.disapp = !this.disapp;
            this.app = !this.app;
        },
    }
}
</script>

<style>
.rg_tg {
  position: fixed; 
  right : 0rem;
  height: 96% !important;
}
.rg_tg_1 {
  width: 19rem !important;
}
.rg_tg_2 {
  width: 3rem !important;
}
.tg_btn {
  background-color : #eee !important;
  border-left : 1px solid #eee !important;
  border-top: 1px solid #eee !important;
  border-right : 1px solid #eee !important;
  border-top-left-radius : 12px !important;
  border-bottom-left-radius : 12px !important;
  width: 10px;
  min-width: 10px !important;
  height : 100px !important;
  cursor : pointer;
}
.tg_btn_left {
  right: 2rem !important;
  top: 45%;
}
.tg_btn_right {
  left: 1rem !important;
  top: 45%;
}
.tg_btn:hover {
  background-color : #ddd !important;
  border-left : 1px solid #ddd;
  border-top : 1px solid #ddd;
  border-right : 1px solid #ddd;
}
.animate {
  transition : all 1s ease;
}
.animate.left {
  right : 20rem;
}
.animate.right {
  right : 0px;
}
.moveRight {
  right : 20rem;
}
.move_right_list {
  left : 0px;
}
</style>
