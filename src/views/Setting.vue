<template>
    <div>
        <el-card shadow="always" class="card">
            <template #header>
                <div class="card-header">
                    <span>服务器基本设置</span>
                </div>
            </template>
            <ul class="setting-list list">
                <li v-for="(node, key) in settingsType" :key="key">
                    <div class="title">{{ node.title }}</div>
                    <div class="content">{{ systemSetting.baseSetting[key] }}</div>
                    <div class="action">
                        <el-link @click="edit(key)" href="javascript:void(0);">编辑</el-link>
                    </div>
                </li>
            </ul>
        </el-card>
        <el-card shadow="always" class="card">
            <template #header>
                <div class="card-header">
                    <span>Docker容器设置</span>
                </div>
            </template>

            <ul class="docker-list list">
                <li v-for="dockerData in systemSetting.dockerList" :key="dockerData">
                    <div class="list-item">
                        <div class="name">{{ dockerData.name }}</div>
                        <div class="content">{{ `${dockerData.repository}:${dockerData.tag}` }}</div>
                        <div class="action">
                            <el-link v-if="getStatus(dockerData.id).status === 'Ready'" href="javascript:void(0);"
                                     @click="beginDownloadImage(dockerData.id, dockerData.name)">下载
                            </el-link>
                            <el-link v-if="getStatus(dockerData.id).status === 'Downloading'"
                                     href="javascript:void(0);" disabled>
                                下载中
                            </el-link>
                            <el-link v-if="getStatus(dockerData.id).status === 'Downloaded'"
                                     href="javascript:void(0);">删除
                            </el-link>
                        </div>
                    </div>
                    <span v-if="getStatus(dockerData.id).status === 'Downloading'"
                          :style="{width: `${100 * getStatus(dockerData.id).progress}%`}"
                          class="progress"></span>
                </li>
                <li>
                    <div class="list-item">
                        <div class="name">自定义镜像</div>
                        <div class="action">
                            <el-link @click="imageCreating = true" href="javascript:void(0);">添加</el-link>
                        </div>
                    </div>
                </li>
            </ul>
        </el-card>

        <el-dialog :title="`设置 ${editor.editTitle}`"
                   v-model="editor.editing"
                   custom-class="edit-dialog"
        >
            <div class="edit-description">{{ editor.editDescription }}</div>
            <el-input v-model="editor.value"></el-input>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editor.editing = false">取 消</el-button>
                    <el-button type="primary" @click="editOkClick">确 定</el-button>
                </span>
            </template>
        </el-dialog>
      
        <el-dialog title="自定义镜像"
                   v-model="imageCreating"
                   custom-class="edit-dialog"
                   @close="clearData">
          <el-form :model="imageToCreate" label-width="110px" label-position="left" ref="imageForm">
            <el-form-item label="名字/name">
              <el-input v-model="imageToCreate.name"></el-input>
            </el-form-item>
            <el-form-item label="库/repository">
              <el-input v-model="imageToCreate.repository" placeholder="java:latest"></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="imageCreating = false">取 消</el-button>
              <el-button type="primary" @click="imageOkClick">确 定</el-button>
            </span>
          </template>
        </el-dialog>
    </div>
</template>

<script>
import api from '@/api'

export default {
    name: 'Setting',
    components: {},
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

            },
            imageStatuses: {
                0: {
                    status: 'Downloading',
                    progress: 0.3,
                }
            },
            systemSetting: {
                baseSetting: {
                    name: 'EMSS',
                    serverRootDirectory: '/mnt/device1/servers',
                },
                dockerList: [
                    {
                        id: 0,
                        name: 'Image Open JDK 8',
                        repository: 'openjdk',
                        tag: '8',
                    },
                    {
                        id: 1,
                        repository: 'openjdk',
                        tag: 'latest',
                        name: 'Image Open JDK 11',
                        status: 'None',
                    }
                ],
            }
        }
    },


    beforeRouteEnter(from, to, next) {
        next(vm => {
            vm.updateSetting()
            vm.updateImages()
        })
    },
    methods: {
        getStatus(imageId) {
            const status = this.imageStatuses[imageId]
            return typeof status === 'undefined' ? {
                status: 'Unknown',
            } : status
        },
        async updateSetting() {
            this.systemSetting.baseSetting = await api.setting.baseSetting()
        },
        async updateImages() {
            const images = await api.setting.images()
            this.systemSetting.dockerList = images

            for (const i of images) {
                await this.updateImageStatus(i.id)
            }

        },
        async updateImageStatus(imageId) {
            const result = await api.setting.imageStatus(imageId)
            this.imageStatuses[imageId] = result

            return result.status
        },
        async beginDownloadImage(imageId, imageName) {
            const downloading = api.setting.downloadImage(imageId)
            this.$notify({
                title: '下载开始',
                message: `正在下载镜像: ${imageName}`,
                type: 'info'
            })

            let actionId
            const action = async () => {
                let status = await this.updateImageStatus(imageId)
                if (status !== 'Downloading' && status !== 'Ready') {
                    clearInterval(actionId)
                    if (status === 'Downloaded') {
                        this.$notify({
                            title: '下载成功',
                            message: `镜像: ${imageName} 下载成功，现在你可以创建服务器了`,
                            type: 'success'
                        })
                    } else {
                        this.$notify({
                            title: '下载失败',
                            message: `镜像: ${imageName} 下载失败`,
                            type: 'error'
                        })
                        this.imageStatuses[imageId].status = 'Ready'
                    }
                }
            }
            actionId = setInterval(action, 1000)

            await downloading

        },
        edit(key) {
            this.editor.editingName = key
            this.editor.editing = true
            this.editor.value = this.systemSetting.baseSetting[key]
            this.editor.editTitle = this.settingsType[key].title
            this.editor.editDescription = this.settingsType[key].description
        },
        async editOkClick() {
            this.editor.editing = false
            const editSetting = {}
            editSetting[this.editor.editingName] = this.editor.value
            await api.setting.updateSetting(editSetting)
            this.systemSetting.baseSetting[this.editor.editingName] = this.editor.value
            await this.updateSetting()
        },
        imageOkClick() {
            this.imageCreating = false
            // 数据库添加镜像
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
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            //border-bottom: none;
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

        .action {
            flex: 0 0 50px;
        }
    }
}

.edit-description {
    color: rgba(0, 0, 0, 0.7);
    font-size: 14px;
    padding-bottom: 10px;
}


</style>

<style>
.edit-dialog > .el-dialog__body {
    padding: 10px 20px;
}

</style>
