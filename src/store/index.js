import Vue from 'vue'
import Vuex from 'vuex'

import app from './app.js';
import okr from './okr.js';
import auth from './auth.js';
import department from './department.js';
import user from './user.js';
import progress from './progress.js';
import intercom from './intercom.js';
import operating from './operating.js';
import review from './review.js';
import task from './task.js';
import item from './item.js';
import milestone from './milestone.js'
import workingTime from './workingTime.js';
import kanban from './kanban.js';
import report from './report.js';
import fileUpload from './fileUpload.js';
import dashboard from './dashboard.js';
import label from './label.js';
import keyResult from './keyResult.js';

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    okr,
    auth,
    department,
    user,
    progress,
    intercom,
    operating,
    review,
    task,
    item,
    milestone,
    workingTime,
    kanban,
    report,
    fileUpload,
    dashboard,
    label,
    keyResult
  }
});

export default store
