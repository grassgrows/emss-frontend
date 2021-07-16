<template>
  <div>
    <div class="uploader-hide">
      <input
        id="uploader-input-file"
        type="file"
        multiple
        @change="selectFile"
      >
      <input
        id="uploader-input-folder"
        type="file"
        webkitdirectory
        @change="selectFile"
      >
    </div>
    <transition
      name="upload-container"
      enter-active-class="animate__animated animate__slideInRight"
      leave-active-class="animate__animated animate__slideOutRight"
    >
      <div
        v-if="!hide"
        class="uploader-container "
      >
        <el-card body-style="padding: 0">
          <div>
            <div
              class="status-bar"
              @click="toggleShrunk()"
            >
              <div class="content">
                <template v-if="isAllCompleted">
                  <span class="icon completed"><i class="el-icon-check" /></span>
                  <span>上传完成</span>
                  <span class="divider"><el-divider direction="vertical" /></span>
                  <span>累计{{ totalUpload }}个文件</span>
                </template>
                <template v-else-if="isAllPaused && hasError">
                  <span class="icon error"><i class="el-icon-close" /></span>
                  <span>上传出现错误</span>
                  <span class="divider"><el-divider direction="vertical" /></span>
                  <span>共{{ errorCount }}个文件上传失败</span>
                </template>
                <template v-else-if="isAllPaused">
                  <span class="icon"><i class="el-icon-upload" /></span>
                  <span>暂停上传</span>
                  <span class="divider"><el-divider direction="vertical" /></span>
                  <span>剩余{{ uploadItem.length }}个文件</span>
                </template>
                <template v-else>
                  <span class="icon"><i class="el-icon-upload" /></span>
                  <span>正在上传</span>
                  <span class="divider"><el-divider direction="vertical" /></span>
                  <span>剩余{{ uploadItem.length }}个文件</span>
                </template>
              </div>
              <div class="upload-action">
                <el-tooltip
                  effect="dark"
                  content="全部取消"
                  placement="top"
                >
                  <div>
                    <el-popconfirm
                      title="确认要取消下载吗？"
                      trigger="click"
                      @confirm="cancel()"
                    >
                      <template #reference>
                        <span>
                          <i class="el-icon-close" />
                        </span>
                      </template>
                    </el-popconfirm>
                  </div>
                </el-tooltip>

                <el-tooltip
                  v-if="isAllPaused"
                  effect="dark"
                  content="全部恢复"
                  placement="top"
                >
                  <span @click.stop="resume()">
                    <i class="el-icon-refresh" />
                  </span>
                </el-tooltip>
                <el-tooltip
                  v-else
                  effect="dark"
                  content="全部暂停"
                  placement="top"
                >
                  <span @click.stop="pause()">
                    <i class="el-icon- iconfont emss-icon-pause" />
                  </span>
                </el-tooltip>
              </div>
            </div>
            <transition name="fade">
              <div
                v-if="!shrunk"
                class="shrunk-wrapper"
              >
                <div class="upload-content">
                  <div>
                    <ul>
                      <li
                        v-for="file in uploadItem"
                        :key="file.identifier"
                      >
                        <div
                          class="upload-progress"
                          :style="{width:`${file.progress * 100}%`}"
                        />
                        <div class="upload-info">
                          <div class="image">
                            <svg
                              class="filefont"
                              aria-hidden="true"
                            >
                              <use xlink:href="#icon-f-blank" />
                            </svg>
                          </div>

                          <div class="info">
                            <div class="title">
                              {{ file.fileName }}
                            </div>
                            <div class="status">
                              <span>{{ formatProcess(file) }}</span>
                              <span class="divider"><el-divider direction="vertical" /></span>
                              <span :class="displayText(file).style">{{ displayText(file).msg }}</span>
                            </div>
                          </div>
                        </div>

                        <div
                          v-if="file.status !== 'success'"
                          class="upload-action"
                        >
                          <el-tooltip
                            effect="dark"
                            content="取消"
                            placement="top"
                          >
                            <div>
                              <el-popconfirm
                                title="确认要取消下载吗？"
                                trigger="click"
                                @confirm="cancel(file.identifier)"
                              >
                                <template #reference>
                                  <span>
                                    <i class="el-icon-close" />
                                  </span>
                                </template>
                              </el-popconfirm>
                            </div>
                          </el-tooltip>
                          <el-tooltip
                            v-if="file.status === 'paused' || file.status === 'error'"
                            effect="dark"
                            content="恢复"
                            placement="top"
                          >
                            <span @click.stop="resume(file.identifier)">
                              <i class="el-icon-refresh" />
                            </span>
                          </el-tooltip>
                          <el-tooltip
                            v-else
                            effect="dark"
                            content="暂停"
                            placement="top"
                          >
                            <span @click.stop="pause(file.identifier)">
                              <i class="el-icon- iconfont emss-icon-pause" />
                            </span>
                          </el-tooltip>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="hide-button">
                  <el-button
                    type="text"
                    @click="toggleShrunk(true)"
                  >
                    收起
                  </el-button>
                </div>
              </div>
            </transition>
            <div
              v-if="shrunk"
              class="progress-total"
            >
              <span :style="{width: `${totalProgress*100}%`}" />
            </div>
          </div>
        </el-card>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {Flow, FlowFile} from 'flowjs'
import {createFlow} from '@/utils/importUtils'
import '@/utils/arrayUtils'

export interface UploadItem {
    status: 'uploading' | 'paused' | 'error' | 'success'
    progress: number,
    totalSize: number,
    uploaded: number,
    averageSpeed: number,
    fileName: string,
    identifier: string,
}

export default defineComponent({
    name: 'Uploader',
    data() {
        return {
            shrunk: true,
            flow: {} as Flow,
            totalUpload: 0,
            uploadMap: new Map<string, UploadItem>(),
        }
    },
    computed: {
        uploadItem(): Array<UploadItem> {
            return [...this.uploadMap.values()]
        },
        isAllCompleted(): boolean {
            return this.uploadRemain === 0
        },
        isAllPaused(): boolean {
            return this.uploadRemain <= this.errorCount + this.pausedCount
        },
        totalProgress(): number {
            if (this.uploadItem.length === 0) {
                return 0
            }
            return this.uploadItem.reduce((agg, it) => {
                return agg + it.progress
            }, 0) / this.uploadItem.length
        },
        hasError(): boolean {
            return this.errorCount > 0
        },
        errorCount(): number {
            return this.uploadItem.count((it) => it.status === 'error')
        },
        pausedCount(): number {
            return this.uploadItem.count((it) => it.status === 'paused')
        },
        hide(): boolean {
            return this.uploadItem.length <= 0
        },
        uploadRemain(): number {
            return this.uploadItem.count((it) => it.status !== 'success')
        }
    },
    watch: {
        hide(to) {
            if (to === true) {
                this.totalUpload = 0
            }
        },
    },

    mounted() {
        this.flow = createFlow({
            target: '/api/file/upload',
            method: 'octet',
            query(file: FlowFile) {
                return {
                    destinationPath: file.destinationPath
                }
            },
        })
        if (!this.flow.support) {
            return
        }

        const browse = document.getElementById('browseButton')
        if (browse) {
            this.flow.assignBrowse([browse])
        }
        this.flow.on('filesSubmitted', () => {
            console.log('Submitted')
            this.flow.upload()
        })
        this.flow.on('fileAdded', (file) => {
            console.log(`Added ${file.name}`)
            const paths = (this.$route.params.filePaths || []) as Array<string>
            file.destinationPath = paths.join('/')

            this.uploadMap.set(file.uniqueIdentifier, {
                identifier: file.uniqueIdentifier,
                fileName: file.name,
                totalSize: file.size,
                status: 'uploading',
                uploaded: 0,
                progress: 0,
                averageSpeed: 0,
            })
        })

        this.flow.on('fileRemoved', (file) => {
            console.log(`Removed ${file.name}`)
            this.uploadMap.delete(file.uniqueIdentifier)
        })

        this.flow.on('fileProgress', (file) => {
            console.log(`Progress ${file.name}`)
            if (!this.uploadMap.has(file.uniqueIdentifier)) {
                file.cancel()
            }
            const upload = this.uploadMap.get(file.uniqueIdentifier)!

            const status = upload.status
            if (status == 'uploading' && upload.status != 'uploading') {
                upload.status = 'uploading'
            }

            upload.progress = file.progress()
            upload.uploaded = file.sizeUploaded()
            upload.averageSpeed = file.averageSpeed
        })

        this.flow.on('fileRetry', (file) => {
            if (this.uploadMap.has(file.uniqueIdentifier))
                this.uploadMap.get(file.uniqueIdentifier)!.status = 'uploading'
        })

        this.flow.on('fileError', (file) => {
            console.log(`Error ${file.name}`)
            if (this.uploadMap.has(file.uniqueIdentifier))
                this.uploadMap.get(file.uniqueIdentifier)!.status = 'error'
            this.$notify({
                title: '上传失败',
                message: `文件 ${file.name} 上传失败，请重试`,
                type: 'error'
            })
        })

        this.flow.on('fileSuccess', (file) => {
            console.log(`Success ${file.name}`)
            this.$notify({
                title: '上传成功',
                message: `文件 ${file.name} 上传成功`,
                type: 'success'
            })
            if (this.uploadMap.has(file.uniqueIdentifier))
                this.uploadMap.get(file.uniqueIdentifier)!.status = 'success'
            this.$bus.emit('refresh-file')
            setTimeout(() => {
                this.cancel(file.uniqueIdentifier)
            }, 10000)
        })

        this.$bus.on('add-upload-drop', (event: MouseEvent) => {
            (this.flow as any).onDrop(event)
        })

        this.$bus.on('show-browse', () => {
            document.getElementById('uploader-input-file')!.click()
        })
        this.$bus.on('show-browse-folder', () => {
            document.getElementById('uploader-input-folder')!.click()
        })



        // flow.assignDrop(document.getElementById('dropTarget'))
    },
    methods: {
        toggleShrunk(shrunk: boolean | null = null) {
            if (shrunk != null) {
                this.shrunk = shrunk
            } else {
                this.shrunk = !this.shrunk
            }

        },
        formatSpeed(file: UploadItem) {
            const speed = file.averageSpeed
            if (speed > 1024 * 1024 * 1024) {
                return `${(speed / 1024 / 1024 / 1024).toPrecision(3)} GB/s`
            }
            if (speed > 1024 * 1024) {
                return `${(speed / 1024 / 1024).toPrecision(3)} MB/s`
            }
            if (speed > 1024) {
                return `${(speed / 1024).toPrecision(3)} KB/s`
            }
            return '<1KB/s'
        },
        formatSize(size: number) {
            if (size > 1024 * 1024 * 1024) {
                return `${(size / 1024 / 1024 / 1024).toPrecision(3)}GB`
            }
            if (size > 1024 * 1024) {
                return `${(size / 1024 / 1024).toPrecision(3)}MB`
            }
            return `${(size / 1024).toPrecision(3)}KB`

        },
        formatProcess(file: UploadItem) {
            return `${this.formatSize(file.uploaded)}/${this.formatSize(file.totalSize)}`
        },

        getFile(identity: string): FlowFile {
            return this.flow.getFromUniqueIdentifier(identity)
        },
        displayText(file: UploadItem): { msg: string; style: string } {
            if (file.status === 'success') {
                return {
                    msg: '上传成功',
                    style: 'success'
                }
            }
            if (file.status === 'error') {
                return {
                    msg: '上传失败',
                    style: 'error'
                }
            }
            if (file.status === 'paused') {
                return {
                    msg: '暂停上传',
                    style: ''
                }
            }
            return {
                msg: this.formatSpeed(file),
                style: ''
            }
        },
        cancel(id: string | null = null) {
            if (id === null) {
                this.flow.cancel()
                this.uploadMap.clear()
                return
            }
            this.getFile(id)?.cancel()
            this.uploadMap.delete(id)
        },
        pause(id: string | null = null) {
            if (id === null) {
                this.flow.pause()
                this.uploadMap.forEach((it) => {
                    it.status = 'paused'
                })
                return
            }
            this.getFile(id)?.pause()
            this.uploadMap.get(id)!.status = 'paused'
        },
        resume(id: string | null = null) {
            if (id === null) {
                this.flow.files.forEach((it) => {
                    const upload = this.uploadMap.get(it.uniqueIdentifier)
                    if (upload && upload.status !== 'success') {
                        if (it.paused) {
                            it.resume()
                        } else {
                            it.retry()
                        }
                        upload.status = 'uploading'
                    }
                })

                return
            }

            const upload = this.uploadMap.get(id)
            const file = this.getFile(id)
            if (upload && upload.status !== 'success') {
                if (file.paused) {
                    file.resume()
                } else {
                    file.retry()
                }
                upload.status = 'uploading'
            }
        },

        selectFile(e: any) {
            if (e.target && e.target.value) {
                const f: any = this.flow
                f.addFiles(e.target.files, e)
                e.target.value = ''
            }
        }
    }

})
</script>

<style
  scoped
  lang="less"
>
@import "../../styles/global";

.uploader-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 480px;
}

.content-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.status-bar {
  display: flex;
  padding: 16px 20px;

  &:hover {
    background-color: @color-btn-bg-primary;
  }

  .content {
    display: flex;
    flex: auto;
    width: 24px;
    height: 24px;
    font-size: 16px;
    align-items: flex-end;

    .divider {
      margin: 0 4px;
    }

    .icon {
      .content-center();
      margin-right: 20px;

      &.completed {
        background-color: @color-success;
        color: #FFF;
      }

      &.error {
        background-color: @color-danger;
        color: #FFF;
      }

      i {
        font-size: 22px;
      }
    }
  }


}

.upload-action {
  display: flex;
  flex-direction: row;
  flex: 0 0 auto;

  span {
    margin-left: 16px;
    box-sizing: border-box;
    display: block;
    background-color: @color-btn-bg-primary;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    .content-center();

    &:hover {
      background-color: @color-btn-bg-secondary;
    }

    i {
      font-size: 16px;
    }
  }
}

.upload-content {
  max-height: 65vh;
  overflow: auto;

  ul {
    padding: 0;
    margin: 0;

    li {
      list-style: none;
      padding: 16px 20px;
      display: flex;
      position: relative;


      .upload-action {
        visibility: hidden;
      }

      &:hover {
        .upload-action {
          visibility: visible;
        }
      }
    }
  }
}

.upload-info {
  flex: auto;
  display: flex;

  .image {
    margin-right: 16px;

    svg {
      height: 36px;
      width: 36px;
    }
  }

  .status {
    font-size: 14px;
    color: rgba(0, 0, 0, .25);

    .success {
      color: @color-success
    }

    .error {
      color: @color-danger
    }
  }

}

.hide-button .el-button {
  width: 100%;
}


.upload-progress {
  position: absolute;
  left: 0;
  top: 3%;
  width: 30%;
  min-width: 4px;
  height: 90%;
  background-color: @color-btn-bg-primary;

  &::after {
    content: '';
    display: block;
    background-color: rgba(126, 193, 92, 0.53);
    height: 2px;
    width: 100%;
    position: absolute;
    bottom: 2px;
  }
}

.uploader-hide {
  visibility: hidden;
  position: absolute;
  width: 1px;
  height: 1px;
}

.progress-total {
  span {
    content: '';
    display: block;
    background-color: rgba(139, 207, 104, 0.53);
    height: 3px;
    width: 60%;
    position: absolute;
    bottom: 0;
  }
}

.shrunk-wrapper {
  max-height: 80vh;
}

.fade-enter-active,
.fade-leave-active {
  transition: max-height 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  max-height: 0;
}


</style>
