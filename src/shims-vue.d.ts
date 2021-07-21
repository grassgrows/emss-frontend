/* eslint-disable */

import { ComponentCustomProperties } from 'vue'
import { FlowFile } from 'flowjs'
import { Store } from "vuex";
import { ElNotification, ElMessage } from 'element-plus';
import 'vue-router'
import {Emitter, EventType} from "mitt";

declare module '*.vue' {
    import type {DefineComponent} from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare module 'flowjs' {
    export interface FlowFile {
        destinationPath: string
    }
}



declare module '@vue/runtime-core' {

    // provide typings for `this.$store`
    interface ComponentCustomProperties {
        $store: Store<any> | any
        $notify: ElNotification
        $message: ElMessage
        $bus: Emitter<Record<EventType, any>>
    }

}
