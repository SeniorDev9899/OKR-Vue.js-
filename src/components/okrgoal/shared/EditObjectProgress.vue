<template>
  <v-dialog
    width = "600"
    v-model = "dialog"
    persistent
  >
    <v-card>
        <v-card-title>
            <v-container d-flex align-center justify-start>
                <v-layout d-flex align-center justify-start row>
                    <v-flex><span class="fontFamily editDescriptionTitle p_0">编辑目标进展</span></v-flex>
                    <v-flex d-flex align-center justify-end @click = "dialog = false"><v-icon class = "closeIcon">mdi-close</v-icon></v-flex>
                </v-layout>
            </v-container>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class = "pt_20">
            <v-textarea
              auto-grow
              hide-details
              outlined
              placeholder="请输入进展"
              v-model="desc_edit"
              @input = "inputEditDescription"
            ></v-textarea>
        </v-card-text>
        <v-card-actions>
            <v-container class = "pt_0_prl_8" d-flex align-center justify-end>
                <v-layout class = "width100 m_0" d-flex align-center justify-end row>
                    <v-flex grow d-flex align-center justify-end class = "mr_10"><v-btn @click = "dialog = false">取消</v-btn></v-flex>
                    <v-flex shrink><v-btn color = "primary" @click = "submitProgressDescription">确定</v-btn></v-flex>
                </v-layout>
            </v-container>
        </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    data() {
        return {
            dialog: false,
            desc_edit: "",
            enable_submit: false,
            percent: null,
            status: null,
            object_id: "",
            pr_id: "",
        }
    },
    methods: {
        ...mapActions('progress', ['updateProgress']),
        openEditDescriptionModal(prop) {
            this.dialog = true;
            this.desc_edit = prop.description;
            this.percent = prop.percent;
            this.status = prop.status;
            this.object_id = prop.object_id;
            this.pr_id = prop.pr_id;
        },
        inputEditDescription(prop) {
            if(prop == "")
            {
                this.enable_submit = false;
            } else {
                this.enable_submit = true;
            }
        },
        submitProgressDescription() {
            let info = {
                pr_parent_type : 0,
                pr_creator : 1,
                pr_parent : this.object_id,
                pr_id : this.pr_id,
                pr_description : this.desc_edit,
                pr_percent: this.percent,
                pr_status: this.status,
            }
            this.$emit("updateProgress", info);
            this.dialog = false;
        }
    }
}
</script>

<style scoped>
.fontFamily {
    font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei;
}
.editDescriptionTitle {
    padding: 16px 32px;
    font-size: 18px;
    font-weight: bold;
    line-height: 28px;
    border-bottom: 1px solid rgb(233, 236, 240);
    color: rgb(20, 28, 40);
    text-align: left;
}
.closeIcon {
    transition: all .6s ease;
    padding: 0px;
    cursor: pointer;
    height: 36px;
    font-size: 30px;
    font-weight: 400;
    color: rgb(20, 28, 40);
}
.closeIcon:hover {
    color: rgb(244 22 72) !important;
}
.p_0 {
    padding: 0px;
}
.pt_20 {
    padding-top: 20px !important;
}
.mr_10 {
    margin-right: 10px;
}
.width100 {
    width: 100%;
}
.m_0 {
    margin: 0px;
}
.pt_0_prl_8 {
    padding: 0px 8px;
}
</style>