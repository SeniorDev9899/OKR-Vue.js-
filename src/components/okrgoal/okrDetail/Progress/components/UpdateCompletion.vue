<template>
    <v-layout d-flex align-center justify-center column>
        <v-flex>
            <v-img
              width = "128"
              src = "@/assets/images/update.png"
            ></v-img>
        </v-flex>
        <v-flex class = "o-progress_empty-text">
            <span class = "fontsize14 ">目标进展一目了然？赶快更新完成度吧</span>
        </v-flex>
        <v-flex>
            <v-btn class = "o-progress_empty-button" color = "#2879ff" @click = "updateCompletion">更新完成度</v-btn>
        </v-flex>
    </v-layout>
</template>

<script>
export default {
    methods: {
        updateCompletion() {
            this.$emit("updateCompletion");
        }
    }
}
</script>

<style scoped>
.fontsize14 {
    font-size: 14px;
}
.o-progress_empty-text {
    color: #3f4755;
    line-height: 22px;
    margin-top: 20px;
}
.o-progress_empty-button {
    padding: 0 16px;
    height: 36px;
    background: #2879ff;
    border-radius: 3px;
    color: #fff;
    line-height: 20px;
    outline: none;
    border: none;
    box-sizing: border-box;
    margin-top: 16px;
}
</style>