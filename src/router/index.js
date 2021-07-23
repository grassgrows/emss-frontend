/**
 *
 * @author ：WarmthDawn
 * @date ：2021/7/5
 *
 */
import {createRouter, createWebHashHistory} from 'vue-router'
import store from '@/store'
import Layout from '@/views/Layout'
import LogIn from '@/views/LogIn'
import Workbench from '@/views/Workbench.vue'
import ServerList from '@/views/ServerList.vue'
import NotFound from '@/views/NotFound.vue'
import ServerListHeader from '@/components/server/ServerListHeader.vue'
import Setting from '@/views/Setting'
import Server from '@/views/Server'
import ServerHeader from '@/components/server/ServerHeader'
import Info from '@/views/server/Info.vue'
import Terminal from '@/views/server/Terminal.vue'
import Files from '@/views/file/Files.vue'
import UserGroupList from '@/views/UserGroupList'
import GroupListHeader from '@/components/user/GroupListHeader'
import FileListHeader from '@/components/file/FileListHeader'
import Search from '@/views/file/Search'

const routes = [
    {
        path: '/login',
        name: 'login',
        meta: {
            noLogin: true,
            title: '登录',
        },
        component: LogIn,
    },
    {
        path: '/',
        name: 'Layout',
        component: Layout,
        redirect: {name: 'workbench'},
        children: [
            {
                path: '/workbench',
                name: 'workbench',
                meta: {
                    menuIndex: '/workbench',
                    breadcrumb: ['工作台'],
                    title: '工作台',
                },

                component: Workbench,
            },
            {
                path: '/server/list',
                name: 'server_list',
                meta: {
                    menu_Index: '/server/list',
                    breadcrumb: ['工作台', '服务器'],
                    title: '服务器',
                },
                components: {
                    default: ServerList,
                    extra: ServerListHeader,
                },
            },
            {
                path: '/servers/:abbr',
                name: 'server',
                meta: {
                    menuIndex: (route) => `/servers/${route.params.abbr}`,
                    breadcrumb: (route) => ['工作台', '服务器', route.params.abbr],
                    title: '服务器',
                },
                props: true,
                // component: Server,
                components: {
                    default: Server,
                    extra: ServerHeader,
                },
                redirect: (to) => ({name: 'info', params: to.params}),
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
                path: '/files/:filePaths*',
                name: 'files',
                meta: {
                    menuIndex: '/files',
                    breadcrumb: (route) => {
                        const paths = route.params.filePaths || []
                        return ['工作台', '文件管理', ...paths.filter((s) => Boolean(s))]
                    },
                    title: '文件管理',
                },
                components: {
                    default: Files,
                    extra: FileListHeader,
                }
            },
            {
                path: '/file/search/:filePaths*',
                name: 'file-search',
                meta: {
                    menuIndex: '/files',
                    breadcrumb: (route) => {
                        return ['工作台', '文件搜索', `${route.query.keyword}的搜索结果`]
                    },
                    title: '文件搜索',

                },
                components: {
                    default: Search,
                    extra: FileListHeader,
                },
                props: route => ({keyword: route.query.keyword}),
            },
            {
                path: '/system/users',
                name: 'users',
                meta: {
                    menuIndex: '/system/users',
                    breadcrumb: ['工作台', '用户管理'],
                    title: '用户管理',
                },
                components: {
                    default: UserGroupList,
                    extra: GroupListHeader
                }
            },
            {
                path: '/system/setting',
                name: 'setting',
                meta: {
                    menuIndex: '/system/setting',
                    breadcrumb: ['工作台', '系统设置'],
                    title: '系统设置',
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
                    title: '404',
                },
                component: NotFound,
            },
            {
                path: '/:pathMatch(.*)*',
                redirect: {name: 'not_found'},
            },
        ]
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach(async (to, from, next) => {
    if(to.meta.title) {
        document.title = to.meta.title
    }

    if (to.meta.noLogin !== true && !store.state.authToken) {
        next({name: 'login'})
    } else {
        if(store.state.authToken){
            await store.dispatch('refreshServerList')
        }
        next()
    }
})

export default router
