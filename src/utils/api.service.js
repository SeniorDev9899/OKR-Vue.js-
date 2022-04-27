/* eslint-disable */
import JwtService from "@/utils/jwt.service";
import * as endPoint from "@/config/endpoints";
import axios from "axios";
import Vue from 'vue';
import VueAxios from 'vue-axios';
import store from '@/store'
// import Vuex from 'vuex';
Vue.use(VueAxios, axios);
axios.defaults.headers.common['Authorization'] = "Bearer " + JwtService.getToken();
const checkAuth = (res) => {
    if (res.status === 401) {
        store.dispatch('auth/logout', { root: true });
    }
}
export const OkrService = {
    async createOkr(payload) {
        const res = await axios.post(endPoint.CREATE_OKR_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async getOkrs(payload) {
        const res = await axios.post(endPoint.GET_OKR_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async updateOkr(payload) {
        const res = await axios.post(endPoint.UPDATE_OKR_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async deleteOkr(payload) {
        const res = await axios.post(endPoint.DELETE_OKR_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async getDetail(payload) {
        const res = await axios.get(`${endPoint.OBJECT_DETAILS_URL}/${payload}`)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async getLibrarymenu(payload) {
        const res = await axios.get(endPoint.GET_LIBRARY_MENU_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async getLibrarycontent(payload) {
        const res = await axios.post(endPoint.GET_LIBRARY_CONTENT_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    }
};

// key result CRUD
export const KeyResultService = {
    async createKeyResult(payload) {
        const res = await axios.post(endPoint.CREATE_KEYRESULT_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async getKeyResults() {
        const res = await axios.get(endPoint.GET_KEYRESULT_URL)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async updateKeyResult(payload) {
        const res = await axios.post(endPoint.UPDATE_KEYRESULT_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async deleteKeyResult(payload) {
        const res = await axios.post(endPoint.DELETE_KEYRESULT_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
}

export const AuthService = {
    async signup(payload) {
        const res = await axios.post(endPoint.SIGN_UP_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async login(payload) {
        const res = await axios.post(endPoint.LOGIN_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    }
}

export const DepartmentService = {
    async getDepartments(payload) {
        const res = await axios.post(endPoint.GET_DEPARTMENTS_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async createDepartment(payload) {
        const res = await axios.post(endPoint.ADD_DEPARTMENT_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async removeDepartment(payload) {
        const res = await axios.post(endPoint.DELETE_DEPARTMENTS_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async updateDepartment(payload) {
        const res = await axios.post(endPoint.UPDATE_DEPARTMENTS_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    }
}

export const UserService = {
    async getUsers(payload) {
        const res = await axios.post(endPoint.GET_USERS_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async updateUser(payload) {
        const res = await axios.post(endPoint.UPDATE_USER_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    }
}

export const ProgressService = {
    async getProgress(payload) {
        const res = await axios.post(endPoint.GET_PROGRESS_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async addProgress(payload) {
        const res = await axios.post(endPoint.ADD_PROGRESS_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async updateProgress(payload) {
        const res = await axios.post(endPoint.UPDATE_PROGRESS_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async deleteProgress(payload) {
        const res = await axios.post(endPoint.DELETE_PROGRESS_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    }
}

export const IntercomService = {
    async addIntercom(payload) {
        const res = await axios.post(endPoint.ADD_INTERCOM_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async getIntercom(payload) {
        const res = await axios.post(endPoint.GET_INTERCOM_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async deleteIntercom(payload) {
        const res = await axios.post(endPoint.DELETE_INTERCOM_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async updateIntercom(payload) {
        const res = await axios.post(endPoint.UPDATE_INTERCOM_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    }
}

export const OperatingService = {
    async getOperating(payload) {
        const res = await axios.post(endPoint.GET_OPERATING_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
}

export const SettingService = {
    async createSetting(payload) {
        const res = await axios.post(endPoint.CREATE_SETTING_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async getSetting(payload) {
        const res = await axios.post(endPoint.GET_SETTING_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async updateSetting(payload) {
        const res = await axios.post(endPoint.UPDATE_SETTING_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    }
}

export const ReviewService = {
    async getReview(payload) {
        const res = await axios.post(endPoint.GET_REVIEW_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async addReview(payload) {
        const res = await axios.post(endPoint.ADD_REVIEW_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async updateReview(payload) {
        const res = await axios.post(endPoint.UPDATE_REVIEW_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async deleteProblem(payload) {
        const res = await axios.post(endPoint.DELETE_PROBLEM_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    }
}

export const TaskService = {
    async getTasks(payload) {
        const res = await axios.post(endPoint.GET_TASKS_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async addTask(payload) {
        const res = await axios.post(endPoint.ADD_TASK_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async updateTask(payload) {
        const res = await axios.post(endPoint.UPDATE_TASK_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async getTask(payload) {
        const res = await axios.post(endPoint.GET_TASK_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async deleteTask(payload) {
        const res = await axios.post(endPoint.DELETE_TASK_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    }
}
export const ItemService = {
    async addItem(payload) {
        const res = await axios.post(endPoint.ADD_ITEM_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async updateItem(payload) {
        const res = await axios.post(endPoint.UPDATE_ITEM_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async getItems(payload) {
        const res = await axios.post(endPoint.GET_ITEMS_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async removeItem(payload) {
        const res = await axios.post(endPoint.DELETE_ITEM_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    }
}
export const MilestoneService = {
    async addMilestone(payload) {
        const res = await axios.post(endPoint.ADD_MILESTONE_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async getMilestones(payload) {
        const res = await axios.post(endPoint.GET_MILESTONES_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async updateMilestone(payload) {
        const res = await axios.post(endPoint.UPDATE_MILESTONE_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    }
}
export const WorkingTimeService = {
    async getWorkingTimeByTaskID(payload) {
        const res = await axios.post(endPoint.GET_WORKINGTIME_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async addWorkingTime(payload) {
        const res = await axios.post(endPoint.ADD_WORKINGTIME_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async updateWorkingTime(payload) {
        const res = await axios.post(endPoint.UPDATE_WORKINGTIME_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async deleteWorkingTime(payload) {
        const res = await axios.post(endPoint.DELETE_WORKINGTIME_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    }
}
export const KanbanService = {
    async addKanban(payload) {
        const res = await axios.post(endPoint.ADD_KANBAN_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async getKanbans(payload) {
        const res = await axios.post(endPoint.GET_KANBANS_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async updateKanban(payload) {
        const res = await axios.post(endPoint.UPDATE_KANBAN_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async deleteKanban(payload) {
        const res = await axios.post(endPoint.REMOVE_KANBAN_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    }
}
export const ReportService = {
    async addReport(payload) {
        const res = await axios.post(endPoint.ADD_REPORT_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async getReport(payload) {
        const res = await axios.post(endPoint.GET_REPORT_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async updateReport(payload) {
        const res = await axios.post(endPoint.UPDATE_REPORT_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    }
}
export const FileUploadService = {
    async fileDownload(id) {
        const res = axios.get(endPoint.FILE_DOWNLOAD + "/" + id)
            .catch(err => {
                checkAuth(err.response)
            })
    },
    async fileUpload(payload) {
        const res = await axios.post(endPoint.FILE_UPLOAD, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async deleteFileUploadById(payload) {
        const res = await axios.post(endPoint.DELETE_FILEUPLOAD, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async getFiles() {
        const res = await axios.post(endPoint.GET_FILES, {})
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    }
}
export const DashboardService = {
    async getSetting(payload) {
        const res = await axios.post(endPoint.DASHBOARD_SETTING_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async getItemStatistics(payload) {
        const res = await axios.post(endPoint.ITEM_STATISTICS, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async getTrack(payload) {
        const res = await axios.post(endPoint.DASHBOARD_TRACK_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async getAnalyze(payload) {
        const res = await axios.post(endPoint.DASHBOARD_ANALYZE_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async getTrackProgress(payload) {
        const res = await axios.post(endPoint.DASHBOARD_TRACKPROGRESS_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    }
}

export const LabelService = {
    async getLabels() {
        const res = await axios.post(endPoint.GET_TAGS_URL, {})
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    },
    async addLabel(payload) {
        const res = await axios.post(endPoint.ADD_TAG_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    }
}
export const KrService = {
    async getKeyResults(payload) {
        const res = await axios.post(endPoint.GET_KEYRESULT_URL, payload)
            .catch(err => {
                checkAuth(err.response)
            })
        return res;
    }
}