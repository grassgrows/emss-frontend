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

async function getGroupInfo(id) {
    const resp = await axios.get(`/api/permission/group/${id}`)
    return result.getData(resp.data, '获取组失败')
}

async function createGroup(group) {
    const resp = await axios.post('/api/permission/group', {}, {
        params: {
            name: group.groupName,
            maxLevel: group.maxPermissionLevel,
        }
    })
    return result.getData(resp.data, '获取组失败')
}

async function getUserList() {
    const resp = await axios.get('/api/permission/user')
    return result.getData(resp.data, '获取用户失败')
}


async function removeUser(id) {
    const resp = await axios.delete(`/api/permission/user/${id}`)
    return result.getData(resp.data, '删除用户失败')
}

async function createUser(user) {
    await axios.post('/api/login/user/create', user)
}

async function updateUser(user, groupId) {
    await axios.post('/api/permission/user', user, {
        params: {
            groupId
        }
    })
}


async function addServerToGroup(serverId, groupId) {
    await axios.post(`/api/permission/group/${groupId}/server/${serverId}`)
}

async function removeServerFromGroup(serverId, groupId) {
    await axios.delete(`/api/permission/group/${groupId}/server/${serverId}`)
}

async function deleteLocation(groupId, location) {
    await axios.delete(`/api/permission/group/${groupId}/location`, {
        params: {
            location
        }
    })
}

async function updateLocation(groupId, locations) {
    await axios.post(`/api/permission/group/${groupId}/location`, locations)
}

async function updateUserGroup(groupId, userIds) {
    await axios.post('/api/permission/user-group/update', userIds, {
        params: {
            groupId
        }
    })
}


export default {
    getGroupList, getUserList,
    removeUser, createUser,
    addServerToGroup, getGroupInfo,
    removeServerFromGroup, updateLocation,
    deleteLocation, updateUser,
    updateUserGroup, createGroup
}
