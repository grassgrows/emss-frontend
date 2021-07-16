const FlowObj = require('@flowjs/flow.js')
import {Flow, FlowOptions} from 'flowjs'

export function createFlow(opt: FlowOptions = {}): Flow {
    return new FlowObj(opt)
}
