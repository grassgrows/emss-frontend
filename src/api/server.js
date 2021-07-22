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

    const resp = await axios.get('/api/servers')
    let servers = result.getData(resp.data, '获取服务器信息失败')
    //TODO
    return servers.map(d => {
        return {
            id: d.id,
            abbr: d.abbr,
            name: d.name,
            running: d.running,
            port: d.port,
            lastRun: d.lastStartDate,


            tps: 20.0,
            online_player: 3,
            max_player: 20,
        }
    })
}

async function serverInfo(id) {
    const resp = await axios.get(`/api/servers/${id}`)
    let server = result.getData(resp.data, '获取服务器信息失败')
    return server
}


/**
 * 开服 关服 重启
 */
async function create(val) {
    const portBindings = {}
    val.portBindings.forEach((it) => {
        portBindings[it.hostPort] = it.containerPort
    })
    const volumeBind = new Map()
    val.volumeBind.forEach((it) => {
        volumeBind[it.hostVolume] = it.containerVolume
    })
    const req = {
        name: val.name,
        aliasName: val.anotherName,
        abbr: val.shortName,
        location: val.serverPosition,
        startCommand: val.startCommand,
        workingDir: val.workingDir,
        portBindings,
        volumeBind,
        imageId: val.selectedDocker,
        permissionGroup: [...val.permittedGroup],
    }

    const resp = await axios.post('/api/servers', req)
    return result.getData(resp.data, '创建服务器失败')
}

async function start(id) {
    const resp = await axios.post(`/api/servers/${id}/start`)
    return result.getData(resp.data, '启动服务器失败')
}

async function stop(id) {
    const resp = await axios.post(`/api/servers/${id}/stop`)
    return result.getData(resp.data, '关闭服务器失败')
}

async function restart(id) {
    const resp = await axios.post(`/api/servers/${id}/restart`)
    return result.getData(resp.data, '重启服务器失败')
}

async function remove(id) {
    const resp = await axios.delete(`/api/servers/${id}`)
    return result.getData(resp.data, '删除服务器失败')
}

async function updateSetting(server) {
    const portBindings = {}
    server.portBindings.forEach((it) => {
        portBindings[it.hostPort] = it.containerPort
    })
    const volumeBind = new Map()
    server.volumeBind.forEach((it) => {
        volumeBind[it.hostVolume] = it.containerVolume
    })
    const data = {}
    Object.assign(data, server)
    data.id = undefined
    data.portBindings = portBindings
    data.volumeBind = volumeBind
    const resp = await axios.post(`/api/servers/${server.id}`, data)

    result.getData(resp.data, '保存设置失败')
}

export default {
    monitor, list, start, stop, restart, create, updateSetting, serverInfo, remove
}
