/**
 *
 * @author ：WarmthDawn
 * @date ：2021/7/10
 *
 */
/* eslint-disable no-unused-vars */
/* eslint-disable no-empty-function */
import monitor from '@/api/serverMonitor'
import utils from '@/utils'
import axios from 'axios'

/**
 * 列出全部服务器列表
 */
async function list() {

    const resp = await axios.get(utils.getAddress('/server/list'))
    //TODO
    return resp.data.map(d => {
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
    console.log(req)
    const resp = await axios.post(utils.getAddress('/server/create'), req)

}

async function start(id) {
    const resp = await axios.post(utils.getAddress(`/server/${id}/start`))
}

async function stop(id) {
    await axios.post(utils.getAddress(`/server/${id}/stop`))
}

async function restart(id) {
    await axios.post(utils.getAddress(`/server/${id}/restart`))
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
