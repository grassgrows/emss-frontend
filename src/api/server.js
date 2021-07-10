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

    // return [
    //     {
    //         id: 'ftbi',
    //         name: 'FTB Interactions',
    //         running: false,
    //         port: 521,
    //         last_run: new Date('2020/4/23 11:54:32'),
    //     },
    //     {
    //         id: 'as',
    //         name: 'Fiction Craft: Atomtic Space',
    //         running: true,
    //         port: 522,
    //         tps: 20.0,
    //         online_player: 3,
    //         max_player: 20,
    //     },
    //     {
    //         id: 'e2e',
    //         name: 'E2E',
    //         running: true,
    //         port: 524,
    //         tps: 3.14,
    //         online_player: 18,
    //         max_player: 40,
    //     },
    //     {
    //         id: 'et2',
    //         name: '玄理2',
    //         running: false,
    //         port: 527,
    //         last_run: new Date('2020/5/1 1:52:00'),
    //
    //     },
    // ]
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

async function info(id) {
    return {

    }
}

export default {
    monitor, list, start, stop, restart, create,
}
