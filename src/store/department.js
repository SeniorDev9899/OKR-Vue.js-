import { DepartmentService } from '../utils/api.service';

export default {
  namespaced: true,
  state: {
    departments: [],
    departTree: [],
  },
  getters: {
    departments: state => state.departments,
    departTree: state => state.departTree
  },
  mutations: {
    getDepartments(state, payload) {
      state.departTree = payload
    },
    getAllDepartments(state, payload) {
      state.departments = payload
    },
  },
  actions: {
    getDepartments({ rootGetters, commit }) {
      // DepartmentService.getDepartments().then(res => {
      //   commit('getDepartments', res.data.data)
      // })
      const user = rootGetters['auth/authUser']
      DepartmentService.getDepartments({ id: user.user_company_id }).then(res => {
        commit('getDepartments', res.data.data)
      })
    },
    getAllDepartments({ rootGetters, commit }) {
      const user = rootGetters['auth/authUser']
      DepartmentService.getDepartments({ dp_serial_id: `.${user.user_company_id}%` }).then(res => {
        commit('getAllDepartments', res.data.data)
      })
    },
    addDepartment({ dispatch }, payload) {
      DepartmentService.createDepartment(payload).then(res => {
        if (res.data.data.status !== 400) {
          dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
          dispatch('getDepartments');
        } else {
          dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
        }
      })
    },
    removeDepartment({ dispatch }, payload) {
      DepartmentService.removeDepartment(payload).then(res => {
        if (res.status !== 400) {
          dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
          dispatch('getDepartments');
          dispatch('getAllDepartments');
        } else {
          dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
        }
      })
    },
    updateDepartment({ dispatch }, payload) {
      DepartmentService.updateDepartment(payload).then(res => {
        if (res.status !== 400) {
          dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
          dispatch('getDepartments');
          dispatch('getAllDepartments');
        } else {
          dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
        }
      })
    }
  }
}