import { ItemService } from '../utils/api.service';
export default {
    namespaced: true,
    state: {
        items: []
    },
    getters: {
        items: state => state.items
    },
    mutations: {
        addItem(state, payload) {
            state.items.push(payload)
        },
        getItems(state, payload) {
            state.items = payload
        },
        updateItem(state, payload) {
            const index = state.items.findIndex(item => item.item_id === payload.item_id);
            const keys = Object.keys(payload);
            keys.map(key => {
                if (key != 'item_id') {
                    state.items[index][key] = payload[key];
                }
            });
        },
        removeItem(state, payload) {
            const index = state.items.findIndex(item => item.item_id == payload.item_id)
            state.items.splice(index, 1)
        }
    },
    actions: {
        addItem({ dispatch, commit }, payload) {
            ItemService.addItem(payload).then(res => {
                if (res.data.status !== 400) {
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                    dispatch('okr/getDetail', payload.item_parent_object, { root: true });
                } else {
                    dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
                }
            })
        },
        addItemCallback({ dispatch, commit }, payload) {
            return new Promise((resolve, reject) => {
                ItemService.addItem(payload).then(res => {
                    if (res.data.status !== 400) {
                        dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                        resolve(res.data.data)
                    } else {
                        dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
                        reject()
                    }
                })
            })
        },
        updateItem({ dispatch, commit }, payload) {
            ItemService.updateItem(payload).then(res => {
                if (res.data.status !== 400) {
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                    dispatch('okr/getDetail', payload.item_parent_object, { root: true });
                } else {
                    dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
                }
            })
        },
        removeItemParent({ dispatch, commit }, payload) {
            return new Promise(function (resolve, reject) {
                ItemService.updateItem(payload).then(res => {
                    if (res.data.status !== 400) {
                        dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                        resolve(res.data.message)
                    } else {
                        dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
                        reject(res.data.message)
                    }
                })
            })
        },
        updateItemByField({ dispatch, commit }, payload) {
            ItemService.updateItem(payload).then(res => {
                if (res.data.status !== 400) {
                    commit('updateItem', payload);
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                } else {
                    dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
                }
            })
        },
        getItems({ commit }, payload) {
            ItemService.getItems(payload).then(res => {
                if (res.data.status !== 400) {
                    commit('getItems', res.data.data)
                }
            })
        },
        removeItem({ commit }, payload) {
            ItemService.removeItem(payload).then(res => {
                if (res.data.status !== 400) {
                    commit('removeItem', payload)
                }
            })
        }
    }
}