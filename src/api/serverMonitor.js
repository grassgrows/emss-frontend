/**
 *
 * @author ：WarmthDawn
 * @date ：2021/7/7
 *
 */
/* eslint-disable no-unused-vars */
/* eslint-disable no-empty-function */
import {times, random, zip, zipWith} from 'lodash'
import utils from '@/utils'
import axios from 'axios'
import result from '@/utils/result'


/**
 * cpu占用
 * @param id
 */
async function cpus(id) {
    const resp = await axios.get(`/api/statistics/${id}/cpu`)
    return result.getData(resp.data, '获取服务器CPU信息失败')
}

/**
 * 内存占用
 * @param id
 */
const G = 1024.0 * 1024 * 1024

async function memorys(id) {
    const resp = await axios.get(`/api/statistics/${id}/memory`)
    const data = result.getData(resp.data, '获取服务器内存信息失败')
    return {
        current: data.current / G,
        values: data.values.map((it) => it / G),
        timestamps: data.timestamps,
    }
}

/**
 * 网络占用
 * @param id
 */
const MBPS = 1024.0 * 1024 / 8

async function networks(id) {
    const resp = await axios.get(`/api/statistics/${id}/48`)
    const data = result.getData(resp.data, '获取服务器网络信息失败')
    let upload, download
    if (data[0].type.toLowerCase() === 'network_upload') {
        upload = data[0]
        download = data[1]
    } else {
        upload = data[1]
        download = data[0]
    }
    return {
        timestamps: zipWith(upload.timestamps, download.timestamps, (a, b) => (a + b) / 2),
        uploads: upload.values.map((it) => it / MBPS),
        downloads: download.values.map((it) => it / MBPS),
        current: {
            upload: upload.current / MBPS,
            download: download.current / MBPS,
        }
    }
}

/**
 * 磁盘占用
 * @param id
 */

const KB = 1024
async function disks(id) {
    const resp = await axios.get(`/api/statistics/${id}/12`)
    const data = result.getData(resp.data, '获取服务器磁盘信息失败')

    let write, read
    if (data[0].type.toLowerCase() === 'disk_write') {
        write = data[0]
        read = data[1]
    } else {
        write = data[1]
        read = data[0]
    }
    return {
        timestamps: zipWith(write.timestamps, read.timestamps, (a, b) => (a + b) / 2),
        reads: write.values.map((it) => it / KB),
        writes: read.values.map((it) => it / KB),
        current: {
            write: write.current / KB,
            read: read.current / KB,
        }
    }
}

/**
 * 当前在线玩家
 * @param id
 */
async function players(id) {
    await utils.wait()
    return ['WarmthDawn', 'limbang', 'Doctor_Yin']
}

/**
 * 服务器tps记录
 * @param id
 */
async function tpses(id) {
    const resp = await axios.get(`/api/statistics/${id}/tps`)
    return result.getData(resp.data, '获取服务器TPS信息失败')
}

/**
 * 在线玩家数量
 * @param id
 */
async function onlineNumbers(id) {
    const resp = await axios.get(`/api/statistics/${id}/online_player`)
    return result.getData(resp.data, '获取服务器在线玩家信息失败')
}

export default {
    cpus, memorys, networks, players, tpses, onlineNumbers, disks,
}
