/**
 *
 * @author ：smq
 * @date ：2021/7/23
 *
 */
import axios from 'axios'
import result from '@/utils/result'

async function changeName(newName) {
    const resp = await axios.post('/api/login/user/modify/username', newName)
    return result.getData(resp.data, '修改用户名失败')
}

async function changePwd(password, newPassword) {
    const data = {
        password: password,
        newPassword: newPassword
    }
    const resp = await axios.post('/api/login/user/modify/password', data)
    return result.getData(resp.data, '修改密码失败')
}

export default {
    changePwd, changeName
}
