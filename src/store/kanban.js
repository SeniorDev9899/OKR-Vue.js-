import { KanbanService } from '../utils/api.service';
export default {
  namespaced: true,
  state: {
    kanbans: [],
    defaultKanban: {}
  },
  getters: {
    kanbans: state => state.kanbans,
    defaultKanban: state => state.defaultKanban
  },
  mutations: {
    addKanban(state, payload) {
      state.kanbans.push(payload)
    },
    getKanbans(state, payload) {
      const index = payload.findIndex(kb => kb.kb_id == 0)
      state.defaultKanban = payload[index]
      payload.splice(index, 1);
      state.kanbans = payload
    },
    removeKanban(state, payload) {
      const index = state.kanbans.findIndex(kanban => kanban.kb_id == payload.kb_id)
      state.kanbans.splice(index, 1)
    }
  },
  actions: {
    getKanbans({ dispatch, commit }, payload) {
      KanbanService.getKanbans(payload).then(res => {
        if (res.data.status !== 400) {
          commit('getKanbans', res.data.data);
        } else {
          // dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
        }
      });
    },
    addKanban({ dispatch, commit }, payload) {
      KanbanService.addKanban(payload).then(res => {
        if (res.data.status !== 400) {
          dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
          commit('addKanban', res.data.data)
        } else {
          dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
        }
      })
    },
    updateKanban({ dispatch, commit }, payload) {
      KanbanService.updateKanban(payload).then(res => {
        if (res.data.status !== 400) {
          dispatch('kanban/getKanbans', { kb_parent_item: payload.kb_parent_item }, { root: true });
          dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
        } else {
          dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
        }
      })
    },
    removeKanban({ dispatch, commit }, payload) {
      KanbanService.deleteKanban(payload).then(res => {
        if (res.data.status !== 400) {
          dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
          commit('removeKanban', payload)
        } else {
          dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
        }
      })
    },
    updateKanbanDnd({ dispatch, commit }, payload) {
      return new Promise((resolve, reject) => {
        KanbanService.updateKanban(payload).then(res => {
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
  }
}