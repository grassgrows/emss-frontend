import { random } from 'lodash'
import fileIconMap from '@/assets/fileIconMaps.json'
import iconfont from '@/assets/icon-file/iconfont.json'

const availableIcons = iconfont.glyphs.map((f) => f.font_class)

async function wait(time) {
    return new Promise((r) => setTimeout(r, time || random(500, 3000)))
}

function mapData(dataKey, names) {
    const res = {}
    names.forEach((key) => {
        res[key] = function () {
            if (typeof this[dataKey] === 'undefined') {
                return undefined
            }
            return this[dataKey][key]
                || this[dataKey][key.replace(/([A-Z])/g, '_$1').toLowerCase()]
        }
    })
    return res
}

function getIconName(ext) {
    // eslint-disable-next-line no-param-reassign
    ext = fileIconMap[ext] || ext
    if (!availableIcons.includes(ext)) {
        return '#icon-f-blank'
    }
    return `#icon-f-${ext}`
}

export default {
    wait, mapData, getIconName,
}