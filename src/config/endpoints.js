let urls;
if (process.env.NODE_ENV == 'production') { // This is for production version.
    const API_URL = process.env.VUE_APP_API_DOMAIN;
    urls = {
        API_URL: API_URL,
        SIGN_UP_URL: `${API_URL}/register`,
        LOGIN_URL: `${API_URL}/login`,
        CREATE_OKR_URL: `${API_URL}/object/addObjectKr`,
        GET_OKR_URL: `${API_URL}/object/list/`,
        UPDATE_OKR_URL: `${API_URL}/object/updateObject`,
        DELETE_OKR_URL: `${API_URL}/object/deleteByFields`,
        CREATE_KEYRESULT_URL: `${API_URL}/kresult/addKresult`,
        UPDATE_KEYRESULT_URL: `${API_URL}/kresult/updateKr`,
        DELETE_KEYRESULT_URL: `${API_URL}/kresult/deleteKrByFields`,
        CREATE_KR_URL: `${API_URL}/kresult/addKresult`,
        GET_DEPARTMENTS_URL: `${API_URL}/department/getByFields`,
        DELETE_DEPARTMENTS_URL: `${API_URL}/department/deleteByFields`,
        UPDATE_DEPARTMENTS_URL: `${API_URL}/department/updateByFields`,
        GET_USERS_URL: `${API_URL}/user/getByFields`,
        UPDATE_USER_URL: `${API_URL}/user/updateByFields`,
        ADD_DEPARTMENT_URL: `${API_URL}/department/addOne`,

        // Endpoint for getting library
        GET_LIBRARY_MENU_URL: `${API_URL}/library/getLibraryMenu`,
        GET_LIBRARY_CONTENT_URL: `${API_URL}/library/getLibraryByCriteria`,

        // Endpoint for getting progress
        GET_PROGRESS_URL: `${API_URL}/pr/getByFields`,
        ADD_PROGRESS_URL: `${API_URL}/pr/addOne`,
        UPDATE_PROGRESS_URL: `${API_URL}/pr/updateByFields`,
        DELETE_PROGRESS_URL: `${API_URL}/pr/deleteByFields`,

        // Endpoint for getting intercom
        ADD_INTERCOM_URL: `${API_URL}/intercom/addOne`,
        GET_INTERCOM_URL: `${API_URL}/intercom/getByFields`,
        DELETE_INTERCOM_URL: `${API_URL}/intercom/deleteByFields`,
        UPDATE_INTERCOM_URL: `${API_URL}/intercom/updateByFields`,

        // Endpoint for getting operating
        GET_OPERATING_URL: `${API_URL}/operating/getByFields`,

        // Endpoint for setting
        CREATE_SETTING_URL: `${API_URL}/setting/addOne`,
        UPDATE_SETTING_URL: `${API_URL}/setting/updateByFields`,
        GET_SETTING_URL: `${API_URL}/setting/getByFields`,

        // Endpoint for Review
        GET_REVIEW_URL: `${API_URL}/review/getByFields`,
        ADD_REVIEW_URL: `${API_URL}/review/addOne`,
        UPDATE_REVIEW_URL: `${API_URL}/review/updateByFields`,
        DELETE_PROBLEM_URL: `${API_URL}/review/deleteProblemsByFields`,

        // GET_USERINFO_URL: `${API_OA_URL}/ap-service/foreignInterface/queryEmployeInfo`,
        // GET_DEPARTINFO_URL: `${API_OA_URL}/ap-service/foreignInterface/queryDepartmentInfo`,

        // Endpoints for task
        ADD_TASK_URL: `${API_URL}/task/addOne`,
        UPDATE_TASK_URL: `${API_URL}/task/updateByFields`,
        GET_TASKS_URL: `${API_URL}/task/getByFields`,
        DELETE_TASK_URL: `${API_URL}/task/deleteByFields`,

        // Get detail infos
        OBJECT_DETAILS_URL: `${API_URL}/object/list`,

        // Endpoints for project
        ADD_ITEM_URL: `${API_URL}/item/addOne`,
        UPDATE_ITEM_URL: `${API_URL}/item/updateByFields`,
        GET_ITEMS_URL: `${API_URL}/item/getByFields`,

        // Endpoints for Milestone
        ADD_MILESTONE_URL: `${API_URL}/milestone/addOne`,
        GET_MILESTONES_URL: `${API_URL}/milestone/getByFields`,
        UPDATE_MILESTONE_URL: `${API_URL}/milestone/updateByFields`,

        // Endpoint for workingTime
        GET_WORKINGTIME_URL: `${API_URL}/wt/getByFields`,
        ADD_WORKINGTIME_URL: `${API_URL}/wt/addOne`,
        DELETE_WORKINGTIME_URL: `${API_URL}/wt/deleteByFields`,
        UPDATE_WORKINGTIME_URL: `${API_URL}/wt/updateByFields`,

        // Endpoints for Kanban
        GET_KANBANS_URL: `${API_URL}/kb/getByFields`,
        ADD_KANBAN_URL: `${API_URL}/kb/addOne`,
        UPDATE_KANBAN_URL: `${API_URL}/kb/updateByFields`,
        REMOVE_KANBAN_URL: `${API_URL}/kb/deleteByFields`,

        // Endpoint for report
        ADD_REPORT_URL: `${API_URL}/report/addOne`,
        GET_REPORT_URL: `${API_URL}/report/getByFields`,
        UPDATE_REPORT_URL: `${API_URL}/report/updateByFields`,

        // Endpoint for FileUpload
        FILE_UPLOAD: `${API_URL}/file/uploadFile`,
        FILE_DOWNLOAD: `${API_URL}/file/downloadFile`,
        DELETE_FILEUPLOAD: `${API_URL}/file/deleteByFields`,
        GET_FILES: `${API_URL}/file/getByFields`,
        // Endpoint for Dashboard
        DASHBOARD_SETTING_URL: `${API_URL}/dashboard/getSetting`,
        ITEM_STATISTICS: `${API_URL}/dashboard/getItemResult`,
        DASHBOARD_TRACK_URL: `${API_URL}/dashboard/getTracking`,
        DASHBOARD_ANALYZE_URL: `${API_URL}/dashboard/getAnalyze`,
        DASHBOARD_TRACKPROGRESS_URL: `${API_URL}/dashboard/getTrackObjectProgress`,
        // Endpoint for label
        GET_TAGS_URL: `${API_URL}/tag/getByFields`,
        ADD_TAG_URL: `${API_URL}/tag/addOne`,
    }
} else if (process.env.NODE_ENV == 'development') { // This is for local development.
    const API_URL = process.env.VUE_APP_API_URL;
    // const API_OA_URL = process.env.VUE_APP_OA_URL;
    urls = {
        API_URL: API_URL,
        SIGN_UP_URL: `${API_URL}/register`,
        LOGIN_URL: `${API_URL}/login`,
        CREATE_OKR_URL: `${API_URL}/object/addObjectKr`,
        GET_OKR_URL: `${API_URL}/object/list/`,
        UPDATE_OKR_URL: `${API_URL}/object/updateObject`,
        DELETE_OKR_URL: `${API_URL}/object/deleteByFields`,
        CREATE_KEYRESULT_URL: `${API_URL}/kresult/addKresult`,
        UPDATE_KEYRESULT_URL: `${API_URL}/kresult/updateKr`,
        DELETE_KEYRESULT_URL: `${API_URL}/kresult/deleteKrByFields`,
        CREATE_KR_URL: `${API_URL}/kresult/addKresult`,
        GET_DEPARTMENTS_URL: `${API_URL}/department/getByFields`,
        DELETE_DEPARTMENTS_URL: `${API_URL}/department/deleteByFields`,
        UPDATE_DEPARTMENTS_URL: `${API_URL}/department/updateByFields`,
        GET_USERS_URL: `${API_URL}/user/getByFields`,
        UPDATE_USER_URL: `${API_URL}/user/updateByFields`,
        ADD_DEPARTMENT_URL: `${API_URL}/department/addOne`,

        // Endpoint for getting library
        GET_LIBRARY_MENU_URL: `${API_URL}/library/getLibraryMenu`,
        GET_LIBRARY_CONTENT_URL: `${API_URL}/library/getLibraryByCriteria`,

        // Endpoint for getting progress
        GET_PROGRESS_URL: `${API_URL}/pr/getByFields`,
        ADD_PROGRESS_URL: `${API_URL}/pr/addOne`,
        UPDATE_PROGRESS_URL: `${API_URL}/pr/updateByFields`,
        DELETE_PROGRESS_URL: `${API_URL}/pr/deleteByFields`,

        // Endpoint for getting intercom
        ADD_INTERCOM_URL: `${API_URL}/intercom/addOne`,
        GET_INTERCOM_URL: `${API_URL}/intercom/getByFields`,
        DELETE_INTERCOM_URL: `${API_URL}/intercom/deleteByFields`,
        UPDATE_INTERCOM_URL: `${API_URL}/intercom/updateByFields`,

        // Endpoint for getting operating
        GET_OPERATING_URL: `${API_URL}/operating/getByFields`,

        // Endpoint for setting
        CREATE_SETTING_URL: `${API_URL}/setting/addOne`,
        UPDATE_SETTING_URL: `${API_URL}/setting/updateByFields`,
        GET_SETTING_URL: `${API_URL}/setting/getByFields`,

        // Endpoint for Review
        GET_REVIEW_URL: `${API_URL}/review/getByFields`,
        ADD_REVIEW_URL: `${API_URL}/review/addOne`,
        UPDATE_REVIEW_URL: `${API_URL}/review/updateByFields`,
        DELETE_PROBLEM_URL: `${API_URL}/review/deleteProblemsByFields`,

        // Endpoints for task
        ADD_TASK_URL: `${API_URL}/task/addOne`,
        UPDATE_TASK_URL: `${API_URL}/task/updateByFields`,
        GET_TASKS_URL: `${API_URL}/task/getByFields`,
        DELETE_TASK_URL: `${API_URL}/task/deleteByFields`,

        // Get detail infos
        OBJECT_DETAILS_URL: `${API_URL}/object/list`,

        // Endpoints for project
        ADD_ITEM_URL: `${API_URL}/item/addOne`,
        UPDATE_ITEM_URL: `${API_URL}/item/updateByFields`,
        GET_ITEMS_URL: `${API_URL}/item/getByFields`,

        // Endpoints for Milestone
        ADD_MILESTONE_URL: `${API_URL}/milestone/addOne`,
        GET_MILESTONES_URL: `${API_URL}/milestone/getByFields`,
        UPDATE_MILESTONE_URL: `${API_URL}/milestone/updateByFields`,

        // Endpoint for workingTime
        GET_WORKINGTIME_URL: `${API_URL}/wt/getByFields`,
        ADD_WORKINGTIME_URL: `${API_URL}/wt/addOne`,
        DELETE_WORKINGTIME_URL: `${API_URL}/wt/deleteByFields`,
        UPDATE_WORKINGTIME_URL: `${API_URL}/wt/updateByFields`,

        // Endpoints for Kanban
        GET_KANBANS_URL: `${API_URL}/kb/getByFields`,
        ADD_KANBAN_URL: `${API_URL}/kb/addOne`,
        UPDATE_KANBAN_URL: `${API_URL}/kb/updateByFields`,
        REMOVE_KANBAN_URL: `${API_URL}/kb/deleteByFields`,

        // Endpoint for report
        ADD_REPORT_URL: `${API_URL}/report/addOne`,
        GET_REPORT_URL: `${API_URL}/report/getByFields`,
        UPDATE_REPORT_URL: `${API_URL}/report/updateByFields`,

        // Endpoint for FileUpload
        FILE_UPLOAD: `${API_URL}/file/uploadFile`,
        FILE_DOWNLOAD: `${API_URL}/file/downloadFile`,
        DELETE_FILEUPLOAD: `${API_URL}/file/deleteByFields`,
        GET_FILES: `${API_URL}/file/getByFields`,
        // Endpoint for Dashboard
        DASHBOARD_SETTING_URL: `${API_URL}/dashboard/getSetting`,
        ITEM_STATISTICS: `${API_URL}/dashboard/getItemResult`,
        DASHBOARD_TRACK_URL: `${API_URL}/dashboard/getTracking`,
        DASHBOARD_ANALYZE_URL: `${API_URL}/dashboard/getAnalyze`,
        DASHBOARD_TRACKPROGRESS_URL: `${API_URL}/dashboard/getTrackObjectProgress`,
        // Endpoint for label
        GET_TAGS_URL: `${API_URL}/tag/getByFields`,
        ADD_TAG_URL: `${API_URL}/tag/addOne`,
    }
}

module.exports = urls;