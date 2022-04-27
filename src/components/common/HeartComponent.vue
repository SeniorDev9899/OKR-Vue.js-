
<template>
    <span class="ml-4" style="cursor:pointer;" @click="removeFollower(pickedUser)">
        <v-icon style="color: rgb(240, 94, 94); font-size: 18px;" v-if="!removeClick">mdi-heart</v-icon>
        <v-icon style="color: #ddd; font-size: 18px;" v-if="removeClick">mdi-heart-outline</v-icon>
    </span>
</template>

<script>
export default {
    name: 'HeartComponent',
    props: ['pickedUser'],
    components: {},
    computed: {
        removeClick: function() {
            return this.removedId == this.pickedUser.id ? true : false
        }
    },
    data() {
        return {
            removedId: null
        }
    },
    methods: {
        removeFollower(user) {
            if(!this.removeClick) {
                this.$emit('removeFollower', user);
                this.removedId = user.id;
            }else{
                this.$emit('addFollower', user);
                this.removedId = null;
            }
        }
    }
}
</script>