import { ElNotification } from 'element-plus'

function getData(data, errorTitle){
    if(typeof data === 'undefined' || data.code !== '0000') {
        ElNotification({
            type: 'error',
            title: errorTitle,
            message: data.message
        })
        return false
    }
    return data.data
}

export default {
    getData
}
