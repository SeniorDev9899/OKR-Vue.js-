<template>
<v-flex class="right_userInfo_layflex_tabs">
      <v-layout align-center justify-start class="right_userInfo_laypadding_tabs">

        <ProgressTab 
            :length = "progressLength" 
            :progressEnable = "progressEnable"
            @displayProgress = "handle_displayProgress"
        />
        
        <InteractiveTab 
            :interactiveEnable = "interactiveEnable" 
            @displayInteractive = "handle_displayInteractive"
        />

        <ReviewTab 
            :reviewEnable = "reviewEnable" 
            @displayReview = "handle_displayReview"
        />
        
      </v-layout>
</v-flex>
</template>

<script>
import ProgressTab from './ProgressTab.vue';
import InteractiveTab from './InteractiveTab.vue';
import ReviewTab from './ReviewTab.vue';

export default {
    props: ['progressLength', 'progressWindow', 'interactiveWindow', 'reviewWindow'],
    components: {
        ProgressTab,
        InteractiveTab,
        ReviewTab,
    },
    data() {
        return {
            progressEnable: true,
            interactiveEnable: false,
            reviewEnable: false,
        }
    },
    watch: {
      progressWindow(v) {
        this.progressEnable = v;
      },
      interactiveWindow(v) {
        this.interactiveEnable = v;
      },
      reviewWindow(v) {
        this.reviewEnable = v;
      }
    },
    methods: {
        handle_displayProgress() {
            this.progressEnable = true;
            this.interactiveEnable = false;
            this.reviewEnable = false;
            this.$emit("displayProgressWindow");
        },
        handle_displayInteractive() {
            this.interactiveEnable = true;
            this.progressEnable = false;
            this.reviewEnable = false;
            this.$emit("displayInteractiveWindow");
        },
        handle_displayReview() {
            this.reviewEnable = true;
            this.progressEnable = false;
            this.interactiveEnable = false;
            this.$emit("displayReviewWindow");
        }
    }
}
</script>

<style>
.right_userInfo_flex {
  width: 100%;
}
.right_userInfo_laypadding_tabs {
  padding: 10px;
  width: 70%;
}
.right_userInfo_layflex_tabs {
  padding: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer !important;
  width: 100%;
}
.right_score_writesheet {
  background-color: white !important;
  border-radius: 30px !important;
  padding: 1px 10px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all ease 1s;
}
.right_score_writesheet_add_1 {
  background-color: rgb(56, 186, 115) !important;
}
.r_icon_score {
  font-size: 15px !important;
  color: white !important;
}
.r_icon_mesg {
  font-size: 15px !important;
  color: #9aa6b2 !important;
}
.r_score_writedown {
  font-size: 15px !important;
  color: white;
}
.right_message {
  font-size: 15px !important;
  color: #9aa6b2 !important;
}
</style>