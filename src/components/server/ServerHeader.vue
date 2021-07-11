<!--
 * @Author: WarmthDawn
 * @Date: 2021/7/7
 -->
<template>
  <div class="extra-header">
    <h1>{{ name }}</h1>
    <div class="blank"></div>
    <div class="general-status">
      <template  v-if="!running">
        <el-button type="danger" class="button auto-size"
                   @click="removeServer">
          删除
        </el-button>
        <el-button type="success" class="button auto-size"
                   @click="startServer">
          开启
        </el-button>
      </template>
      <template v-else>
        <el-button type="danger" class="button auto-size"
                   @click="closeServer">
          关闭
        </el-button>
        <el-button type="warning" class="button auto-size"
                   @click="restartServer">
          重启
        </el-button>
      </template>
      <el-button v-if="$route.name !== 'info'"
                 type="info" class="button auto-size"
                 @click="$router.push({name:'server', params:{id}})">
        状态
      </el-button>
      <el-button v-if="$route.name !== 'terminal'"
                 type="info" class="button auto-size"
                 @click="$router.push({name:'terminal', params:{id}})">
        终端
      </el-button>
      <el-button type="primary" class="button auto-size"
                 @click="$router.push({name:'files', params:{ filePath:id }})">
        文件
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import api from '@/api'
import utils from '@/utils'

export default {
    name: 'ServerHeader',
    computed: {
        ...mapState(['currentServer']),
        ...utils.mapData('currentServer', ['id', 'name', 'running', 'port', 'tps', 'lastRun', 'onlinePlayer', 'maxPlayer']),
    },
    methods: {
        closeServer() {
            api.server.stop(this.id)
        },
        startServer() {
            api.server.start(this.id)
        },
        restartServer() {
            api.server.restart(this.id)
        },
        removeServer() {
            api.server.remove(this.id)
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
