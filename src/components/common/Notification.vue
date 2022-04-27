<template>
    <v-alert
        dense
        :text="false"
        :shaped="true"
        :type="notification.status"
        :class="notification.text !== '' && 'active'"
        elevation="4"
    >
        {{notification.text}}
    </v-alert>
</template>

<script>
import {
  mapGetters
} from 'vuex'

export default {
    name: 'Notification',
    data() {
        return {}
    },
    computed: {
        ...mapGetters('app', ['notification'])
    },
    methods: { }
}
</script>

<style>
.v-alert {
    position: fixed !important;
    top: 5%; 
    right: -20%;
    z-index: 10000000;
    width: 8%;
    transition: all ease 0.3s !important;
}

.active {
    right: 3%;
}
</style>