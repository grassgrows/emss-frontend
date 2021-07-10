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
                    <div class="content">{{ systemSetting[key] }}</div>
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
                        <div class="action">
                            <el-link v-if="dockerData.status === 'Ready'" href="javascript:void(0);">下载</el-link>
                            <el-link v-if="dockerData.status === 'Downloading'" href="javascript:void(0);" disabled>下载中</el-link>
                            <el-link v-if="dockerData.status === 'Downloaded'" href="javascript:void(0);">删除</el-link>
                        </div>
                    </div>
                    <span v-if="dockerData.status === 'Downloading'"
                          :style="{width: `${100 * dockerData.progress}%`}"
                          class="progress"></span>
                </li>
                <li>
                    <div class="list-item">
                        <div class="name">自定义镜像</div>
                        <div class="action">
                            <el-link href="javascript:void(0);">添加</el-link>
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
    </div>

</template>

<script>
// import DockerCard from '@/components/setting/dockerCard.vue'
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
            settingsType: {
                name: {
                    title: '系统名称',
                    description: '这里缺一段文案，balabalabala',
                },
                path: {
                    title: '服务端路径',
                    description: '这里缺一段文案，balabalabala',
                },

            },
            systemSetting: {
                name: 'EMSS',
                dockerList: [
                    {
                        id: 0,
                        name: 'Image Open JDK 8',
                        status: 'Downloading',
                        progress: 0.3,
                    },
                    {
                        id: 1,
                        name: 'Image Open JDK 11',
                        status: 'None',
                    }
                ],
                path: '/mnt/device1/servers'
            }
        }
    },
    methods: {
        edit(key) {
            this.editor.editingName = key
            this.editor.editing = true
            this.editor.value = this.systemSetting[key]
            this.editor.editTitle = this.settingsType[key].title
            this.editor.editDescription = this.settingsType[key].description
        },
        editOkClick() {
            this.editor.editing = false
            //TODO: 更新设置
            this.systemSetting[this.editor.editingName] = this.editor.value
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
