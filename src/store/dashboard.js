import { DashboardService } from '../utils/api.service';
export default {
    namespaced: true,
    state: {
        dashSetting: null,
        itemStatistics: null,
        dashTrack: null,
        dashAnalyze: null,
        trackProgress: null,
    },
    getters: {
        dashSetting: state => state.dashSetting,
        itemStatistics: state => state.itemStatistics,
        dashTrack: state => state.dashTrack,
        dashAnalyze: state => state.dashAnalyze,
        trackProgress: state => state.trackProgress,
    },
    mutations: {
        getDashSetting(state, payload) {
            state.dashSetting = payload
        },
        getItemStatistics(state, payload) {
            state.itemStatistics = Object.assign({}, payload)
        },
        getTrack(state, payload) {
            state.dashTrack = payload
        },
        getAnalyze(state, payload) {
            state.dashAnalyze = payload
        },
        getTrackProgress(state, payload) {
            state.trackProgress = payload
        },
    },
    actions: {
        getSetting({ commit }, payload) {
            DashboardService.getSetting(payload).then(res => {
                if (res.data.status !== 400) {
                    commit('getDashSetting', res.data.data)
                }
            })
        },
        getItemStatistics({ commit }, payload) {
            DashboardService.getItemStatistics(payload).then(res => {
                if (res.data.status !== 400) {
                    commit('getItemStatistics', res.data.data)
                }
            })
        },
        getTrack({ commit }, payload) {
            DashboardService.getTrack(payload).then(res => {
                if (res.status !== 400) {
                    commit('getTrack', res.data.data)
                }
            })
        },
        getAnalyze({ commit }, payload) {
            DashboardService.getAnalyze(payload).then(res => {
                if (res.status !== 400) {
                    commit('getAnalyze', res.data.data)
                }
            })
        },
        getTrackProgress({ commit }, payload) {
            DashboardService.getTrackProgress(payload).then(res => {
                if (res.status !== 400) {
                    commit('getTrackProgress', res.data.data)
                }
            })
        }
    }
}