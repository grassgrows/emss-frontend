import { createStore } from 'vuex'
import api from '@/api'

const store = createStore({
    state() {
        return {
            serverList: [],
            currentServer: {},
        }
    },
    mutations: {
        async refreshServerList(state) {
            state.serverList = await api.server.list()
        },
		
        async setServer(state, server) {
            state.currentServer = server
        },
    },
    actions: {},
    modules: {},
})

export default store
