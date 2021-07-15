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
    lastModified: DateTime,
    isDirectory: boolean
}

export async function getFiles(filePath: Array<string> | null): Promise<Array<FileInfo>> {
    const path: string = (filePath || []).join('/')
    const resp = await axios.get('/api/file/list', {
        params: {
            path,
        }
    })
    const files = result.getData(resp.data, `无法打开文件夹${filePath}`)
    if (!files) {
        return []
    }
    return files.map((it: any) => {
        it.lastModified = DateTime.fromISO(it.lastModified)
        return it
    })
}

export async function copyAndParseFiles(files: Array<FileInfo>, filePath: Array<string> | null) {
    const path: string = (filePath || []).join('/')
    const paths = files.map((to)=>{
        return to.filePath
    })
    await axios.post('/api/file/copy', {
        params: {
            path,
        },
        data: paths
    })
}

export async function cutAndParseFiles(files: Array<FileInfo>, filePath: Array<string> | null) {
    const path: string = (filePath || []).join('/')
    const paths = files.map((to)=>{
        return to.filePath
    })
    await axios.post('/api/file/cut', {
        params: {
            path,
        },
        data: paths
    })
}

export async function deleteFiles(files: Array<FileInfo>) {
    const paths = files.map((to) =>{
        return to.filePath
    })
    await axios.post('api/file/delete', {
        data: paths
    })
}



