import { Store } from 'tough-cookie';
import { OkrService, KeyResultService, ProgressService } from '../utils/api.service';
import { messages } from "@/constants/messages";
import { getUser } from '@/utils/authUser.service';
export default {
    namespaced: true,
    state: {
        okrObj: [],
        filteredOkrObj: [],
        OkrObjForAddsort: [],
        pageInfo: {},
        okrDetail: {},
        okrLib: [],
        okrMenu: [],
        loading: false
    },
    getters: {
        okrObj: state => state.okrObj,
        pageInfo: state => state.pageInfo,
        okrDetail: state => state.okrDetail,
        filteredOkrObj: state => state.filteredOkrObj,
        OkrObjForAddsort: state => state.OkrObjForAddsort,
        okrLib: state => state.okrLib,
        okrMenu: state => state.okrMenu,
        loading: state => state.loading
    },
    mutations: {
        addOkr(state, payload) {
            if (JSON.stringify(payload.filter).includes('DESC')) {
                state.okrObj.unshift(payload.data)
            } else {
                state.okrObj.push(payload.data)
            }
        },
        getOkrs(state, obj) {
            state.okrObj = obj.list;
            state.pageInfo = obj.Pages
            state.loading = false
        },
        getFilteredOkrs(state, obj) {
            state.filteredOkrObj = obj.list;
            state.loading = false
        },
        getOkrsForAddsort(state, obj) {
            state.OkrObjForAddsort = obj.list;
            state.loading = false
        },
        getLibrarycontent(state, lib) {
            state.okrLib = lib
        },
        getLibrarymenu(state, menu) {
            state.okrMenu = menu
        },
        updateOkr(state, obj) {
            let objIndex = state.okrObj.findIndex((o => o.ob_id == obj.ob_id));
            delete obj.ob_id;
            for (let key in obj) {
                state.okrObj[objIndex][key] = obj[key];
            }
        },
        deleteOkr(state, obj) {
            let objIndex = state.okrObj.findIndex((o => o.ob_id == obj.ob_id));
            state.okrObj.splice(objIndex, 1);
        },
        // key result mutation
        createKeyResult(state, obj) {
            let objIndex = state.okrObj.findIndex((o => o.ob_id == obj.kr_parent_object));
            state.okrObj[objIndex].ob_results.push(obj);
        },
        getKeyResult(state, obj) {
            let objIndex = state.okrObj.findIndex((o => o.ob_id == obj.ob_id));
            state.okrObj[objIndex].ob_results = obj.ob_results;
        },
        updateKeyResult(state, obj) {
            let objIndex = state.okrObj.findIndex((o => o.ob_id == obj.kr_parent_object));
            let krIndex = state.okrObj[objIndex].ob_results.findIndex((o => o.kr_id == obj.kr_id));
            for (let key in obj) {
                state.okrObj[objIndex].ob_results[krIndex][key] = obj[key];
            }
        },
        deleteKeyResult(state, obj) {
            let objIndex = state.okrObj.findIndex((o => o.ob_id == obj.kr_parent_object));
            let krIndex = state.okrObj[objIndex].ob_results.findIndex((o => o.kr_id == obj.kr_id));
            state.okrObj[objIndex].ob_results.splice(krIndex, 1);
            let tmp = state.okrObj[objIndex].ob_results;
            state.okrObj[objIndex].ob_results = [];
            tmp.map((kr, ind) => {
                kr.kr_order = ind + 1;
                state.okrObj[objIndex].ob_results.push(kr)
            });
        },
        getDetail(state, payload) {
            state.okrDetail = payload
        },
        setLoading(state, payload) {
            state.loading = payload
        }
    },
    actions: {
        addOkr({ dispatch, commit, rootGetters }, obj) {
            const filter = rootGetters['app/okrFilter'];
            OkrService.createOkr(obj).then(res => {
                if (res.data.status !== 400) {
                    if (filter.ob_cycle == obj.ob_cycle) {
                        commit('addOkr', { data: res.data.data, filter: filter });
                    }
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                } else {
                    dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
                }
            })
        },
        getOkrs({ commit, rootGetters }, { payload = {} }) {
            const filter = rootGetters['app/okrFilter'];
            commit('setLoading', true)
            OkrService.getOkrs({ reqObj: { ob_company_id: getUser().user_company_id, ...filter }, Pages: payload }).then(res => {
                if (res.data.status !== 400) {
                    commit('getOkrs', res.data.data);
                    commit('setLoading', false)
                } else { }
            })
        },
        updateOkrAndGet({ dispatch }, payload) {
            OkrService.updateOkr(payload).then(res => {
                if (res.status == 200) {
                    dispatch('okr/getOkrs', {}, { root: true});
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                } else {
                    dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
                }
            })
        },
        getFilteredOkrs({ commit }, { payload = {}, filter = {} }) {
            commit('setLoading', true)
            OkrService.getOkrs({ reqObj: { ob_company_id: getUser().user_company_id, ...filter }, Pages: payload }).then(res => {
                if (res.data.status !== 400) {
                    commit('getFilteredOkrs', res.data.data);
                    commit('setLoading', false)
                } else { }
            })
        },
        getOkrsForAddsort({ commit }, { payload = {}, filter = {} }) {
            OkrService.getOkrs({ reqObj: { ob_company_id: getUser().user_company_id, ...filter }, Pages: payload }).then(res => {
                if (res.data.status !== 400) {
                    commit('getOkrsForAddsort', res.data.data);
                } else { }
            })
        },
        getLibrarycontent({ commit }, ob_id) {
            OkrService.getLibrarycontent(ob_id).then(res => {
                if (res.data.status !== 400) {
                    commit("getLibrarycontent", res.data.data);
                }
            })
        },
        getLibrarymenu({ commit }) {
            OkrService.getLibrarymenu().then(res => {
                if (res.data.status !== 400) {
                    commit("getLibrarymenu", res.data.data);
                }
            })
        },

        getLibrarycontent({ commit }, ob_id) {
            OkrService.getLibrarycontent(ob_id).then(res => {
                if (res.data.status !== 400) {
                    commit("getLibrarycontent", res.data.data);
                }
            })
        },
        getLibrarymenu({ commit }) {
            OkrService.getLibrarymenu().then(res => {
                if (res.data.status !== 400) {
                    commit("getLibrarymenu", res.data.data);
                }
            })
        },
        updateOkr({ dispatch, commit }, obj) {
            OkrService.updateOkr(obj).then(res => {
                if (res.status == 200) {
                    commit('updateOkr', obj);
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                } else {
                    dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
                }
            })
        },
        deleteOkr({ dispatch, commit }, obj) {
            OkrService.deleteOkr(obj).then(res => {
                if (res.status == 200) {
                    commit('deleteOkr', obj);
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                } else {
                    dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
                }
            })
        },
        // key result CRUD
        createKeyResult({ dispatch, commit }, obj) {
            KeyResultService.createKeyResult(obj).then(res => {
                if (res.status == 200) {
                    commit('createKeyResult', res.data.data)
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                } else {
                    dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
                }
            })
        },
        getKeyResult({ commit }, ob_id) {
            KeyResultService.getKeyResults(ob_id).then(res => {
                if (res.status == 200) {
                    commit("getKeyResult", res.data.data);
                }
            })
        },
        updateKeyResult({ dispatch, commit }, payload) {
            KeyResultService.updateKeyResult(payload.obj).then(res => {
                if (res.status == 200) {
                    commit('updateKeyResult', payload.kr)
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                } else {
                    dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
                }
            })
        },
        updateKeyResultByRating({ dispatch, commit }, obj) {
            let payload = {
                kr_id: obj.kr_id,
                kr_confidence: obj.kr_confidence
            }
            KeyResultService.updateKeyResult(payload).then(res => {
                if (res.status == 200) {
                    commit('updateKeyResult', obj)
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                } else {
                    dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
                }
            })
        },
        deleteKeyResult({ dispatch, commit }, obj) {
            KeyResultService.deleteKeyResult({ kr_id: obj.kr_id }).then(res => {
                if (res.status !== 400) {
                    commit('deleteKeyResult', obj)
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                } else {
                    dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
                }
            })
        },
        getDetail({ commit }, payload) {
            OkrService.getDetail(payload).then(res => {
                if (res.status == 200) {
                    commit('getDetail', res.data.data)
                }
            })
        }
    }
}