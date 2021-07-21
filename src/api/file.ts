/**
 *
 * @author ：WarmthDawn
 * @date ：2021/7/11
 *
 */
import axios from 'axios'
import result from '@/utils/result'
// @ts-ignore
import {DateTime} from 'luxon'

export declare interface FileInfo {
    fileName: string,
    filePath: string,
    size: number,
    lastModified: string | DateTime,
    isDirectory: boolean
}

export declare interface Result<T> {
    code: String,
    data: T,
    msg: String
}

function processPath(filePath: Array<string> | null): string {
    return (filePath || []).join('/')
}

export async function searchFiles(filePath: Array<string> | null, keyword: string): Promise<Result<Array<FileInfo>>> {
    const path = processPath(filePath)
    try {
        const resp = await axios.get('/api/file/search', {
            params: {
                path,
                keyword,
            }
        })

        return resp.data
    } catch (err) {
        if (err.response && err.response.data) {
            return err.response.data
        }
        return {
            code: 'C910',
            msg: '未知错误',
            data: [],
        }
    }
}

export async function getFiles(filePath: Array<string> | null): Promise<Result<Array<FileInfo>>> {
    const path = processPath(filePath)
    try {
        const resp = await axios.get('/api/file/list', {
            params: {
                path,
            }
        })

        return resp.data
    } catch (err) {
        if (err.response && err.response.data) {
            return err.response.data
        }
        return {
            code: 'C910',
            msg: '未知错误',
            data: [],
        }
    }

}

export async function copyAndParseFiles(files: Array<FileInfo>, filePath: Array<string> | null) {
    const path: string = (filePath || []).join('/')
    const paths = files.map((to) => {
        return to.filePath
    })
    await axios.post('/api/file/copy', paths, {
        params: {
            path,
        },
    })
}

export async function cutAndParseFiles(files: Array<FileInfo>, filePath: Array<string> | null) {
    const path: string = (filePath || []).join('/')
    const paths = files.map((to) => {
        return to.filePath
    })
    await axios.post('/api/file/cut', paths, {
        params: {
            path,
        },
    })
}

export async function deleteFiles(files: Array<FileInfo>) {
    const paths = files.map((to) => {
        return to.filePath
    })
    await axios.post('api/file/delete', paths)
}

export async function createFolder(name: String, filePath: Array<string> | null) {
    const path: string = (filePath || []).join('/')

    await axios.post('api/file/newFolder', `${path}/${name}`)
}


