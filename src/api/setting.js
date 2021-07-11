/**
 *
 * @author ：WarmthDawn
 * @date ：2021/7/10
 *
 */
import axios from 'axios'

async function imageStatus(imageId) {
    const resp = await axios.get(`/api/settings/image/${imageId}/status`)
    return resp.data
}

async function imageInfo(imageId) {
    const resp = await axios.get(`/api/settings/image/${imageId}`)
    return resp.data
}

async function images() {
    const resp = await axios.get('/api/settings/images')
    return resp.data
}

async function createImage(imageName, imageRepository) {
    const [repository, tag] = imageRepository.split(':')
    await axios.post('/api/settings/image', {
        name: imageName,
        repository,
        tag: (typeof tag === 'undefined') ? '' : tag,
    })
}

async function downloadImage(imageId) {
    await axios.post(`/api/settings/image/${imageId}/download`)
}


async function baseSetting() {
    const resp = await axios.get('/api/settings/base')
    return resp.data
}

async function updateSetting(setting) {
    await axios.post('/api/settings/base', setting)
}

export default {
    images, imageInfo, imageStatus, createImage, downloadImage, baseSetting, updateSetting
}
