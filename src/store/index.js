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
            selectedFileList: [],
            isCopy: Boolean
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
        copyFile(state,val) {
            state.isCopy = true
            state.selectedFileList = val
        },
        cutFile(state, val) {
            state.isCopy = false
            state.selectedFileList = val
        },
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
