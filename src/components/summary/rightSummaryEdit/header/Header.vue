<template>
    <v-system-bar color="#f4f6f9" class="height_44">
        <v-container d-flex class="width100 header">
            <v-layout align-center justify-end row class="width100 m_0 summary_header">
                <v-flex d-flex align-center justify-end shrink><span class="header_item-title mr-4"><v-icon class="icon">mdi-pencil-outline</v-icon></span></v-flex>
                <v-flex d-flex align-center justify-end shrink><span class="header_item-title mr-4"><v-icon class="icon">mdi-tag-outline</v-icon></span></v-flex>
                <v-flex d-flex align-center justify-end shrink><span class="header_item-monkey mr-4"><span class="icon-monkey">@</span></span></v-flex>
                <v-flex d-flex align-center justify-end shrink><span class="header_item-title mr-4"><v-icon class="icon">mdi-paperclip</v-icon></span></v-flex>
                <v-flex d-flex align-center justify-end shrink><span class="header_item-title mr-4"><v-icon class="icon">mdi-delete-outline</v-icon></span></v-flex>
                <v-divider vertical class="mr-4"></v-divider>
                <v-flex d-flex align-center justify-end shrink><span><v-icon size="30" class="summary_close" @click="closeRightSummaryEdit">mdi-close</v-icon></span></v-flex>
            </v-layout>
        </v-container>
    </v-system-bar>
</template>

<script>
export default {
    methods: {
        closeRightSummaryEdit() {
            this.$emit("closeRightSummaryEdit");
        }
    }
}
</script>

<style>
.header {
    flex-direction: column;
}
.height_44 {
    height: 44px !important;
}
.summary_header .icon {
    color: #647481 !important;
    font-size: 30px !important;
    cursor: pointer;
}
.summary_header .header_item-title {
    padding: 3px 0px 3px 5px;
    border: 1px solid #A9B8BF;
    border-radius: 50%;
    background-color: white;
}
.header_item-title:hover {
    border: 1px solid #5BABE4;
    box-shadow: 0 0 0 1px #5babe4;
}
.summary_header .icon {
    color: #647481 !important;
    font-size: 20px !important;
    cursor: pointer;
}
.header_item-title:hover .icon {
    color: #5BABE4 !important;
}
.summary_header .header_item-monkey {
    padding: 0px 5px;
    border: 1px solid #A9B8BF;
    border-radius: 50%;
    background-color: white;
}
.summary_header .icon-monkey {
    color: #647481 !important;
    font-size: 20px !important;
    cursor: pointer;
    position: relative;
    bottom: 2px;
}
.summary_close {
    cursor: pointer;
}
.summary_close:hover {
    color: red !important;
}
.header_item-monkey:hover {
    border: 1px solid #5BABE4;
    box-shadow: 0 0 0 1px #5babe4;
}
.header_item-monkey:hover .icon-monkey {
    color: #5BABE4 !important;
}
</style>