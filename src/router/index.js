import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
import Workbench from '@/views/Workbench.vue'
import ServerList from '@/views/ServerList.vue'
import NotFound from '@/views/NotFound.vue'
import ServerListHeader from '@/components/server/ServerListHeader.vue'

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
    {
        path: '/server/list',
        name: 'server_list',
        meta: {
            menu_Index: '/server/list',
            breadcrumb: ['工作台', '服务器'],
        },
        components: {
            default: ServerList,
            extra: ServerListHeader,
        },
    },
    {
        path: '/404',
        name: 'not_found',
        meta: {
            menuIndex: '/404',
            breadcrumb: ['工作台', '404'],
        },
        component: NotFound,
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: { name: 'not_found' },
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
