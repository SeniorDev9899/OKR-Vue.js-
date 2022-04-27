<template>
    <v-layout align-center justify-start column class="width100 m_20_0 p_0_8">
        <v-flex class="width100"><HiddenEditRelatedMembers :creator="creator" :owner="owner" :approver="approver" :collaborators="collaborators" @setOwner="handle_setOwner" @setApprover="handle_setApprover" @removeApprover="handle_removeApprover" @setCollaborator="handle_setCollaborator" @removeCollaborator="handle_removeCollaborator" /></v-flex>
        <!-- <v-flex class="width100 mt_20"><HiddenEditTaskAttributes v-if="!!connectedWork" :connectedWork="connectedWork" @removeConnectedWork="handle_removeConnectedWork" /></v-flex> -->
        <v-flex class="width100 mt_20"><HiddenEditOtherAttributes :visibleRange="visibleRange" :uploadedFiles="uploadedFiles" @setVisibleRange="handle_setVisibleRange" @uploadTaskFile="handle_uploadTaskFile" /></v-flex>
    </v-layout>
</template>

<script>
import HiddenEditRelatedMembers from './HiddenEditRelatedMembers.vue';
import HiddenEditTaskAttributes from './HiddenEditTaskAttributes.vue';
import HiddenEditOtherAttributes from './HiddenEditOtherAttributes.vue';

export default {
    props: ['creator', 'owner', 'approver', 'collaborators', 'connectedWork', 'visibleRange', 'uploadedFiles'],
    components: {
        HiddenEditRelatedMembers,
        HiddenEditTaskAttributes,
        HiddenEditOtherAttributes
    },
    methods: {
        handle_setOwner(prop) {
            this.$emit("setOwner", prop);
        },
        handle_setApprover(prop) {
            this.$emit("setApprover", prop);
        },
        handle_removeApprover() {
            this.$emit("removeApprover");
        },
        handle_setCollaborator(prop) {
            this.$emit("setCollaborator", prop);
        },
        handle_removeCollaborator(prop) {
            this.$emit("removeCollaborator", prop);
        },
        handle_removeConnectedWork() {
            this.$emit("removeConnectedWork");
        },
        handle_setVisibleRange(prop) {
            this.$emit("setVisibleRange", prop);
        },
        handle_uploadTaskFile(prop) {
            this.$emit("uploadTaskFile", prop);
        }
    }
}
</script>

<style>
.m_20_0 {
    margin: 20px 0px 0px 0px !important;
}
.mt_20 {
    margin-top: 20px;
}
</style>