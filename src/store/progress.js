import { ProgressService } from '../utils/api.service';
import { messages } from '@/constants/messages';

export default {
    namespaced: true,
    state: {
        keyresultNumber: null,
        progress: [],
        objectProgress: [],
        taskProgress: [],
        progressDescriptions: [],
        proObjectList: [],
        itemProgress: []
    },
    getters: {
        progress: state => state.progress,
        taskProgress: state => state.taskProgress,
        proObjectList: state => state.proObjectList,
        itemProgress: state => state.itemProgress,
        objectProgress: state => state.objectProgress,
    },
    mutations: {
        getProgress(state, prg) {
            // state.objectProgress = prg.filter(e => e.pr_parent_type == 0);
            state.progress = prg.filter(e => e.pr_parent_type == 1);
            state.taskProgress = prg.filter(e => e.pr_parent_type == 2);
            state.itemProgress = prg.filter(e => e.pr_parent_type == 3);
        },
        getObjectProgress(state, payload) {
            state.objectProgress = payload
        },
        getProObject(state, prg) {
            prg.reverse();
            let proObject;
            if (prg.length != 0) {
                proObject = {
                    keyresult_id: prg[0].pr_parent,
                    progressList: prg
                }
            } else {
                proObject = {
                    keyresult_id: null,
                    progressList: null
                }
            }
            state.proObjectList.push(proObject);
        },
        addProgress(state, prg) {
            if (prg.pr_parent_type == 0) {
                state.objectProgress.unshift(prg);
            } else if (prg.pr_parent_type == 1) {
                state.progress.unshift(prg);
            } else if (prg.pr_parent_type == 2) {
                state.taskProgress.unshift(prg);
            }
        },
        updateProgress(state, prg) {
            let prId = prg.pr_id;
            let PrParent = prg.pr_parent;
            let type = prg.pr_parent_type;
            let certainIndex;
            if (type == 1) {
                certainIndex = state.progress.findIndex((e) => e.pr_id == prId && e.pr_parent == PrParent);
                if (certainIndex != -1) {
                    state.progress[certainIndex].pr_creator = prg.pr_creator;
                    state.progress[certainIndex].pr_parent_type = prg.pr_parent_type;
                    state.progress[certainIndex].pr_percent = prg.pr_percent;
                    state.progress[certainIndex].pr_status = prg.pr_status;
                    state.progress[certainIndex].pr_description = prg.pr_description;
                }
            } else if (type == 2) {
                certainIndex = state.taskProgress.findIndex((e) => e.pr_id == prId && e.pr_parent == PrParent);
                if (certainIndex != -1) {
                    state.taskProgress[certainIndex].pr_creator = prg.pr_creator;
                    state.taskProgress[certainIndex].pr_parent_type = prg.pr_parent_type;
                    state.taskProgress[certainIndex].pr_percent = prg.pr_percent;
                    state.taskProgress[certainIndex].pr_status = prg.pr_status;
                    state.taskProgress[certainIndex].pr_description = prg.pr_description;
                }
            }
        },
        deleteProgress(state, payload) {
            let prId = payload.pr_id;
            let type = payload.pr_parent_type;
            let certainIndex;
            if (type == 1) {
                certainIndex = state.progress.findIndex((e) => e.pr_id == prId);
                if (certainIndex != -1) {
                    state.progress.splice(certainIndex, 1);
                }
            } else if (type == 2) {
                certainIndex = state.taskProgress.findIndex((e) => e.pr_id == prId);
                if (certainIndex != -1) {
                    state.taskProgress.splice(certainIndex, 1);
                }
            }
        }
    },
    actions: {
        getProgress({ commit }, payload) {
            return ProgressService.getProgress(payload).then((res) => {
                if (res.status == 200) {
                    commit("getProgress", res.data.data);
                    return "success";
                } else { }
            });
        },
        getObjectProgress({ commit }, payload) {
            return ProgressService.getProgress({pr_parent_type: 0, ...payload}).then(res => {
                if(res.status == 200) {
                    commit('getObjectProgress', res.data.data);
                    return "success";
                } else {}
            })
        },
        getProObject({ commit }, payload) {
            return ProgressService.getProgress(payload).then((res) => {
                if (res.status == 200) {
                    commit("getProObject", res.data.data);
                    return "success";
                }
            });
        },
        addProgress({ dispatch, commit }, payload) {
            return ProgressService.addProgress(payload).then((res) => {
                if (res.status == 200) {
                    commit("addProgress", res.data.data);
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                    return res.data.data;
                } else {
                    dispatch('app/setNotification', { status: 'warning', text: messages.SOMETHING_WENT_WRONG }, { root: true });
                }
            });
        },
        addProgressCallback({ commit }, payload) {
            return new Promise((resolve, reject) => {
                ProgressService.addProgress(payload).then(res => {
                    if (res.status !== 400) {
                        resolve()
                    } else {
                        reject()
                    }
                })
            })
        },
        updateProgress({ dispatch, commit }, payload) {
            ProgressService.updateProgress(payload).then((res) => {
                if (res.status == 200) {
                    commit("updateProgress", payload);
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                } else {
                    dispatch('app/setNotification', { status: 'warning', text: messages.SOMETHING_WENT_WRONG }, { root: true });
                }
            })
        },
        deleteProgress({ dispatch, commit }, payload) {
            ProgressService.deleteProgress(payload).then((res) => {
                if (res.status == 200) {
                    commit("deleteProgress", payload);
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                } else {
                    dispatch('app/setNotification', { status: 'warning', text: messages.SOMETHING_WENT_WRONG }, { root: true });
                }
            })
        }
    }
}