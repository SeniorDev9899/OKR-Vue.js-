<template>
    <div class="avatar-container d-flex align-center">
        <span class="user" :style="{'min-width': width, height: height}">
            <span class="d-flex justify-center align-center text-center">
                <span>{{name}}</span>
            </span>
        </span>
        <span class="remove-icon" v-if="isRemove" @click="removeUser">
            <v-icon style="font-size: 12px;color: #fff;">mdi-close</v-icon>
        </span>
    </div>
</template>

<script>
export default {
    name: 'UserAvatar',
    props: ['name', 'width', 'height', 'isRemove'],
    methods: {
        removeUser() {
            this.$emit('picked', this.name)
        }
    } 
}
</script>

<style scoped>
    .avatar-container {
        position: relative;
    }

    .user {
        border-radius: 50%;
        overflow: hidden;
        position: relative;
        display: inline-block;
    }

    .user > span {
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: 30px;
        background-color: rgb(185, 204, 79);
        color: rgb(255, 255, 255);
        font-size: 12px;
        position: relative;
        vertical-align: middle;
        line-height: normal;
    }

    .avatar-container:hover .remove-icon {
        display: inline-block;
    }

    .remove-icon {
        position:absolute;
        top:-2px;
        right: -3px;
        display: none;
        background: rgba(240, 94, 94);
        width: 15px;
        height: 15px;
        border-radius: 50%;
        padding-right: 0px;
        padding-bottom: 5px;
        text-align: center;
    }

    .remove-icon i {
        margin-top: -9px;
    }

    .remove-icon:hover {
        cursor: pointer;
    }
</style>