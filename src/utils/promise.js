/**
 *
 * @author ：smq
 * @date ：2021/7/10
 *
 */
async function sleep(time) {
    return new Promise(resolve => setTimeout(()=>resolve, time))
}

export default {
    sleep
}
