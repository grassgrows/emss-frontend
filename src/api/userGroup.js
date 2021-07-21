/**
 *
 * @author ：smq
 * @date ：2021/7/20
 *
 */

import axios from 'axios'
import result from '@/utils/result'

async function getGroupList() {
    const resp = await axios.get('/api/permission/group')
    return result.getData(resp.data, '获取组失败')
}
async function getAbbrList() {
    const resp = await axios.get('/api/servers')
    const groups = result.getData(resp.data, '获取服务器失败')
    return groups.map(g => {
        return {
            abbr: g.abbr
        }
    })
}
async function getUserList() {
    const resp = await axios.get('/api/permission/user')
    return result.getData(resp.data, '获取用户失败')
}

export default {
    getGroupList, getAbbrList, getUserList
}
