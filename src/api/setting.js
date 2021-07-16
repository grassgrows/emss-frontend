/**
 *
 * @author ：WarmthDawn
 * @date ：2021/7/10
 *
 */
import axios from 'axios'
import result from '@/utils/result'

async function imageStatus(imageId) {
    const resp = await axios.get(`/api/settings/image/${imageId}/status`)
    return result.getData(resp.data, `获取镜像${imageId}信息状态失败`)
}

async function imageInfo(imageId) {
    const resp = await axios.get(`/api/settings/image/${imageId}`)
    return result.getData(resp.data, `获取镜像${imageId}信息失败`)
}

async function images() {
    const resp = await axios.get('/api/settings/images')
    return result.getData(resp.data, '获取镜像列表失败')
}

async function createImage(imageName, imageRepository) {
    const [repository, tag] = imageRepository.split(':')
    const resp = await axios.post('/api/settings/image', {
        name: imageName,
        repository,
        tag: (typeof tag === 'undefined') ? '' : tag,
    })
    result.getData(resp.data, '创建镜像失败')
}

async function downloadImage(imageId) {
    const resp = await axios.post(`/api/settings/image/${imageId}/download`)
    return resp.data
}

async function cancelDownloadImage(imageId) {
    await axios.post(`/api/settings/image/${imageId}/cancelDownload`)
}

async function deleteImage(imageId) {
    await axios.delete(`/api/settings/image/${imageId}`)
}

async function baseSetting() {
    const resp = await axios.get('/api/settings/base')
    return result.getData(resp.data, '获取服务器设置失败')
}

async function updateSetting(setting) {
    const resp = await axios.post('/api/settings/base', setting)
    result.getData(resp.data, '更新服务器设置失败')
}

export default {
    images, imageInfo, imageStatus, createImage, downloadImage, deleteImage, baseSetting, updateSetting, cancelDownloadImage
}
