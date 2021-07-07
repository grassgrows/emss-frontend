import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'
import './plugins/utils'
import '@/assets/icon-file/iconfont'
import '@/assets/icon-file/iconfont.css'
import 'animate.css'

const app = createApp(App)
installElementPlus(app)
app.use(store)
    .use(router)
    .mount('#app')