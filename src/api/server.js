/* eslint-disable no-unused-vars */
/* eslint-disable no-empty-function */
import monitor from '@/api/serverMonitor'
import utils from '@/utils'

/**
 * 列出全部服务器列表
 */
async function list() {
    return [
        {
            id: 'ftbi',
            name: 'FTB Interactions',
            running: false,
            port: 521,
            last_run: new Date('2020/4/23 11:54:32'),
        },
        {
            id: 'as',
            name: 'Fiction Craft: Atomtic Space',
            running: true,
            port: 522,
            tps: 20.0,
            online_player: 3,
            max_player: 20,
        },
        {
            id: 'e2e',
            name: 'E2E',
            running: true,
            port: 524,
            tps: 3.14,
            online_player: 18,
            max_player: 40,
        },
        {
            id: 'et2',
            name: '玄理2',
            running: false,
            port: 527,
            last_run: new Date('2020/5/1 1:52:00'),

        },
    ]
}

/**
 * 开服 关服 重启
 */
async function create(val) {
    await utils.wait() // 等待服务器响应

}

async function start(id) {

}

async function stop(id) {

}

async function restart(id) {

}

async function info(id) {
    return {

    }
}

export default {
    monitor, list, start, stop, restart, create,
}