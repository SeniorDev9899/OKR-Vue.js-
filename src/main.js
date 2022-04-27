import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

require('@/assets/icon.css')
require('@/assets/font_style.css')

// Implementation of Vuetify Tiptap Editor
import { TiptapVuetifyPlugin } from 'tiptap-vuetify'
import 'tiptap-vuetify/dist/main.css'
import 'vuetify/dist/vuetify.min.css'
import moment from 'moment'

import Donut from 'vue-css-donut-chart';
import 'vue-css-donut-chart/dist/vcdonut.css';
import ZkTable from 'vue-table-with-tree-grid'

Vue.use(ZkTable)

Vue.use(Donut);
Vue.config.productionTip = false
Vue.use(Vuetify)
Vue.use(TiptapVuetifyPlugin, {
    vuetify,
    iconsGroup: 'md',
})
new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app')

// filters
Vue.filter('formatDate', function (value) {
    if (value) {
        return moment(String(value)).format('YYYY/MM/DD')
    }
});

Vue.filter('taskFormatDate', function (value) {
    if (value) {
        return moment(String(value)).format('MM/DD HH:mm')
    }
});
Vue.filter('username', function (id) {
    if (id != null) {
        const users = store.getters['user/users']
        if (users.length > 0) {
            const index = users.findIndex(user => user.id == id)
            return users[index] ? users[index].employeeName : '';
        } else {
            return '';
        }
    }
    return ''
})
Vue.filter('surename', function (id) {
    if (id != null) {
        const users = store.getters['user/users']
        if (users.length > 0) {
            const index = users.findIndex(user => user.id == id)
            return users[index] ? users[index].employeeName.charAt(0) : '';
        } else {
            return '';
        }
    }
    return ''
})
Vue.filter('department', function (id) {
    if (!!id) {
        const departments = store.getters['department/departments']
        const index = departments.findIndex(department => department.id == id)
        return departments[index] ? departments[index].departmentOaName ? departments[index].departmentOaName : '' : ''
    }
    return ''
})
Vue.filter('fileName', function (id) {
    if (!!id) {
        const files = store.getters['fileUpload/files']
        const index = files.findIndex(file => file.file_id == id)
        return files[index] ? files[index].file_name : '';
    } else {
        return '';
    }
})
Vue.directive("click-outside", {
    bind: function (el, binding, vnode) {
        el.eventSetDrag = function () {
            el.setAttribute('data-dragging', 'yes');
        }
        el.eventClearDrag = function () {
            el.removeAttribute('data-dragging');
        }
        el.eventOnClick = function (event) {
            var dragging = el.getAttribute('data-dragging');
            // Check that the click was outside the el and its children, and wasn't a drag
            if (!(el == event.target || el.contains(event.target)) && !dragging) {
                // call method provided in attribute value
                vnode.context[binding.expression](event);
            }
        };
        document.addEventListener('touchstart', el.eventClearDrag);
        document.addEventListener('touchmove', el.eventSetDrag);
        document.addEventListener('click', el.eventOnClick);
        document.addEventListener('touchend', el.eventOnClick);
    },
    unbind: function (el) {
        document.removeEventListener('touchstart', el.eventClearDrag);
        document.removeEventListener('touchmove', el.eventSetDrag);
        document.removeEventListener('click', el.eventOnClick);
        document.removeEventListener('touchend', el.eventOnClick);
        el.removeAttribute('data-dragging');
    },
});
Vue.mixin({
    methods: {
        getCurrentCycle: function () {
            let now = new Date();
            let quarter = Math.floor((now.getMonth() / 3));
            let start = new Date(now.getFullYear(), quarter * 3, 1);
            let end = new Date(start.getFullYear(), start.getMonth() + 3, 0);
            start = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate();
            end = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate();
            return { start: start, end: end }
        },
        getCycle: function () {
            // Get current date, quater and filter okr objects
            // 获取当前日期、季度和过滤 okr 对象
            let today = new Date();
            let year = today.getFullYear();
            let month = today.getMonth() + 1;
            let start, end, cycle;
            if (month >= 1 && month <= 3) {
                month = '/1';
                start = year + '/01/01';
                end = year + '/03/31';
                cycle = year + month;
            }
            if (month >= 4 && month <= 6) {
                month = '/2';
                start = year + '/04/01';
                end = year + '/06/30';
                cycle = year + month;
            }
            if (month >= 7 && month <= 9) {
                month = '/3';
                start = year + '/07/01';
                end = year + '/09/30';
                cycle = year + month;
            }
            if (month >= 10 && month <= 12) {
                month = '/4';
                start = year + '/10/01';
                end = year + '/12/31';
                cycle = year + month;
            }
            return cycle;
        }
    }
})