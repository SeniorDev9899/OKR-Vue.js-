import { UserService, AuthService } from '../utils/api.service';
import { messages } from '@/constants/messages';

export default {
    namespaced: true,
    state: {
        users: []
    },
    getters: {
        users: state => state.users
    },
    mutations: {
        getUsers(state, payload) {
            state.users = payload
        },
        updateUser(state, payload) {
            const keys = Object.keys(payload);
            if (keys.includes('ids')) {
                payload.ids.split(',').map(id => {
                    const index = state.users.findIndex(user => user.id == id)
                    keys.map(key => {
                        if (key != 'ids') {
                            state.users[index][key] = payload[key]
                        }
                    })
                })
            } else {
                const index = state.users.findIndex(user => user.id === payload.id);
                keys.map(key => {
                    if (key != 'id') {
                        state.users[index][key] = payload[key];
                    }
                })
            }
            if (keys.includes('user_attentions')) {
                let currentUser = state.users.filter(user => user.id == payload.id);
                let attentions = payload.user_attentions.split(",");
                let tmp = [];
                attentions.map(id => {
                    tmp.push(parseInt(id));
                })
                let sameUsers = state.users.filter(user => tmp.includes(user.id));
                sameUsers.map(user => {
                    let duplicate = user.user_be_attentions.filter(user => user.id == currentUser[0].id);
                    if (duplicate.length == 0) {
                        user.user_be_attentions.push(currentUser[0])
                    }
                    let index = state.users.findIndex(user1 => user1.id === user.id);
                    state.users[index] = user;
                });
            }
        },
        updateUserVisitCnt(state, payload) {
            const same = state.users.filter(user => user.id == payload.id);
            state.users.forEach(user => {
                if (user.id == same[0].id) {
                    user.user_visit_counts += 1;
                }
            });
        },
        createUser(state, payload) {
            state.users.push(payload)
        }
    },
    actions: {
        getUsers({ rootGetters, commit }, payload = {}) {
            // UserService.getUsers().then(res => {
            //   commit('getUsers', res.data.data)
            // })
            const user = rootGetters['auth/authUser']
            UserService.getUsers({ user_company_id: user.user_company_id, ...payload }).then(res => {
                commit('getUsers', res.data.data)
            })
        },
        getUsersCallBack({ rootGetters, commit }, payload = {}) {
            const user = rootGetters['auth/authUser']
            new Promise((resolve, reject) => {
                UserService.getUsers({ user_company_id: user.user_company_id, ...payload }).then(res => {
                    if (res.status !== 400) {
                        commit('getUsers', res.data.data)
                        resolve();
                    } else {
                        reject();
                    }
                })
            })
        },
        updateUser({ dispatch, commit }, payload) {
            UserService.updateUser(payload).then(res => {
                if (res.status !== 400) {
                    commit('updateUser', payload);
                    const keys = Object.keys(payload);
                    if (!keys.includes('user_recent_items')) {
                        dispatch('app/setNotification', { status: 'success', text: messages.UPDATED_SUCCESSFULLY }, { root: true });
                    }
                } else {
                    dispatch('app/setNotification', { status: 'warning', text: messages.SOMETHING_WENT_WRONG }, { root: true });
                }
            })
        },
        updateUserVisitCnt({ dispatch, commit }, payload) {
            commit('updateUserVisitCnt', payload);
        },
        createUser({ dispatch, commit }, payload) {
            AuthService.signup(payload).then(res => {
                if (res.status === 200) {
                    commit('createUser', res.data.data)
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                }
            })
            .catch(() => {
                dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
            })
        },
            
    }
}