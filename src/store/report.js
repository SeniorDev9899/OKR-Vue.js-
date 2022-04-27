import { ReportService } from '../utils/api.service';
import { messages } from '@/constants/messages';

export default {
    namespaced: true,
    state: {
        dailyReport: null,
        weeklyReport: null,
        monthlyReport: null,
        allDailyReports: [],
        allWeeklyReports: [],
        allMonthlyReports: [],
    },
    getters: {
        dailyReport: state => state.dailyReport,
        allDailyReport: state => state.allDailyReports,
        weeklyReport: state => state.weeklyReport,
        allWeeklyReport: state => state.allWeeklyReports,
        monthlyReport: state => state.monthlyReport,
        allMonthlyReport: state => state.allMonthlyReports,
    },
    mutations: {
        addDailyReport(state, re) {
            state.dailyReport = re;
        },
        addWeeklyReport(state, re) {
            state.weeklyReport = re;
        },
        addMonthlyReport(state, re) {
            state.monthlyReport = re;
        },
        getDailyReport(state, re) {
            state.dailyReport = re;
        },
        getWeeklyReport(state, re) {
            state.weeklyReport = re;
        },
        getMonthlyReport(state, re) {
            state.monthlyReport = re;
        },
        getAllDailyReportWithCreator(state, re) {
            state.allDailyReports = re;
        },
        getAllWeeklyReportWithCreator(state, re) {
            state.allWeeklyReports = re;
        },
        getAllMonthlyReportWithCreator(state, re) {
            state.allMonthlyReports = re;
        },
        updateDailyReport(state, re) {
            let keys = Object.keys(re);
            keys.map((key) => state.dailyReport[`${key}`] = re[`${key}`]);
        },
        updateWeeklyReport(state, re) {
            let keys = Object.keys(re);
            keys.map((key) => state.weeklyReport[`${key}`] = re[`${key}`]);
        },
        updateMonthlyReport(state, re) {
            let keys = Object.keys(re);
            keys.map((key) => state.monthlyReport[`${key}`] = re[`${key}`]);
        }
    },
    actions: {
        addDailyReport({ dispatch, commit }, payload) {
            ReportService.addReport(payload).then((res) => {
                if(res.status != 400)
                {
                    commit("addDailyReport", res.data.data);
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                } else {
                    dispatch('app/setNotification', { status: 'warning', text:messages. SOMETHING_WENT_WRONG}, { root: true });
                }
            })
        },
        addWeeklyReport({ dispatch, commit }, payload) {
            ReportService.addReport(payload).then((res) => {
                if(res.status != 400)
                {
                    commit("addWeeklyReport", res.data.data);
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                } else {
                    dispatch('app/setNotification', { status: 'warning', text:messages. SOMETHING_WENT_WRONG}, { root: true });
                }
            })
        },
        addMonthlyReport({ dispatch, commit }, payload) {
            ReportService.addReport(payload).then((res) => {
                if(res.status != 400)
                {
                    commit("addMonthlyReport", res.data.data);
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                } else {
                    dispatch('app/setNotification', { status: 'warning', text:messages. SOMETHING_WENT_WRONG}, { root: true });
                }
            })
        },
        getDailyReport({ dispatch, commit }, payload) {
            ReportService.getReport(payload).then((res) => {
                if(res.status != 400)
                {
                    commit("getDailyReport", res.data.data[res.data.data.length - 1]);
                }
            })
        },
        getWeeklyReport({ dispatch, commit }, payload) {
            ReportService.getReport(payload).then((res) => {
                if(res.status != 400)
                {
                    commit("getWeeklyReport", res.data.data[res.data.data.length - 1]);
                }
            })
        },
        getAllDailyReportWithCreator({ dispatch, commit }, payload) {
            ReportService.getReport(payload).then((res) => {
                if(res.status != 400)
                {
                    commit("getAllDailyReportWithCreator", res.data.data);
                }
            })
        },
        getAllWeeklyReportWithCreator({ dispatch, commit }, payload) {
            ReportService.getReport(payload).then((res) => {
                if(res.status != 400)
                {
                    commit("getAllWeeklyReportWithCreator", res.data.data);
                }
            })
        },
        getMonthlyReport({ dispatch, commit }, payload) {
            ReportService.getReport(payload).then((res) => {
                if(res.status != 400)
                {
                    commit("getMonthlyReport", res.data.data[res.data.data.length - 1]);
                }
            })
        },
        getAllMonthlyReportWithCreator({ dispatch, commit }, payload) {
            ReportService.getReport(payload).then((res) => {
                if(res.status != 400)
                {
                    commit("getAllMonthlyReportWithCreator", res.data.data);
                }
            });
        },
        updateDailyReport({ dispatch, commit }, payload) {
            ReportService.updateReport(payload).then((res) => {
                if(res.status != 400)
                {
                    commit("updateDailyReport", payload);
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                } else {
                    dispatch('app/setNotification', { status: 'warning', text:messages. SOMETHING_WENT_WRONG}, { root: true });
                }
            })
        },
        updateWeeklyReport({ dispatch, commit }, payload) {
            ReportService.updateReport(payload).then((res) => {
                if(res.status != 400)
                {
                    commit("updateWeeklyReport", payload);
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                } else {
                    dispatch('app/setNotification', { status: 'warning', text:messages. SOMETHING_WENT_WRONG}, { root: true });
                }
            })
        },
        updateMonthlyReport({ dispatch, commit }, payload) {
            ReportService.updateReport(payload).then((res) => {
                if(res.status != 400)
                {
                    commit("updateMonthlyReport", payload);
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                } else {
                    dispatch('app/setNotification', { status: 'warning', text:messages. SOMETHING_WENT_WRONG}, { root: true });
                }
            })
        }
    }
}