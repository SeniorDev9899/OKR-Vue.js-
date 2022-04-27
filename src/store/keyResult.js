import { KrService } from '../utils/api.service';
import { messages } from '@/constants/messages';

export default {
  namespaced: true,
  state: {
    keyResults: []
  },
  getters: {
    keyResults: state => state.keyResults
  },
  mutations: {
    getKeyResults(state, payload) {
      state.keyResults = payload
    }
  },
  actions: {
    getKeyResults({ commit }, payload) {
      KrService.getKeyResults(payload).then(res => {
        if (res.status !== 400) {
          commit('getKeyResults', res.data.data)
        }
      })
    }
  }
}