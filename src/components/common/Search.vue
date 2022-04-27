<template>
  <v-dialog 
    v-model = "search"  
    :overlay-color = "search ? 'white': ''"
    :overlay-opacity = "search ? 0 : ''"
    content-class = "review-dialog"
  >
    <v-list class="majorList" :class = "search ? 'review-search' : ''">
      <v-container align-center justify-start style="padding: 0px;">
        <v-layout align-center justify-start column fluid>
          <v-flex style="width: 100%;">
            <v-text-field
              hide-details="auto"
              prepend-icon="mdi-magnify"
              label="搜索"
              style="padding: 0px;"
            ></v-text-field>
          </v-flex>
          <v-flex style="width: 100%;">
            <v-container
              align-center
              justify-center
              style="height: 320px; padding: 0px;"
            >
              <v-layout align-center justify-center column style="height: 100%">
                <v-flex style="height: 95%; width: 100%;">
                  <v-sheet id="imgSheet">
                    <img
                      src="@/assets/images/search.png"
                      style="width: 100%;"
                    />
                    <span style="font-size: 12px; color : grey;"
                      >这里什么都没有...</span
                    >
                  </v-sheet>
                </v-flex>
                <v-flex style="width: 100%; color : blue;">
                  <v-layout align-center justify-end row>
                    <v-flex shrink>
                      <span>高级模式</span>
                    </v-flex>
                    <v-flex shrink>
                      <v-icon style="color : blue;">
                        mdi-chevron-right
                      </v-icon>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-container>
          </v-flex>
        </v-layout>
      </v-container>
    </v-list>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      majorIcon: true,
      search: false,
      closeOnContentClick: false,
    };
  },
  methods: {
    open() {
      this.search = true;
    }
  }
};
</script>

<style>
.majorTitle {
  font-size: 14px;
}

.major_icon_rotate {
  transform: rotate(180deg);
}

.majorList {
  width: 310px;
  padding: 10px;
}

#imgSheet {
  width: 118px;
  height: 88px;
  position: relative;
  top: calc(100% - 200px);
  left: calc(100% - 200px) !important;
}
.position {
  position: absolute !important;
  left: calc(50% - 244px) !important;
  top: calc(50% - 232px) !important;
}
.review-dialog {
  width: 306px;
  position: relative;
  right: 75px;
  bottom: 40px;
}
.review-search {
  width: 100%;
  margin: 0px;
  overflow-x: hidden;
}
</style>
