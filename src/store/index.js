/**
 *
 * @author ：WarmthDawn
 * @date ：2021/7/6
 *
 */
import { createStore } from 'vuex'
import api from '@/api'

const store = createStore({
    state() {
        return {
            serverList: [],
            currentServer: {},
            addState: false
        }
    },
    mutations: {
        async refreshServerList(state) {
            state.serverList = await api.server.list()
        },
		
        async setServer(state, server) {
            state.currentServer = server
        },
        async changeAddState(state,val) {
            state.addState = val
        }
    },
    actions: {},
    modules: {},
})

export default store
