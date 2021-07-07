import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
import Workbench from '@/views/Workbench.vue'

const routes = [
    {
        path: '/',
        redirect: { name: 'workbench' },
    },
    {
        path: '/workbench',
        name: 'workbench',
        meta: {
            menuIndex: '/workbench',
            breadcrumb: ['工作台'],
        },

        component: Workbench,
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    if (to.meta.noLogin !== true && !store.state.authToken) {
    // TODO: 跳转到登录
        store.commit('refreshServerList')
        next()
    // next({ name: 'Login' });
    } else {
        next()
    }
})

export default router
