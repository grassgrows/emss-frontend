/**
 *
 * @author ：WarmthDawn
 * @date ：2021/7/10
 *
 */
/* eslint-disable no-unused-vars */
/* eslint-disable no-empty-function */
import monitor from '@/api/serverMonitor'
import axios from 'axios'
import result from '@/utils/result'

/**
 * 列出全部服务器列表
 */
async function list() {

    const resp = await axios.get('/api/server/list')
    let servers = result.getData(resp.data, '获取服务器信息失败')
    //TODO
    return servers.map(d => {
        return {
            id: d.id,
            abbr: d.abbr,
            name: d.name,
            running: d.containerStatus === 'Running',
            port: d.hostPort,
            lastRun: d.lastStartDate,


            tps: 20.0,
            online_player: 3,
            max_player: 20,
        }
    })
}

/**
 * 开服 关服 重启
 */
async function create(val) {
    const req = {
        name: val.name,
        aliasName: val.anotherName,
        abbr: val.shortName,
        location: val.serverPosition,
        startCommand: val.startCommand,
        containerPort: val.containerPort,
        hostPort: val.hostPort,
        imageId: val.selectedDocker,
    }

    const resp = await axios.post('/api/server/create', req)
    result.getData(resp.data, '创建服务器失败')
}

async function start(id) {
    const resp = await axios.post(`/api/server/${id}/start`)
    result.getData(resp.data, '启动服务器失败')
}

async function stop(id) {
    const resp = await axios.post(`/api/server/${id}/stop`)
    result.getData(resp.data, '关闭服务器失败')
}

async function restart(id) {
    const resp = await axios.post(`/api/server/${id}/restart`)
    result.getData(resp.data, '重启服务器失败')
}

async function remove(id) {

}

async function info(id) {
    return {

    }
}

export default {
    monitor, list, start, stop, restart, create,
}
