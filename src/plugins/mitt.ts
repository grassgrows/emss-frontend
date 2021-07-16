import mitt, {Emitter, EventType} from 'mitt'
import {App} from 'vue'

export default {
    install: (app: App) => {
        app.config.globalProperties.$bus = mitt()
    }
}

