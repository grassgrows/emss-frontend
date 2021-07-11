/**
 *
 * @author ：WarmthDawn
 * @date ：2021/7/7
 *
 */
/* eslint-disable no-unused-vars */
/* eslint-disable no-empty-function */
import { times, random } from 'lodash'
import utils from '@/utils'

const templateTimestamps = [1619933160, 1619933220, 1619933280, 1619933340, 1619933400, 1619933460,
    1619933520, 1619933580, 1619933640, 1619933700, 1619933760, 1619933820, 1619933880,
    1619933940, 1619934000, 1619934060, 1619934120, 1619934180, 1619934240, 1619934300,
    1619934360, 1619934420, 1619934480, 1619934540, 1619934600, 1619934660, 1619934720,
    1619934780, 1619934840, 1619934900, 1619934960, 1619935020, 1619935080, 1619935140,
    1619935200, 1619935260, 1619935320, 1619935380, 1619935440, 1619935500, 1619935560,
    1619935620, 1619935680, 1619935740, 1619935800, 1619935860, 1619935920, 1619935980,
    1619936040, 1619936100, 1619936160, 1619936220, 1619936280, 1619936340, 1619936400,
    1619936460, 1619936520, 1619936580, 1619936640, 1619936700]

/**
 * cpu占用
 * @param id
 */
async function cpus(id) {
    await utils.wait()
    return {
        timestamps: templateTimestamps,
        values: times(60, () => random(100, true)),
        current: random(100, true),
    }
}

/**
 * 内存占用
 * @param id
 */
async function memorys(id) {
    await utils.wait()
    return {
        timestamps: templateTimestamps,
        values: times(60, () => random(3, 5, true)),
        current: random(3, 5, true),
    }
}

/**
 * 网络占用
 * @param id
 */
async function networks(id) {
    await utils.wait()
    return {
        timestamps: templateTimestamps,
        uploads: times(60, () => random(0, 5, true)),
        downloads: times(60, () => random(0, 5, true)),
        current: {
            upload: random(0, 5, true),
            download: random(0, 5, true),
        },
    }
}

/**
 * 磁盘占用
 * @param id
 */
async function disks(id) {
    await utils.wait()
    return {
        timestamps: templateTimestamps,
        writes: times(60, () => random(0, 5, true)),
        reads: times(60, () => random(0, 5, true)),
        current: {
            write: random(0, 5, true),
            read: random(0, 5, true),
        },
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
    await utils.wait()
    return {
        timestamps: templateTimestamps,
        values: times(60, () => random(10, 20, true)),
        current: random(10, 20, true),
    }
}

/**
 * 在线玩家数量
 * @param id
 */
async function onlineNumbers(id) {
    await utils.wait(1000)
    return {
        timestamps: templateTimestamps,
        values: times(60, () => random(0, 5)),
        current: random(0, 5),
    }
}

export default {
    cpus, memorys, networks, players, tpses, onlineNumbers, disks,
}
