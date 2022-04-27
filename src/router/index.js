import Vue from 'vue'
import VueRouter from 'vue-router'
import Meta from 'vue-meta'
import store from '@/store'
import { Routes } from '@/constants/routes'
import JwtService from '@/utils/jwt.service';
import { constant } from '@/constants/constant.js';

Vue.use(VueRouter)
Vue.use(Meta)
const routes = [{
    path: '/',
    name: 'land page',
    redirect: !!JwtService.getToken() ? `${Routes.OKR_LIST_PAGE}/${constant.pageCount}/1` : Routes.LOGIN_PAGE
},
{
    path: Routes.AUTH_PAGE,
    name: 'auth',
    component: () =>
        import('@/views/LoginView.vue'),
    children: [{
        path: Routes.LOGIN_PAGE,
        component: () =>
            import('@/pages/auth/Login.vue'),
    },
    {
        path: Routes.SIGNUP_PAGE,
        component: () =>
            import('@/pages/auth/Signup.vue'),
    }
    ]
},
{
    path: Routes.HOME_PAGE,
    name: 'home',
    meta: {
        requiresAuth: true
    },
    component: () =>
        import('@/views/HomeView.vue'),
    children: [{
        path: Routes.OKR_GOAL_PAGE,
        component: () =>
            import('@/pages/OKRGoal.vue'),
        children: [{
            path: `${Routes.OKR_LIST_PAGE}/:countsPerPage/:pageNum`,
            component: () =>
                import('@/components/okrgoal/OKRGoalListView.vue'),
            name: 'okrListPage'
        },
        {
            path: Routes.OKR_EDIT_PAGE,
            component: () =>
                import('@/components/okrgoal/okrDetail/OkrDetailComponent.vue'),
            name: 'okrListPage'
        }
        ]
    },
    {
        path: Routes.OKR_SETTING_PAGE,
        name: 'okrSettingPage',
        component: () =>
            import('@/pages/SettingPage.vue'),
    },
    {
        path: Routes.OKR_MAP_PAGE,
        component: () =>
            import('@/pages/OkrMap.vue'),
        name: 'okrMapPage'
    },
    {
        path: Routes.OKR_IMPORT_LIBRARY,
        component: () =>
            import('@/pages/OKRLibraryPage.vue'),
        name: 'okrLibraryPage'
    },
    {
        path: Routes.OKR_WORKING_METHOD,
        component: () =>
            import('@/pages/OKRWorkingMethodPage.vue'),
        name: 'okrMethodPage',
        children: [{
            path: Routes.OKR_WORKING_METHOD_HOME,
            component: () =>
                import('@/components/workingMethod/main.vue'),
            name: 'workingMethodMain'
        }]
    },
    {
        path: Routes.OKR_DASHBOARD_PAGE,
        component: () =>
            import('@/pages/OkrDashboard.vue'),
        name: 'okrDashboardPage',
    },
    {
        path: Routes.EXE_SCHEDULE_PAGE,
        component: () =>
            import('@/pages/Schedule.vue'),
        name: 'schedulePage',
        redirect: Routes.EXE_SCHEDULE_PAGE_HOME,
        children: [{
            path: Routes.EXE_SCHEDULE_PAGE_HOME,
            component: () =>
                import('@/components/schedule/Main.vue'),
            name: 'ScheduleMain',
        }]
    },
    {
        path: Routes.EXE_PROJECT_PAGE,
        component: () =>
            import('@/pages/Project.vue'),
        name: 'projectPage'
    },
    {
        path: Routes.ITEM_DETAIL_PAGE,
        component: () =>
            import('@/pages/ItemDetailPage.vue'),
        name: 'projectPage'
    },
    {
        path: Routes.EXE_SUMMARY_PAGE,
        component: () =>
            import('@/pages/Summary.vue'),
        name: 'summaryParentPage',
        redirect: Routes.SUMMARY_MAIN_PAGE,
        children: [{
            path: Routes.SUMMARY_MAIN_PAGE,
            component: () =>
                import('@/components/summary/Main.vue'),
            name: 'summaryPage',
        }]
    }
    ]
}, {
    path: Routes.ADMIN_PAGE,
    name: 'admin',
    meta: {
        requiresAuth: true
    },
    component: () =>
        import('@/views/AdminView.vue'),
    children: [{
        path: Routes.ADMIN_EMPLOYEE_PAGE,
        component: () =>
            import('@/pages/admin/Employee.vue'),
        name: 'employeePage'
    },
    {
        path: Routes.ADMIN_RESIGN_PAGE,
        component: () =>
            import('@/pages/admin/Resign.vue'),
        name: 'resignPage'
    },
    {
        path: Routes.ADMIN_DEPARTMENT_PAGE,
        component: () =>
            import('@/pages/admin/DepartmentManagement.vue'),
        name: 'departmentPage'
    },
    ]
}
]
const router = new VueRouter({
    base: '/',
    mode: 'history',
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
        if (to.hash) {
            return { selector: to.hash }
        }
    }
});
// router.beforeEach((to, from, next) => {
//     if (to.path.includes('admin')) {
//         if (store.getters['auth/authUser'].user_role != 'admin' && store.getters['auth/authUser'].user_role != 'creator') {
//             next(`${Routes.OKR_LIST_PAGE}/${constant.pageCount}/1`)
//         }
//     }
//     if (to.matched.some(record => record.meta.requiresAuth)) {
//         if (store.getters['auth/isAuthenticated']) {
//             next()
//             return
//         }
//         next(Routes.LOGIN_PAGE)
//     } else {
//         next()
//     }
// })
// router.afterEach((to, from) => {
//     store.dispatch('app/setCurrentRouter', to.name, { root: true });
// })
export default router