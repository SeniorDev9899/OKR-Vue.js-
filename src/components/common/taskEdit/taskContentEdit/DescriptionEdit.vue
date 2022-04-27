<template>
    <v-layout align-center justify-start row class="width100 m_30_0 p_0_8">
        <v-sheet class="width100 height_100 d_flex mt_10 p_5 descriptionEdit" :class="editTaskDescription ? 'edit_window' : ''" >            
            <v-flex  v-if="!editTaskDescription" align-start justify-center shrink d-flex class="height_100" style="margin-right:15px;cursor:pointer;" @click="editTaskDescription=true"><span style="color:#3296FA;">任务描述:</span></v-flex>
            <v-flex  v-if="!editTaskDescription" align-center justify-start grow d-flex class="height_100" @click="editTaskDescription=true"><span style="font-size:35px;color:#565e66;">{{ taskDescription }}</span></v-flex>
            <EditorContent v-if="editTaskDescription" :content = "description" @input = "handle_input" />
            <v-flex v-if="editTaskDescription" class = "pt_2 pb_2 pr_2 w100" style = "padding: 6px 6px 6px 0px;border: 1px solid #a9b8bf;border-top: 0px;" d-flex align-center justify-end>
                <v-btn @click = "closeEditTaskDescriptonWindow" style = "margin-right: 5px;">
                    取消
                </v-btn>
                <v-btn color = "primary" :disabled = "enableSubmitBtn ? false : true" @click = "submitEditedTaskDescription">
                    提交
                </v-btn>
            </v-flex>
        </v-sheet>
    </v-layout>
</template>

<script>
import EditorContent from '@/components/okrgoal/rightInfo/editorContent/EditorContent.vue';

export default {
    props: ['description'],
    components: {
        EditorContent,
    },
    data() {
        return {
            editTaskDescription: false,
            enableSubmitBtn: false,
            descriptionUpdate: null,
        }
    },
    computed: {
        taskDescription() {
            if(!!this.descriptionUpdate)
            {
                return this.descriptionUpdate.replace(/<[^>]+>/g, '');
            } else if(!!this.description) {
                return this.description.replace(/<[^>]+>/g, '');
            }
        }
    },
    methods: {
        closeEditTaskDescriptonWindow() {
            this.editTaskDescription = false;
        },
        handle_input(prop) {
            this.descriptionUpdate = prop.prgValue;
            this.enableSubmitBtn = prop.enableSubmitBtn;
        },
        submitEditedTaskDescription() {
            this.$emit("taskDescriptionEdit", this.descriptionUpdate);
            this.editTaskDescription = false;
        }
    }
}
</script>

<style>
.height_86 {
    height: 86px;
}
.d_flex {
    display: flex;
}
.height_100 {
    height: 100%;
}
.m_30_0 {
    margin: 30px 0px 0px 0px;
}
.p_5 {
    padding: 5px;
}
.mt_10 {
    margin-top: 10px;
}
.descriptionEdit {
    background: #fafbfc !important;
    border-radius: 6px;
}
.descriptionEdit:hover {
    background: #eff2f6 !important;
}
.edit_window {
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    padding: 15px 30px !important;
}
</style>