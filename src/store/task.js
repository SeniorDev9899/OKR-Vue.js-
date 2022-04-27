import { TaskService } from '../utils/api.service';
export default {
    namespaced: true,
    state: {
        tasks: [],
        task: null,
    },
    getters: {
        tasks: state => state.tasks,
        task: state => state.task,
    },
    mutations: {
        addTask(state, payload) {
            state.tasks.push(payload)
        },
        addSubTask(state, payload) {
            if (state.task.task_tasks.length != 0) {
                state.task.task_tasks.push(payload);
            } else {
                state.task.task_tasks = [];
                state.task.task_tasks.push(payload);
            }
        },
        getTasks(state, payload) {
            state.tasks = payload;
        },
        getTaskById(state, payload) {
            state.task = payload;
        },
        updateTaskOne(state, payload) {
            let keys = Object.keys(payload);
            keys.forEach((key) => state.task[key] = payload[key]);
        },
        updateTask(state, payload) {
            let taskIndex = state.tasks.findIndex((t => t.task_id == payload.task_id));
            delete payload.task_id;
            Object.keys(payload).map(function(key, index) {
                state.tasks[taskIndex][key] = payload[key];
            });
        },
        deleteTaskOne(state, payload) {
            let index = state.tasks.findIndex((task) => task.task_id == payload.task_id);
            state.tasks.splice(index, 1);
        },
        deleteSubTask(state, payload) {
            let subTaskId = payload.task_id;
            if (state.task.task_tasks.length != 0) {
                let index = state.task.task_tasks.findIndex((t) => t.task_id == subTaskId);
                state.task.task_tasks.splice(index, 1);
            }
        }
    },
    actions: {
        getTasks({ dispatch, commit }, payload) {
            TaskService.getTasks(payload).then(res => {
                if (res.data.status !== 400) {
                    commit('getTasks', res.data.data);
                } else {
                    // dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
                }
            });
        },
        getTaskById({ dispatch, commit }, payload) {
            return TaskService.getTasks(payload).then((res) => {
                if (res.data.status != 400) {
                    commit('getTaskById', res.data.data[0]);
                    return "success";
                } else {

                }
            });
        },
        addSubTask({ dispatch, commit }, payload) {
            TaskService.addTask(payload).then(res => {
                if (res.data.status !== 400) {
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                    if (!!payload.task_parent_object) {
                        dispatch('okr/getDetail', payload.task_parent_object, { root: true });
                    }
                    commit('addSubTask', res.data.data)
                    return res.data.data
                } else {
                    dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
                    return "failed"
                }
            })
        },
        addTask({ dispatch, commit }, payload) {
            TaskService.addTask(payload).then(res => {
                if (res.data.status !== 400) {
                    // commit('addTask', res.data.data);
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                    if (!!payload.task_parent_object) {
                        dispatch('okr/getDetail', payload.task_parent_object, { root: true });
                    }
                    commit('addTask', res.data.data)
                    return res.data.data
                } else {
                    dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
                    return "failed"
                }
            })
        },
        addChildTask({ dispatch, commit }, payload) {
            TaskService.addTask(payload).then(res => {
                if (res.data.status !== 400) {
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                    return res.data.data
                } else {
                    dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
                    return "failed"
                }
            })
        },
        addTaskForMilestone({ dispatch, commit }, payload) {
            return new Promise((resolve, reject) => {
                TaskService.addTask(payload).then(res => {
                    if (res.data.status !== 400) {
                        dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                        resolve(res.data.data)
                    } else {
                        dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
                        reject(res.data.status)
                    }

                })
            })
        },
        updateTaskOne({ dispatch, commit }, payload) {
            return TaskService.updateTask(payload).then(res => {
                if (res.data.status != 400) {
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                    if (!!payload.task_parent_object) {
                        dispatch('okr/getDetail', payload.task_parent_object, { root: true });
                    }
                    commit('updateTaskOne', payload);
                    return 'success';
                }
            })
        },
        updateTask({ dispatch, commit }, payload) {
            TaskService.updateTask(payload).then(res => {
                if (res.data.status !== 400) {
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                    commit('updateTask', payload)
                } else {
                    dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
                }
            })
        },
        deleteTaskOne({ dispatch, commit }, payload) {
            TaskService.deleteTask(payload).then(res => {
                if (res.data.staus != 400) {
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                    commit('deleteTaskOne', payload)
                } else {
                    dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
                }
            })
        },
        deleteSubTask({ dispatch, commit }, payload) {
            TaskService.deleteTask(payload).then((res) => {
                if (res.data.status != 400) {
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                    commit("deleteSubTask", payload);
                } else {
                    dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
                }
            })
        },
        removeTaskParent({ dispatch, commit }, payload) {
            return new Promise((resolve, reject) => {
                TaskService.updateTask(payload).then(res => {
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
        updateTaskDetail({ dispatch }, payload) {
            TaskService.updateTask(payload).then(res => {
                if (res.data.status !== 400) {
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                    dispatch('okr/getDetail', payload.task_parent_object, { root: true });
                } else {
                    dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
                }
            })
        },
        updateTaskForMilestone({ dispatch, commit }, payload) {
            TaskService.updateTask(payload).then(res => {
                if (res.data.status !== 400) {
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                    dispatch('milestone/getMilestones', { ms_parent_item: payload.task_parent_item }, { root: true });
                    dispatch('kanban/getKanbans', { kb_parent_item: payload.task_parent_item }, { root: true });
                } else {
                    dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
                }
            })
        },
        updateTaskByField({ dispatch, commit }, payload) {
            TaskService.updateTask(payload).then(res => {
                if (res.data.status !== 400) {
                    commit('updateTask', payload);
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                } else {
                    dispatch('app/setNotification', { status: 'warning', text: res.data.message }, { root: true });
                }
            });
        }
    }
}