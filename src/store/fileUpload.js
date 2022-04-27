import { FileUploadService } from '../utils/api.service';
import { messages } from '@/constants/messages';

export default {
    namespaced: true,
    state: {
        intercomFiles: [],
        progressFiles: [],
        taskFiles: [],
        subTaskFiles: [],
        workingHourFiles: [],
    },
    getters: {
        intercomFiles: state => state.intercomFiles,
        progressFiles: state => state.progressFiles,
        taskFiles: state => state.taskFiles,
        subTaskFiles: state => state.subTaskFiles,
        workingHourFiles: state => state.workingHourFiles,
    },
    mutations: {
        initFiles(state, res) {
            if (res.type == "progress") {
                state.progressFiles = [];
            } else if (res.type == "intercom") {
                state.intercomFiles = [];
            } else if(res.type == "task") {
                state.taskFiles = [];
            } else if(res.type == "subtask") {
                state.subTaskFiles = [];
            } else if(res.type == "workinghour") {
                state.workingHourFiles = [];
            }
        },
        getFiles(state, res) {
            let mode = res.type;
            if(mode == "workinghour") {
                state.workingHourFiles.push(res.value);
            }
        },
        fileUpload(state, res) {
            let type = res.type;
            let value = res.value;
            if (type == "progress") {
                value.forEach((f) => {
                    state.progressFiles.push(f);
                });
            } else if (type == "intercom") {
                value.forEach((f) => {
                    state.intercomFiles.push(f);
                });
            } else if (type == "task") {
                value.forEach((f) => {
                    state.taskFiles.push(f);
                });
            } else if (type == "subtask") {
                value.forEach((f) => {
                    state.subTaskFiles.push(f);
                })
            } else if (type == "workinghour") {
                value.forEach((f) => {
                    state.workingHourFiles.push(f);
                })
            }
        },
        deleteFileUpload(state, res) {
            let type = res.type;
            let id = res.id;
            let certainIndex;
            if (type == "progress") {
                certainIndex = state.progressFiles.findIndex((f) => f.file_id == id);
                state.progressFiles.splice(certainIndex, 1);
            } else if (type == "intercom") {
                certainIndex = state.intercomFiles.findIndex((f) => f.file_id == id);
                state.intercomFiles.splice(certainIndex, 1);
            } else if(type == "task") {
                certainIndex = state.taskFiles.findIndex((f) => f.file_id == id);
                state.taskFiles.splice(certainIndex, 1);
            } else if(type == "subtask") {
                certainIndex = state.subTaskFiles.findIndex((f) => f.file_id == id);
                state.subTaskFiles.splice(certainIndex, 1);
            } else if(type == "workinghour") {
                certainIndex = state.workingHourFiles.findIndex((f) => f.file_id == id);
                state.workingHourFiles.splice(certainIndex, 1);
            }
        }
    },
    actions: {
        initFiles({ dispatch, commit }, payload) {
            commit("initFiles", payload);
        },
        getFiles({ dispatch, commit }, payload) {
            FileUploadService.getFiles(payload.value).then((res) => {
                if (res.status != 400) {
                    commit("getFiles", {type: payload.type, value:res.data.data[0]});
                }
            })
        },
        fileUpload({ dispatch, commit }, payload) {
            let type = payload.type;
            let param = payload.value;
            return FileUploadService.fileUpload(param).then((res) => {
                if (res.status != 400) {
                    commit("fileUpload", { type: type, value: res.data.data });
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                    return "success";
                } else {
                    dispatch('app/setNotification', { status: 'warning', text: messages.SOMETHING_WENT_WRONG }, { root: true });
                }
            })
        },
        filesUpload({ commit }, payload) {
            return new Promise((resolve, reject) => {
                FileUploadService.fileUpload(payload).then(res => {
                    if (res.status != 400) {
                        resolve(res.data.data)
                    } else {
                        reject()
                    }
                })
            })
        },
        fileDownload({ dispatch, commit }, payload) {
            FileUploadService.fileDownload(payload);
        },
        deleteFileUploadById({ dispatch, commit }, payload) {
            let type = payload.type;
            let id = payload.file_id;
            return FileUploadService.deleteFileUploadById({ file_id: id }).then((res) => {
                if (res.status != 400) {
                    commit("deleteFileUpload", { type: type, id: id });
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                    return "success";
                } else {
                    dispatch('app/setNotification', { status: 'warning', text: messages.SOMETHING_WENT_WRONG }, { root: true });
                }
            })
        }
    }
}