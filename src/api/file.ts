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

export async function getFiles(filePath: string): Promise<Array<FileInfo>> {
    const resp = await axios.get(`/api/file/list/${filePath}`)
    const files = result.getData(resp.data, `无法打开文件夹${filePath}`)
    if(!files) {
        return []
    }
    return files.map((it: any) => {
        it.lastModified = DateTime.fromISO(it.lastModified)
        return it
    })
}

