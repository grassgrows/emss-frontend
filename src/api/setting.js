import axios from 'axios'
import utils from '@/utils'

async function imageStatus(imageId) {
    const resp = await axios.get(utils.getAddress(`/settings/image/${imageId}/status`))
    return resp.data
}

async function imageInfo(imageId) {
    const resp = await axios.get(utils.getAddress(`/settings/image/${imageId}`))
    return resp.data
}

async function images() {
    const resp = await axios.get(utils.getAddress('/settings/images'))
    return resp.data
}

async function createImage(imageName, imageRepository) {
    const [repository, tag] = imageRepository.split(':')
    await axios.post(utils.getAddress('/settings/image'), {
        name: imageName,
        repository,
        tag: (typeof tag === 'undefined') ? '' : tag,
    })
}

async function downloadImage(imageId) {
    await axios.post(utils.getAddress(`/settings/image/${imageId}/download`))
}


async function baseSetting() {
    const resp = await axios.get(utils.getAddress('/settings/base'))
    return resp.data
}

async function updateSetting(setting) {
    await axios.post(utils.getAddress('/settings/base'), setting)
}

export default {
    images, imageInfo, imageStatus, createImage, downloadImage, baseSetting, updateSetting
}
