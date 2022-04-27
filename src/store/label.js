import { LabelService } from '../utils/api.service';
import { messages } from '@/constants/messages';

export default {
  namespaced: true,
  state: {
    labels: []
  },
  getters: {
    labels: state => state.labels
  },
  mutations: {
    getLabels(state, payload) {
      state.labels = payload
    },
    addLabel(state, payload) {
      state.labels.push(payload)
    }
  },
  actions: {
    getLabels({ commit }) {
      LabelService.getLabels().then(res => {
        if (res.status !== 400) {
          commit('getLabels', res.data.data)
        }
      })
    },
    addLabel({ commit }, payload) {
      LabelService.addLabel(payload).then(res => {
        if (res.status !== 400) {
          commit('addLabel', res.data.data)
        }
      })
    }
  }
}