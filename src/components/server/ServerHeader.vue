<!--
 * @Author: WarmthDawn
 * @Date: 2021/7/7
 -->
<template>
  <div class="extra-header">
    <h1>{{ name }}</h1>
    <div class="blank" />
    <div class="general-status">
      <template v-if="!running">
        <el-button
          type="danger"
          class="button auto-size"
          @click="removeServer"
        >
          删除
        </el-button>
        <el-button
          type="success"
          class="button auto-size"
          @click="startServer"
        >
          开启
        </el-button>
      </template>
      <template v-else>
        <el-button
          type="danger"
          class="button auto-size"
          @click="closeServer"
        >
          关闭
        </el-button>
        <el-button
          type="warning"
          class="button auto-size"
          @click="restartServer"
        >
          重启
        </el-button>
      </template>
      <el-button
        v-if="$route.name !== 'info'"
        type="info"
        class="button auto-size"
        @click="$router.push({name:'server', params:{id}})"
      >
        状态
      </el-button>
      <el-button
        v-if="$route.name !== 'terminal'"
        type="info"
        class="button auto-size"
        @click="$router.push({name:'terminal', params:{id}})"
      >
        终端
      </el-button>
      <el-button
        type="primary"
        class="button auto-size"
        @click="toFile"
      >
        文件
      </el-button>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import api from '@/api'
import utils from '@/utils'

export default {
    name: 'ServerHeader',
    computed: {
        ...mapState(['currentServer']),
        ...utils.mapData('currentServer', ['id', 'abbr', 'name', 'running', 'port', 'tps', 'lastRun', 'onlinePlayer', 'maxPlayer']),
    },
    methods: {
        async closeServer() {
            this.$message({
                title: '开始关闭',
                message: '服务器正在关闭',
                type: 'info'
            })
            await api.server.stop(this.id)
            this.$message({
                title: '关闭成功',
                message: '服务器已经关闭',
                type: 'success'
            })
            await this.$store.dispatch('refreshServerList')
        },
        async startServer() {
            this.$message({
                title: '正在开启',
                message: '服务器正在开启',
                type: 'info'
            })
            try {
                await api.server.start(this.id)
            } catch (e) {
                this.$message({
                    title: '启动服务器失败',
                    message: e.message,
                    type: 'error'
                })
                this.$store.dispatch('refreshServerList')
                return
            }

            this.$message({
                title: '启动成功',
                message: '服务器已经启动',
                type: 'success'
            })
            await this.$store.dispatch('refreshServerList')
            this.$bus.emit('server-start')
        },
        async restartServer() {
            this.$message({
                title: '正在重启',
                message: '服务器正在重启',
                type: 'info'
            })
            await api.server.restart(this.id)
            this.$message({
                title: '启动成功',
                message: '服务器已经启动',
                type: 'success'
            })
            this.$store.dispatch('refreshServerList')
            this.$bus.emit('server-start')
        },
        async removeServer() {
            await api.server.remove(this.id)
            this.$message({
                title: '删除成功',
                message: '已经删除服务器',
                type: 'success'
            })
            await this.$store.dispatch('refreshServerList')
        },

        async toFile() {
            const path = await api.server.filePath(this.id)
            await this.$router.push({name: 'files', params: {filePaths: path.split('/')}})
        }
    },
}
</script>

<style scoped>
h1 {
    margin: 5px 0;
}

.extra-header {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-end;
}
</style>
