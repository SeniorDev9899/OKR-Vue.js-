import { ReviewService } from '../utils/api.service';
import { messages } from "@/constants/messages";

export default {
    namespaced: true,
    state: {
        review: [],
        objectReview: [],
    },
    getters: {
        review: state => state.review,
        objectReview: state => state.objectReview,
    },
    mutations: {
        initReview(state, pay) {
            let mode = pay.mode;
            if(mode == "kr") {
                state.review = [];
            } else if(mode == "ob") {
                state.objectReview = [];
            }
        },
        getReview(state, rew) {
            rew.forEach((item) => {
                if(item.re_parent_type == 0) {
                    state.objectReview.push(item);
                } else if(item.re_parent_type == 1) {
                    state.review.push(item);
                }
            })
        },
        addReview(state, rew) {
            if(rew.re_parent_type == 0) {
                state.objectReview.push(rew);
            } else if(rew.re_parent_type == 1) {
                state.review.push(rew);
            }
        },
        updateReview(state, rew) {
            if(rew.re_parent_type == 0) {
                let certainIndex = state.objectReview.findIndex((e) => e.re_id == rew.re_id);
                if(certainIndex != -1)
                {
                    state.objectReview[certainIndex].re_description = rew.re_parent;
                    state.objectReview[certainIndex].re_parent_type = rew.re_parent_type;
                    state.objectReview[certainIndex].re_description = rew.re_description;
                    state.objectReview[certainIndex].re_problem = rew.re_problem;
                    state.objectReview[certainIndex].re_tasks = rew.re_tasks;
                    state.objectReview[certainIndex].re_collaborators = rew.re_collaborators;
                    state.objectReview[certainIndex].re_problems = rew.re_problems;
                    state.objectReview[certainIndex].created_at = rew.created_at;
                }
            } else if(rew.re_parent_type == 1) {
                let certainIndex = state.review.findIndex((e) => e.re_id == rew.re_id);
                if(certainIndex != -1)
                {
                    state.review[certainIndex].re_description = rew.re_parent;
                    state.review[certainIndex].re_parent_type = rew.re_parent_type;
                    state.review[certainIndex].re_description = rew.re_description;
                    state.review[certainIndex].re_problem = rew.re_problem;
                    state.review[certainIndex].re_tasks = rew.re_tasks;
                    state.review[certainIndex].re_collaborators = rew.re_collaborators;
                    state.review[certainIndex].re_problems = rew.re_problems;
                    state.review[certainIndex].created_at = rew.created_at;
                }
            }
        },
        deleteProblem(state, rew) {
            if(!!rew.rp_id) {
                let rp_id = rew.param.rp_id;
                let type = rew.mode;
                if(type == "kr") {
                    state.review.findIndex((e) => {
                        if(e.re_problems.length != 0)
                        {
                            let certainIndex = e.re_problems.findIndex((re) => re.rp_id == rp_id);
                            e.re_problems.splice(certainIndex, 1);
                        }
                    });
                } else if(type == "object") {
                    state.objectReview.findIndex((e) => {
                        if(e.re_problems.length != 0)
                        {
                            let certainIndex = e.re_problems.findIndex((re) => re.rp_id == rp_id);
                            e.re_problems.splice(certainIndex, 1);
                        }
                    });
                }
            } else if(!!rew.re_parent_type) {
                let re_type = param.re_parent_type;
                let re_id = param.re_parent;
                if(re_type == 0) {
                    let certainIndex = state.objectReview.findIndex((rew) => rew.re_id == re_id);
                    state.objectReview[certainIndex].re_problems = [];
                } else if(re_type = 1) {
                    let certainIndex = state.review.findIndex((rew) => rew.re_id == re_id);
                    state.review[certainIndex].re_problems = [];
                }
            }
        }
    },
    actions: {
        initReview({ dispatch, commit }, payload) {
            commit("initReview", payload);
        },
        getReview({ dispatch, commit }, payload) {
            return ReviewService.getReview(payload).then((res) => {
                if (res.status == 200) {
                    commit("getReview", res.data.data);
                    return "success";
                }
            })
        },
        addReview({ dispatch, commit }, payload) {
            ReviewService.addReview(payload).then((res) => {
                if (res.status == 200) {
                    commit("addReview", res.data.data);
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                }
            })
        },
        updateReview({ dispatch, commit }, payload) {
            ReviewService.updateReview(payload).then((res) => {
                if(res.status == 200)
                {
                    commit("updateReview", res.data.data);
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                }
            })
        },
        deleteProblem({ dispatch, commit }, payload) {
            ReviewService.deleteProblem(payload.param).then((res) => {
                if(res.status == 200)
                {
                    commit("deleteProblem", payload);
                    dispatch('app/setNotification', { status: 'success', text: res.data.message }, { root: true });
                }
            })
        }
    }
}