import axios from 'axios'
import store from '@/store'
import router from '@/router'

axios.interceptors.request.use((config) => {
    if (store.state.authToken) {
        config.headers.Authorization = `Bearer ${store.state.authToken}`
    }
    return config
})

axios.interceptors.response.use(undefined, (err) => {
    if (err && err.response && err.response.data && err.response.data.code === 'E201') {
        router.push({name: 'login'})
    }
    return Promise.reject(err)
})
