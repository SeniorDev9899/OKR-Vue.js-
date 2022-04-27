import { MilestoneService } from '../utils/api.service';
export default {
  namespaced: true,
  state: {
    milestones: [],
    defaultMilestone: {}
  },
  getters: {
    milestones: state => state.milestones,
    defaultMilestone: state => state.defaultMilestone
  },
  mutations: {
    addMilestone(state, payload) {
      state.milestones.push(payload)
    },
    getMilestones(state, payload) {
      const index = payload.findIndex(ms => ms.ms_id == 0)
      state.defaultMilestone = payload[index]
      payload.splice(index, 1);
      state.milestones = payload
    }
  },
  actions: {
    getMilestones({ dispatch, commit }, payload) {
      MilestoneService.getMilestones(payload).then(res => {
        if (res.data.status !== 400) {
          commit('getMilestones', res.data.data);
        } else {
          // dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
        }
      });
    },
    addMilestone({ dispatch, commit }, payload) {
      MilestoneService.addMilestone(payload).then(res => {
        if (res.data.status !== 400) {
          dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
          commit('addMilestone', res.data.data)
        } else {
          dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
        }
      })
    },
    updateMilestone({ dispatch, commit }, payload) {
      MilestoneService.updateMilestone(payload).then(res => {
        if (res.data.status !== 400) {
          dispatch('milestone/getMilestones', { ms_parent_item: payload.ms_parent_item }, { root: true });
          dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
        } else {
          dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
        }
      })
    },
    updateMilestoneDnd({ dispatch, commit }, payload) {
      return new Promise((resolve, reject) => {
        MilestoneService.updateMilestone(payload).then(res => {
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