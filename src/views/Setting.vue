<!--
 * @Author: WarmthDawn
 * @Date: 2021/7/9
 -->
<template>
  <div>
    <el-card
      v-loading="loadingBaseSetting"
      shadow="always"
      class="card"
    >
      <template #header>
        <div class="card-header">
          <span>服务器基本设置</span>
        </div>
      </template>
      <ul class="setting-list list">
        <li
          v-for="(node, key) in settingsType"
          :key="key"
        >
          <div class="title">
            {{ node.title }}
          </div>
          <div class="content">
            {{ baseSetting[key] }}
          </div>
          <div class="action">
            <el-link
              href="javascript:void(0);"
              @click="edit(key)"
            >
              编辑
            </el-link>
          </div>
        </li>
      </ul>
    </el-card>
    <el-card
      v-loading="loadingImage"
      shadow="always"
      class="card"
    >
      <template #header>
        <div class="card-header">
          <span>Docker容器设置</span>
        </div>
      </template>

      <ul class="docker-list list">
        <li
          v-for="image in imageSetting"
          :key="image.id"
        >
          <div class="list-item">
            <div class="name">
              {{ image.name }}
            </div>
            <div class="content">
              {{ `${image.repository}:${image.tag}` }}
            </div>
            <div class="download">
              <template v-if="image.statusObj && image.statusObj.status === 'Downloading'">
                <span>{{ formatProgress(image) }}</span>&nbsp;<span>{{ formatSpeed(image) }}</span>
              </template>
            </div>
            <div class="action">
              <el-link
                v-if="image.acting && image.acting.busy"
                href="javascript:void(0);"
                disabled
              >
                {{ image.acting.message }}
              </el-link>
              <el-link
                v-else-if="image.statusObj && image.statusObj.status === 'Ready'"
                href="javascript:void(0);"
                @click="beginDownloadImage(image)"
              >
                下载
              </el-link>
              <el-link
                v-else-if="image.statusObj && image.statusObj.status === 'Downloading'"
                href="javascript:void(0);"
                @click="cancelDownloadImage(image.id)"
              >
                取消
              </el-link>
              <el-popconfirm
                v-else-if="image.statusObj && image.statusObj.status === 'Downloaded'"
                title="确认删除该镜像？"
                @confirm="deleteImage(image)"
              >
                <template #reference>
                  <el-link
                    href="javascript:void(0);"
                  >
                    删除
                  </el-link>
                </template>
              </el-popconfirm>
            </div>
          </div>
          <span
            v-if="image.statusObj && image.statusObj.status === 'Downloading'"
            :style="{width: formatProgress(image)}"
            class="progress"
          />
        </li>
        <li>
          <div class="list-item">
            <div class="name">
              自定义镜像
            </div>
            <div class="action">
              <el-link
                href="javascript:void(0);"
                @click="imageCreating = true"
              >
                添加
              </el-link>
            </div>
          </div>
        </li>
      </ul>
    </el-card>

    <el-dialog
      v-model="editor.editing"
      :title="`设置 ${editor.editTitle}`"
      custom-class="edit-dialog"
    >
      <div class="edit-description">
        {{ editor.editDescription }}
      </div>
      <el-input v-model="editor.value" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editor.editing = false">取 消</el-button>
          <el-button
            type="primary"
            @click="editOkClick"
          >确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="imageCreating"
      title="自定义镜像"
      custom-class="edit-dialog"
      @close="clearData"
    >
      <el-form
        ref="imageForm"
        :model="imageToCreate"
        label-width="110px"
        label-position="left"
      >
        <el-form-item label="名字/name">
          <el-input v-model="imageToCreate.name" />
        </el-form-item>
        <el-form-item label="库/repository">
          <el-input
            v-model="imageToCreate.repository"
            placeholder="java:latest"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="imageCreating = false">取 消</el-button>
          <el-button
            type="primary"
            @click="imageOkClick"
          >确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api'
import delay from 'delay'

export default {
    name: 'Setting',
    components: {},


    beforeRouteEnter(from, to, next) {
        next(vm => {
            vm.updateSetting()
            vm.updateImages()
        })
    },
    data() {
        return {
            editor: {
                editingName: '',
                editing: false,
                value: '',
                editTitle: '',
                editDescription: '',

            },
            imageToCreate: {
                name: '',
                repository: '',
            },
            imageCreating: false,
            settingsType: {
                name: {
                    title: '系统名称',
                    description: '这里缺一段文案，balabalabala',
                },
                serverRootDirectory: {
                    title: '服务端路径',
                    description: '这里缺一段文案，balabalabala',
                },
                serverBackupDirectory: {
                    title: '备份文件夹',
                    description: 'xxxxxxxx'
                },
                temporaryFolder: {
                    title: '临时文件夹',
                    description: 'xxxxxx'
                }
            },
            imageStatuses: {},
            baseSetting: {
                name: '',
                serverRootDirectory: '',
                serverBackupDirectory: '',
                temporaryFolder: ''
            },

            imageSetting: [],

            loadingImage: true,
            loadingBaseSetting: true,
        }
    },
    methods: {
        formatProgress(image) {
            if (!image || !image.statusObj) {
                return '0%'
            }

            const pro = image.statusObj.progress
            if (typeof pro !== 'number' && isNaN(pro) || pro < 0) {
                return '0%'
            }

            if (pro > 1) {
                return '100%'
            }
            return `${(pro * 100).toFixed(1)}%`
        },
        formatSpeed(image) {
            if (!image || !image.statusObj) {
                return '<1KB/s'
            }
            const speed = image.statusObj.speed
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
        async updateSetting() {
            this.loadingBaseSetting = true
            this.baseSetting = await api.setting.baseSetting()
            this.loadingBaseSetting = false
        },
        async updateImages() {
            this.loadingImage = true
            const images = await api.setting.images()
            for (const image of images) {
                image.acting = {
                    busy: false,
                    message: ''
                }
                await this.updateImageStatus(image)
            }
            this.imageSetting = images
            this.loadingImage = false

        },
        async updateImageStatus(image) {
            const result = await api.setting.imageStatus(image.id)
            image.statusObj = result
            return result.status
        },
        async cancelDownloadImage(imageId) {
            await api.setting.cancelDownloadImage(imageId)
        },
        async beginDownloadImage(image) {
            // noinspection ES6MissingAwait
            api.setting.downloadImage(image.id)
            image.acting = {
                busy: true,
                message: '开始下载'
            }
            let started = false

            for (; ;) {
                const status = await this.updateImageStatus(image)
                if (!started && status === 'Downloading') {
                    this.$notify({
                        title: '下载开始',
                        message: `正在下载镜像: ${image.name}`,
                        type: 'info'
                    })

                    image.acting = {
                        busy: false,
                        message: ''
                    }
                    started = true
                }
                if (status !== 'Downloading' && status !== 'Ready') {
                    if (status === 'Downloaded') {
                        this.$notify({
                            title: '下载成功',
                            message: `镜像: ${image.name} 下载成功，现在你可以创建服务器了`,
                            type: 'success'
                        })
                    } else {
                        this.$notify({
                            title: '下载失败',
                            message: `镜像: ${image.name} 下载失败`,
                            type: 'error'
                        })
                        image.statusObj.status = 'Ready'
                    }
                    break
                }
                await delay(500)
            }
            image.acting = {
                busy: false,
                message: ''
            }


        },
        async deleteImage(image) {
            //TODO:判断该镜像中是否还剩余容器，若有(根据错误码code)则提示错误
            // noinspection ES6MissingAwait
            api.setting.deleteImage(image.id)
            for(; ;) {
                const status = await this.updateImageStatus(image)
                if(status !== 'Downloading' && status !== 'Downloaded' ) {
                    if(status === 'Ready') {
                        this.$notify({
                            title: '删除成功',
                            message: `镜像: ${image.name} 已被删除`,
                            type: 'success'
                        })
                    } else {
                        this.$notify({
                            title: '删除失败',
                            message: `镜像: ${image.name} 删除失败`,
                            type: 'error'
                        })
                        image.statusObj.status = 'Downloaded'
                    }
                    break
                }
                await delay(500)
            }
        },
        edit(key) {
            this.editor.editingName = key
            this.editor.editing = true
            this.editor.value = this.baseSetting[key]
            this.editor.editTitle = this.settingsType[key].title
            this.editor.editDescription = this.settingsType[key].description
        },
        async editOkClick() {
            this.editor.editing = false
            const editSetting = {}
            editSetting[this.editor.editingName] = this.editor.value
            await api.setting.updateSetting(editSetting)
            this.baseSetting[this.editor.editingName] = this.editor.value
            await this.updateSetting()
        },
        imageOkClick() {
            this.imageCreating = false
            api.setting.createImage(this.imageToCreate.name, this.imageToCreate.repository)
        },
        clearData() {
            // this.$refs['imageForm'].resetFields()
            this.imageToCreate.name = ''
            this.imageToCreate.repository = ''
        }
    }
}
</script>

<style scoped lang="less">
@import "../styles/global";

.card {
    margin: 10px 0 20px;
}


ul.list {
    list-style-type: none;
    padding: 0 10px;
    margin-top: 0;

}

.list-item {
    display: flex;
    align-items: flex-end;
    align-content: flex-end;
    justify-content: space-between;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding: 5px 0;
    min-height: 40px;

    .action {
        flex: 0 0 50px;
    }
}

.docker-list {
    li {

        .list-item {

            .name {
                font-size: 16px;
                flex: 1 0 120px;
            }

            .content {
                font-size: 14px;
                color: rgba(0, 0, 0, .45);
                flex: 1 1;
            }

            .download {
                font-size: 12px;
                color: rgba(0, 0, 0, .45);
                flex: 0 0 100px;
            }

            @media screen and (max-width: 768px) {
                flex-wrap: wrap;
                min-height: 60px;
                .name {
                    flex: 1 0 150px;
                }

                .content {
                    padding-left: 10px;
                    order: 1;
                    flex: 1 1 200px;
                }

                .download {
                    order: 1;
                }
            }


            .action {
                flex: 0 0 60px;
            }
        }

        @media screen and (max-width: 768px) {
            &:last-child .list-item {
                min-height: 40px;
            }
        }

        .progress {
            height: 2px;
            box-sizing: border-box;
            background-color: @color-primary;
            border: none;
            display: block;
            top: -2px;
            position: relative;
        }


    }

}

.setting-list {
    li {

        .list-item();

        .title {
            font-size: 16px;
            flex: 1 0 100px;
        }

        .content {
            font-size: 14px;
            color: rgba(0, 0, 0, .45);
            flex: 10 1;
        }

        @media screen and (max-width: 768px) {
            flex-wrap: wrap;
            min-height: 60px;
            .title {
                flex: 1 0 150px;
            }

            .content {
                padding-left: 20px;
                order: 1;
                flex: 1 1 200px;
            }
        }
    }
}

.edit-description {
    color: rgba(0, 0, 0, 0.7);
    font-size: 14px;
    padding-bottom: 10px;
}


</style>

<style lang="less">
.el-dialog.edit-dialog {
    @media screen and (max-width: 768px) {
        width: auto !important;
        margin: 0 20px;
    }

    .el-dialog__body {
        padding: 10px 20px;


    }
}

</style>
