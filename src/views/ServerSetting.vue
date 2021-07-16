<!--
 * @Author: smq
 * @Date: 2021/7/16
 -->
<template>
  <div class="server-setting">
    <el-dialog
      v-model="serverSetting"
      title="服务器设置"
      :rules="rules"
      @open="openDialog"
    >
      <el-form
        v-loading="loading"
        :model="server"
      >
        <el-form-item
          label="服务器名称"
          prop="name"
        >
          <el-input v-model="server.name" />
        </el-form-item>
        <el-form-item label="服务器别名">
          <el-input v-model="server.aliasName" />
        </el-form-item>
        <el-form-item
          label="服务器缩写"
          prop="abbr"
        >
          <el-input v-model="server.abbr" />
        </el-form-item>
        <el-form-item
          label="服务器位置"
          prop="location"
        >
          <el-input v-model="server.location" />
        </el-form-item>
        <el-form-item
          label="启动命令"
          prop="startCommand"
        >
          <el-input v-model="server.startCommand" />
        </el-form-item>
        <el-form-item
          label="工作目录"
          prop="workingDir"
        >
          <el-input v-model="server.workingDir" />
        </el-form-item>
        <el-form-item
          label="端口映射"
          prop="portBindings"
        >
          <div
            v-for="(item, index) in server.portBindings"
            :key="item"
            class="port-container"
          >
            <el-space
              v-if="index === 0"
              spacer=":"
              style="width: 100%"
            >
              <el-input
                v-model="item.hostPort"
                placeholder="主机端口"
              />
              <el-input
                v-model="item.containerPort"
                placeholder="容器端口"
              />
            </el-space>
            <el-button
              v-if="index === 0"
              @click="addPortBinding"
            >
              添加
            </el-button>
            <el-space
              v-else
              spacer=":"
              style="width: 100%"
            >
              <el-input
                v-model="item.hostPort"
                placeholder="主机端口"
              />
              <el-input
                v-model="item.containerPort"
                placeholder="容器端口"
              />
            </el-space>
            <el-button
              v-if="index !== 0"
              @click="removePortBinding(index)"
            >
              删除
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="目录映射">
          <div
            v-for="(item, index) in server.volumeBind"
            :key="item"
            class="port-container"
          >
            <el-space
              v-if="index === 0"
              spacer=":"
              style="width: 100%"
            >
              <el-input
                v-model="item.hostVolume"
                placeholder="主机目录"
              />
              <el-input
                v-model="item.containerVolume"
                placeholder="容器目录"
              />
            </el-space>
            <el-button
              v-if="index === 0"
              @click="addVolumeBinding"
            >
              添加
            </el-button>
            <el-button
              v-else
              @click="removeVolumeBinding(index)"
            >
              删除
            </el-button>
          </div>
        </el-form-item>
        <el-form-item
          label="Docker镜像"
          prop="imageId"
        >
          <el-select
            v-model="server.imageId"
            placeholder="请选择..."
            style="width: 100%;"
            no-data-text="无可用docker镜像，请去设置中下载"
          >
            <el-option
              v-for="docker in dockerImageList"
              :key="docker.id"
              :label="docker.name"
              :value="docker.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close">取 消</el-button>
          <el-button
            type="primary"
            @click="confirm(server)"
          >确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api'

export default {
    data() {
        return {
            dockerImageList: [],
            rules: {
                name: [{required: true, message: '请输入服务器名称', trigger: 'blur'}],
                abbr: [{required: true, message: '请输入服务器名称', trigger: 'blur'},
                    {pattern: /^[a-z_0-9]+$/, message: '只允许由小写字母、下划线、数字组成', trigger: 'blur'}
                ],
                imageId: [{required: true, message: '请选择docker容器', trigger: 'change'}],
                location: [{required: true, message: '请输入服务器位置', trigger: 'blur'}],
                startCommand: [{required: true, message: '请输入启动命令', trigger: 'blur'}],
                workingDir: [{required: true, message: '请输入工作目录', trigger: 'blur'}],
                portBindings: [{required: true, message: '请输入端口映射', trigger: 'blur'}],
                volumeBind: [{required: true, message: '请输入目录映射', trigger: 'blur'}]
            },
            server: {},
            loading: false
        }
    },
    computed: {
        serverSetting: {
            get() {
                return this.$store.state.serverSetting
            },
            set(newVal) {
                this.$store.commit('changeServerSetting', newVal)
            },
        },
    },
    methods: {
        async confirm(server) {
            await api.server.updateSetting(server)
            this.$store.commit('changeServerSetting', false)
            await this.$store.dispatch('refreshServerList')
        },
        close() {
            this.$store.commit('changeServerSetting', false)
        },
        async openDialog() {
            this.loading = true
            const images = await api.setting.images()
            const server = await api.server.serverInfo(this.$store.state.currentServer.id)
            const newServer = {}
            Object.assign(newServer, server)
            newServer.portBindings = Object.entries(server.portBindings).map((it) => {
                return {
                    hostPort: it[0],
                    containerPort: it[1],
                }
            })
            newServer.volumeBind = Object.entries(server.volumeBind).map((it) => {
                return {
                    hostVolume: it[0],
                    containerVolume: it[1],
                }
            })
            this.server = newServer
            const result = []
            for (const image of images) {
                const s = await api.setting.imageStatus(image.id)
                if (s.status === 'Downloaded') {
                    result.push({
                        id: image.id,
                        name: image.name,
                    })
                }
            }
            this.dockerImageList = result
            this.loading = false
        },
        addPortBinding() {
            this.currentServer.portBindings.push({
                hostPort: '',
                containerPort: ''
            })
        },
        removePortBinding(index) {
            this.currentServer.portBindings.splice(index, 1)
        },
        addVolumeBinding() {
            this.currentServer.volumeBind.push({
                hostVolume: '',
                containerVolume: ''
            })
        },
        removeVolumeBinding(index) {
            this.currentServer.volumeBind.splice(index, 1)
        }
    },
}
</script>

<style scoped>
.port-container {
    display: flex;
    flex-direction: row;
    margin-bottom: 5px;
}
</style>
