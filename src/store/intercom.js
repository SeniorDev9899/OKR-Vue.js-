import { IntercomService } from '../utils/api.service';
import { messages } from "@/constants/messages";

export default {
    namespaced: true,
    state: {
        intercom: [],
        objectIntercom: [],
        taskIntercom: [],
        reportIntercom: [],
        itemIntercom: [],
        userIntercom: [],
        parentIntercom: null,
    },
    getters: {
        intercom: state => state.intercom,
        objectIntercom: state => state.objectIntercom,
        taskIntercom: state => state.taskIntercom,
        reportIntercom: state => state.reportIntercom,
        itemIntercom: state => state.itemIntercom,
        parentIntercom: state => state.parentIntercom,
        userIntercom: state => state.userIntercom,
    },
    mutations: {
        addIntercom(state, ic) {
            if (ic.ic_parent_type == 0) {
                state.objectIntercom.push(ic);
            } else if (ic.ic_parent_type == 1) {
                state.intercom.push(ic);
            } else if (ic.ic_parent_type == 2) {
                state.taskIntercom.push(ic);
            } else if (ic.ic_parent_type == 4) {
                state.reportIntercom.push(ic);
            } else if(ic.ic_parent_type == 10) {
                state.userIntercom.push(ic);
            }
        },
        getIntercom(state, ics) {
            state.intercom = ics.filter(e => e.ic_parent_type == 1);
            state.objectIntercom = ics.filter(e => e.ic_parent_type == 0);
            state.taskIntercom = ics.filter(e => e.ic_parent_type == 2);
            state.reportIntercom = ics.filter(e => e.ic_parent_type == 4);
            state.itemIntercom = ics.filter(e => e.ic_parent_type == 3);
            state.userIntercom = ics.filter(e => e.ic_parent_type == 10);
        },
        getIntercomOne(state, ic) {
            state.parentIntercom = ic;
        },
        deleteIntercom(state, payload) {
            let icId = payload.ic_id;
            let type = payload.ic_parent_type;
            let certainIndex;
            if (type == 0) {
                certainIndex = state.objectIntercom.findIndex((e) => e.ic_id == icId);
                if (certainIndex != -1) {
                    state.objectIntercom.splice(certainIndex, 1);
                }
            } else if (type == 1) {
                certainIndex = state.intercom.findIndex((e) => e.ic_id == icId);
                if (certainIndex != -1) {
                    state.intercom.splice(certainIndex, 1);
                }
            } else if (type == 2) {
                certainIndex = state.taskIntercom.findIndex((e) => e.ic_id == icId);
                if (certainIndex != -1) {
                    state.taskIntercom.splice(certainIndex, 1);
                }
            } else if (type == 4) {
                certainIndex = state.reportIntercom.findIndex((e) => e.ic_id == icId);
                if (certainIndex != -1) {
                    state.reportIntercom.splice(certainIndex, 1);
                }
            } else if(type == 10) {
                certainIndex = state.userIntercom.findIndex((e) => e.ic_id == icId);
                if (certainIndex != -1) {
                    state.userIntercom.splice(certainIndex, 1);
                }
            }
        },
        updateIntercom(state, payload) {
            let icId = payload.ic_id;
            let type = payload.ic_parent_type;
            let certainIndex;
            if (type == 0) {
                certainIndex = state.objectIntercom.findIndex((e) => e.ic_id == icId);
                if (certainIndex != -1) {
                    state.objectIntercom[certainIndex].ic_thumbup = payload.ic_thumbup;
                }
            } else if (type == 1) {
                certainIndex = state.intercom.findIndex((e) => e.ic_id == icId);
                if (certainIndex != -1) {
                    state.intercom[certainIndex].ic_thumbup = payload.ic_thumbup;
                }
            } else if (type == 2) {
                certainIndex = state.taskIntercom.findIndex((e) => e.ic_id == icId);
                if (certainIndex != -1) {
                    state.taskIntercom[certainIndex].ic_thumbup = payload.ic_thumbup;
                }
            } else if (type == 4) {
                certainIndex = state.reportIntercom.findIndex((e) => e.ic_id == icId);
                if (certainIndex != -1) {
                    state.reportIntercom[certainIndex].ic_thumbup = payload.ic_thumbup;
                }
            } else if(type == 10) {
                certainIndex = state.userIntercom.findIndex((e) => e.ic_id == icId);
                if (certainIndex != -1) {
                    state.userIntercom[certainIndex].ic_thumbup = payload.ic_thumbup;
                }
            }
        }
    },
    actions: {
        addIntercom({ dispatch, commit }, payload) {
            return IntercomService.addIntercom(payload).then((res) => {
                if (res.status == 200) {
                    commit("addIntercom", res.data.data);
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                    return "success";
                } else {
                    dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
                }
            })
        },
        getIntercom({ dispatch, commit }, payload) {
            return IntercomService.getIntercom(payload).then((res) => {
                if (res.status == 200) {
                    commit("getIntercom", res.data.data);
                    return "success";
                }
            })
        },
        getIntercomOne({ dispatch, commit }, payload) {
            return IntercomService.getIntercom(payload).then((res) => {
                if(res.status == 200) {
                    commit("getIntercomOne", res.data.data[0]);
                    return "success";
                }
            })
        },
        deleteIntercom({ dispatch, commit }, payload) {
            return IntercomService.deleteIntercom(payload).then((res) => {
                if (res.status == 200) {
                    commit("deleteIntercom", payload);
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                    return "success";
                } else {
                    dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
                    return "Error";
                }
            })
        },
        updateIntercom({ dispatch, commit }, payload) {
            return IntercomService.updateIntercom(payload).then((res) => {
                if (res.status == 200) {
                    commit("updateIntercom", payload);
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                    return "success";
                } else {
                    dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
                    return "Error";
                }
            })
        }
    }
}