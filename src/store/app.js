import { SettingService } from '../utils/api.service';

export default {
    namespaced: true,
    state: {
        drawer: true,
        notification: {
            status: 'success',
            text: ''
        },
        isExpansionToggle: [0],
        isExpansionToggleone: [1],
        isMoreSeeting: true,
        filterSetting: {
            team: {},
            department: {},
            enterprise: {
                project: {},
                goal: {
                    departmentTarget: true,
                    periodYear: false,
                    periodQuater: true,
                    periodMonth: false,
                    targetProgress: false
                },
                plan: {},
                daily: {},
                weekly: {},
                report: {}
            }
        },
        currentRouter: '',
        filter: {},
        isUser: true,
        pickedUser: null
    },
    getters: {
        drawer: state => state.drawer,
        notification: state => state.notification,
        isExpansionToggle: state => state.isExpansionToggle,
        isExpansionToggleone: state => state.isExpansionToggleone,
        isMoreSeeting: state => state.isMoreSeeting,
        filterSetting: state => state.filterSetting,
        currentRouter: state => state.currentRouter,
        okrFilter: state => state.filter,
        isUser: state => state.isUser,
        pickedUser: state => state.pickedUser,
    },
    mutations: {
        setCompanyView(state, option) {
            if (option == 'user') {
                state.isUser = true;
            } else {
                state.isUser = false;
            }
        },
        setPickedUser(state, param) {
            state.isUser = true;
            state.pickedUser = param;
        },
        setFilter(state, filter) {
            Object.assign(state.filter, filter);
        },
        formatFilter(state) {
            state.filter = {}
        },
        setDrawer(state) {
            state.drawer = !state.drawer;
        },
        setNotification(state, obj) {
            state.notification = obj;
            setTimeout(function () {
                state.notification = {
                    status: 'success',
                    text: ''
                };
            }, 3000);
        },
        setExpansionToggle(state) {
            state.isExpansionToggle = state.isExpansionToggle[0] == 0 ? [1] : [0];
        },
        setExpansionToggleone(state) {
            state.isExpansionToggleone = state.isExpansionToggleone[0] == 0 ? [1] : [0];
        },
        setMoreSettingToggle(state) {
            state.isMoreSeeting = !state.isMoreSeeting;
        },
        setPeriodFilter(state, obj) {
            state.filterSetting.enterprise = JSON.parse(obj.st_value);
        },
        setCurrentRouter(state, payload) {
            state.currentRouter = payload
        }
    },
    actions: {
        setCompanyView({ commit }, option) {
            commit('setCompanyView', option)
        },
        setPickedUser({ commit }, param) {
            commit('setPickedUser', param)
        },
        setFilter({ commit }, filter) {
            commit('setFilter', filter)
        },
        formatFilter({ commit }) {
            commit('formatFilter')
        },
        setDrawer({ commit }) {
            commit('setDrawer')
        },
        setNotification({ commit }, obj) {
            commit('setNotification', obj);
        },
        setExpansionToggle({ commit }, value) {
            commit('setExpansionToggle');
        },
        setExpansionToggleone({ commit }, value) {
            commit('setExpansionToggleone');
        },
        setMoreSettingToggle({ commit }) {
            commit('setMoreSettingToggle');
        },
        setPeriodFilter({ commit }, obj) {
            let settingObj = JSON.stringify(obj);
            let payload = {
                "st_category_id": 1,
                "st_category_type": 0
            };
            SettingService.getSetting(payload).then(res => {
                if (res.data.data.length > 0) {
                    let param = {
                        "st_id": res.data.data[0].st_id,
                        "st_value": settingObj
                    }
                    SettingService.updateSetting(param).then(res => { });
                } else {
                    SettingService.createSetting(settingObj).then(res => { });
                }
            });
        },
        getSettings({ commit }) {
            let payload = {
                "st_category_id": 1,
                "st_category_type": 0
            };
            SettingService.getSetting(payload).then(res => {
                if (res.data.data.length > 0) {
                    let response = res.data.data[0];
                    commit('setPeriodFilter', response)
                }
            });
        },
        setCurrentRouter({ commit }, payload) {
            commit('setCurrentRouter', payload)
        }
    }
}