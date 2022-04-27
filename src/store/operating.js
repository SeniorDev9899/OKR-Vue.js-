import { OperatingService } from '../utils/api.service';

export default {
    namespaced: true,
    state: {
        operators: [],
        objectOperators: [],
        taskOperators: [],
        reportOperators: [],
        itemOperators: [],
    },
    getters: {
        operators: state => state.operators,
        objectOperators: state => state.objectOperators,
        taskOperators: state => state.taskOperators,
        reportOperators: state => state.reportOperators,
        itemOperators: state => state.itemOperators,
    },
    mutations: {
        getOperators(state, ops) {
            state.objectOperators = ops.filter(e => e.op_parent_type == 0);
            state.operators = ops.filter(e => e.op_parent_type == 1);
            state.taskOperators = ops.filter(e => e.op_parent_type == 2);
            state.reportOperators = ops.filter(e => e.op_parent_type == 10);
            state.itemOperators = ops.filter(e => e.op_parent_type == 3);
        }
    },
    actions: {
        getOperators({ commit }, payload) {
            return OperatingService.getOperating(payload).then(res => {
                if (res.status == 200) {
                    commit("getOperators", res.data.data);
                    return "success";
                }
            })
        }
    }
}