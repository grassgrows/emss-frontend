import axios from 'axios'
import store from '@/store'
import router from '@/router'

axios.interceptors.request.use((config)=> {
    if(store.state.authToken) {
        config.headers.Authorization = `Bearer ${store.state.authToken}`
    }
})

axios.interceptors.response.use(()=>{}, (err)=> {
    if(err.response.data.code === 'E201') {
        router.push({name: 'login'})
    }
})