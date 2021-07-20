/**
 * @Author: WarmthDawn
 * @Date: 2021/7/5
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import mitt from '@/plugins/mitt'
import installElementPlus from './plugins/element'
import './plugins/utils'
import 'chartjs-adapter-luxon'

import '@/assets/icon-file/iconfont'
import '@/assets/icon-file/iconfont.css'
import 'animate.css'

import 'element-plus/lib/theme-chalk/base.css'
import 'ace-builds'

const app = createApp(App)
installElementPlus(app)
app.use(store)
    .use(router)
    .use(mitt)
    .mount('#app')
