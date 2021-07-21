/**
 *
 * @author ：smq
 * @date ：2021/7/21
 *
 */
import axios from 'axios'

async function login(user) {
    const resp = await axios.post('/api/login', user)
    return resp.data
}

export default {
    login
}
