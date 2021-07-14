<template>
  <div
    v-if="!hide"
    class="uploader-container"
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
              <span class="icon error"><i class="el-icon-upload" /></span>
              <span>上传出现错误</span>
              <span class="divider"><el-divider direction="vertical" /></span>
              <span>共{{ files.length }}个文件上传失败</span>
            </template>
            <template v-else-if="isAllPaused">
              <span class="icon"><i class="el-icon-upload" /></span>
              <span>暂停上传</span>
              <span class="divider"><el-divider direction="vertical" /></span>
              <span>剩余{{ files.length }}个文件</span>
            </template>
            <template v-else>
              <span class="icon"><i class="el-icon-upload" /></span>
              <span>正在上传</span>
              <span class="divider"><el-divider direction="vertical" /></span>
              <span>剩余{{ files.length }}个文件</span>
            </template>
          </div>
          <div class="upload-action">
            <el-tooltip
              effect="dark"
              content="全部取消"
              placement="top"
            >
              <span @click.stop="cancel()">
                <i class="el-icon-close" />
              </span>
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
                    v-for="file in files"
                    :key="file.uniqueIdentifier"
                  >
                    <div
                      class="upload-progress"
                      :style="{width:`${file.progress() * 100}%`}"
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
                          {{ file.name }}
                        </div>
                        <div class="status">
                          <span>{{ formatProcess(file) }}</span>
                          <span class="divider"><el-divider direction="vertical" /></span>
                          <span :class="displayText(file).style">{{ displayText(file).msg }}</span>
                        </div>
                      </div>
                    </div>

                    <div
                      v-if="!file.isComplete()"
                      class="upload-action"
                    >
                      <el-tooltip
                        effect="dark"
                        content="取消"
                        placement="top"
                      >
                        <span @click.stop="cancel(file)">
                          <i class="el-icon-close" />
                        </span>
                      </el-tooltip>
                      <el-tooltip
                        v-if="file.paused || file.error"
                        effect="dark"
                        content="恢复"
                        placement="top"
                      >
                        <span @click.stop="resume(file)">
                          <i class="el-icon-refresh" />
                        </span>
                      </el-tooltip>
                      <el-tooltip
                        v-else
                        effect="dark"
                        content="暂停"
                        placement="top"
                      >
                        <span @click.stop="pause(file)">
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
          :style="{width: flow.progress()}"
          class="progress-total"
        />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {Flow, FlowFile} from 'flowjs'
import {createFlow} from '@/utils/importUtils'


export default defineComponent({
    name: 'Uploader',
    data() {
        return {
            shrunk: true,
            flow: {} as Flow,
            totalUpload: 0,
        }
    },
    computed: {
        isAllCompleted(): boolean {
            return this.uploadRemain === 0
        },
        isAllPaused(): boolean {
            return this.uploadRemain <= this.errorCount + this.pausedCount
        },
        hasError(): boolean {
            return this.errorCount > 0
        },
        errorCount(): number {
            return this.files.reduce((agg, file) => file.error ? agg + 1 : agg, 0)
        },
        pausedCount(): number {
            return this.files.reduce((agg, file) => file.paused ? agg + 1 : agg, 0)
        },
        hide(): boolean {
            return this.files.length <= 0
        },
        uploadRemain(): number {
            return this.files.filter((file) => !file.isComplete()).length
        },
        files(): Array<FlowFile> {
            if (typeof this.flow.files === 'undefined') {
                return []
            }
            return this.flow.files
        },
    },
    watch: {
        hide(to) {
            if (to === true) {
                this.totalUpload = 0
            }
        },
        '$route.path'() {
            const browse = document.getElementById('browseButton')
            if (browse) {
                this.flow.assignBrowse([browse])
            }
        }
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
            this.flow.upload()
        })
        this.flow.on('fileAdded', (file) => {
            file.destinationPath = '/root'
        })
        this.flow.on('fileError', (file) => {
            this.$notify({
                title: '上传失败',
                message: `文件 ${file.name} 上传失败，请重试`,
                type: 'error'
            })
        })

        this.flow.on('fileSuccess', (file) => {
            this.$notify({
                title: '上传成功',
                message: `文件 ${file.name} 上传成功`,
                type: 'success'
            })

            // eslint-disable-next-line no-self-assign
            file.uniqueIdentifier = file.uniqueIdentifier

            setTimeout(() => {
                file.cancel()
            }, 10000)
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
        formatSpeed(file: FlowFile) {
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
        formatProcess(file: FlowFile) {
            return `${this.formatSize(file.sizeUploaded())}/${this.formatSize(file.size)}`
        },

        displayText(file: FlowFile): { msg: string; style: string } {
            if (file.isComplete()) {
                return {
                    msg: '上传成功',
                    style: 'success'
                }
            }
            if (file.error) {
                return {
                    msg: '上传失败',
                    style: 'error'
                }
            }
            if (file.paused) {
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
        cancel(file: FlowFile | null = null) {
            if (file === null) {
                this.flow.cancel()
                //TODO: 加个动画效果
                return
            }
        },
        pause(file: FlowFile | null = null) {
            if (file === null) {
                this.flow.pause()
                return
            }
            file.pause()
        },
        resume(file: FlowFile | null = null) {
            if (file === null) {
                this.flow.resume()
                return
            }
            if (!file.isComplete()) {
                file.resume()
            }
        },
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


.progress-total {
  &::after {
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
