
import { AuthService } from '../utils/api.service';
import JwtService from '@/utils/jwt.service';
import AuthUserService from '@/utils/authUser.service';
import { messages } from '@/constants/messages';
export default {
  namespaced: true,
  state: {
    authUser: AuthUserService.getUser(),
    token: JwtService.getToken() || '',
  },
  getters: {
    isAuthenticated: state => !!state.token,
    authUser: state => state.authUser,
  },
  mutations: {
    setAuth(state, payload) {
      JwtService.saveToken(payload.user_api_token)
      AuthUserService.saveUser(payload)
    },
    logout(state) {
      state.isAuthenticated = false
      state.authUser = null
    },
    updateUserInfo(state, payload) {
      AuthUserService.saveUser({ ...state.authUser, ...payload })
      state.authUser = AuthUserService.getUser()
    }
  },
  actions: {
    signup({ dispatch }, payload) {
      AuthService.signup(payload)
        .then(res => {
          if (res.status === 200) {
            dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
          }
        })
        .catch(() => {
          dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
        })
    },
    updateUserInfo({ commit }, payload) {
      commit('updateUserInfo', payload)
    },
    loginUser({ dispatch, commit }, payload) {
      return new Promise((resolve, reject) => {
        AuthService.login(payload)
          .then(res => {
            if (res.status === 200) {
              commit('setAuth', res.data)
              resolve(res.status)
            } else {
              if (res.data === 'Wrong Password!') {
                dispatch('app/setNotification', { status: 'warning', text: messages.WRONG_PASSWORD }, { root: true });
              } else {
                dispatch('app/setNotification', { status: 'warning', text: messages.INVALID_LOGIN }, { root: true });
              }
            }

          })
          .catch(() => {
            dispatch('app/setNotification', { status: 'warning', text: messages.INVALID_LOGIN }, { root: true });
          })
      })
    },
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        commit('logout')
        JwtService.destroyToken()
        window.location.href = '/'
        resolve()
      })
    },
  }
}