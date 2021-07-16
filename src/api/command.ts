import axios from 'axios'
import result from '@/utils/result'

export async function attachServer(id: number): Promise<WebSocket> {
    const loc = window.location
    let uri
    if (loc.protocol === 'https:') {
        uri = 'wss:'
    } else {
        uri = 'ws:'
    }
    uri += '//' + loc.host
    uri += `/socket/command/attach/${id}`
    const ws = new WebSocket(uri)

    return await new Promise((resolve, reject) => {
        ws.onopen = () => {
            resolve(ws)
        }
        ws.onerror = (err) => {
            reject(err)
        }

    })
}
