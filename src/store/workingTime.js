import { WorkingTimeService } from '../utils/api.service';
import { messages } from '@/constants/messages';

export default {
    namespaced: true,
    state: {
        workingTime: [],
    },
    getters: {
        workingTimeList: state => state.workingTime,
    },
    mutations: {
        getWorkingTime(state, wt) {
            state.workingTime = wt;
        },
        addWorkingTime(state, wt) {
            state.workingTime.push(wt);
        },
        updateWorkingTime(state, wt) {
            let certainIndex = state.workingTime.findIndex((w) => w.wt_id == wt.wt_id);
            let keys = Object.keys(wt);
            keys.forEach((key) => state.workingTime[certainIndex][key] = wt[key]);
        },
        deleteWorkingTime(state, wt) {
            let certainIndex = state.workingTime.findIndex((w) => w.wt_id == wt.wt_id);
            state.workingTime.splice(certainIndex, 1);
        }
    },
    actions: {
        getWorkingTimeByTaskID({ dispatch, commit }, payload) {
            WorkingTimeService.getWorkingTimeByTaskID(payload).then((res) => {
                if(res.status != 400)
                {
                    commit("getWorkingTime", res.data.data);
                }
            })
        },
        addWorkingTime({ dispatch, commit }, payload) {
            WorkingTimeService.addWorkingTime(payload).then((res) => {
                if(res.status != 400)
                {
                    commit("addWorkingTime", res.data.data);
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                }
            })
        },
        updateWorkingTime({ dispatch, commit }, payload) {
            WorkingTimeService.updateWorkingTime(payload).then((res) => {
                if(res.status != 400) {
                    commit("updateWorkingTime", payload);
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                } else {
                    dispatch('app/setNotification', { status: 'warning', text: messages.SOMETHING_WENT_WRONG }, { root: true });
                }
            })
        },
        deleteWorkingTime({ dispatch, commit }, payload) {
            WorkingTimeService.deleteWorkingTime(payload).then((res) => {
                if(res.status != 400)
                {
                    commit("deleteWorkingTime", payload);
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                } else {
                    dispatch('app/setNotification', { status: 'warning', text: messages.SOMETHING_WENT_WRONG }, { root: true });
                }
            })
        }
    }
}