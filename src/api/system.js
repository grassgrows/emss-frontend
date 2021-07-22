import axios from 'axios'
import result from '@/utils/result'

async function info() {
    const resp = await axios.get('/api/system/info')
    return result.getData(resp.data, '获取服务器系统信息失败')
}

async function notifications() {
    const resp = await axios.get('/api/system/notifications')
    return result.getData(resp.data, '获取服务器通知失败')
}

async function startingTime() {
    const resp = await axios.get('/api/system/startingTime')
    return result.getData(resp.data, '获取服务器通知失败')
}

export default {
    info, notifications, startingTime
}
