/**
 *
 * @author ：WarmthDawn
 * @date ：2021/7/6
 *
 */
import {createStore} from 'vuex'
import api from '@/api'

const store = createStore({
    state() {
        return {
            serverList: [],
            currentServer: {},
            addState: false,
            serverSetting: false,
            isMobile: false,

            authToken: sessionStorage.getItem('token')
        }
    },
    mutations: {
        setServerList(state, serverList) {
            state.serverList = serverList
        },
        setServer(state, server) {
            state.currentServer = server
        },
        changeAddState(state, val) {
            state.addState = val
        },
        changeServerSetting(state, val) {
            state.serverSetting = val
        },
        setIsMobile(state, val) {
            state.isMobile = val
        },
        setToken(state, val) {
            state.authToken = val
            sessionStorage.setItem('token', val)
        },
        clearToken(state) {
            state.authToken = ''
            sessionStorage.setItem('token', '')
        }
    },
    actions: {
        async refreshServerList({commit, state}) {
            const serverList = await api.server.list()
            commit('setServerList', serverList)
            if (state.currentServer) {
                const curr = serverList.find((it) => it.id === state.currentServer.id)
                commit('setServer', curr)
            }
        },
    },
    modules: {
        file: {
            namespaced: true,
            state() {
                return {
                    selectedFileList: [],
                    isCopy: true,

                    sortMethod: 'filename',
                    sortAscend: true,
                }
            },
            mutations: {
                copyFile(state, val) {
                    state.isCopy = true
                    state.selectedFileList = val
                },
                cutFile(state, val) {
                    state.isCopy = false
                    state.selectedFileList = val
                },
                setSortMethod(state, val) {
                    state.sortMethod = val
                },
                setSortAscend(state, val) {
                    state.sortAscend = val
                }
            },
        }
    },
})

export default store
