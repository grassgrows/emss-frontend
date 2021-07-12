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
            isMobile: false,
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
        setIsMobile(state, val) {
            state.isMobile = val
        }
    },
    actions: {
        async refreshServerList({ commit }) {
            const serverList = await api.server.list()
            commit('setServerList', serverList)
        },
    },
    modules: {},
})

export default store
