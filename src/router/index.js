import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
import Workbench from '@/views/Workbench.vue'
import ServerList from '@/views/ServerList.vue'
import NotFound from '@/views/NotFound.vue'
import ServerListHeader from '@/components/server/ServerListHeader.vue'
import Setting from '@/views/Setting'
import Server from '@/views/Server'
import ServerHeader from '@/components/server/ServerHeader'
import Info from '@/views/server/Info.vue'
import Terminal  from '@/views/server/Terminal.vue'

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
        path: '/servers/:id',
        name: 'server',
        meta: {
            menuIndex: (route) => `/servers/${route.params.id}`,
            breadcrumb: (route) => ['工作台', '服务器', route.params.id],
        },
        props: true,
        // component: Server,
        components: {
            default: Server,
            extra: ServerHeader,
        },
        redirect: (to) => ({ name: 'info', params: to.params }),
        children: [
            {
                path: 'info',
                name: 'info',
                component: Info,
                props: true,
            },
            {
                path: 'terminal',
                name: 'terminal',
                component: Terminal,
                props: true,
                meta: {
                    breadcrumbAdd: '终端',
                },
            },
        ],
    },
    {
        path: '/system/setting',
        name: 'setting',
        meta: {
            menuIndex: '/system/setting',
            breadcrumb: ['工作台', '用户设置'],
        },
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: Setting,
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
