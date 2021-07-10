<template>
  <el-card :body-style="{ padding: '0px'}"
           shadow="hover">
    <div class="list-card">
      <div class="add-card card-container"
           @click="$emit('add')"
           v-if="addCard">
        <i class="iconfont emss-icon-plus"></i>
        <span>添加服务器</span>
      </div>
      <div class="card-container" v-else-if="loading">
        <el-skeleton loading/>
      </div>
      <template v-else>
        <div class="card-container"
             @click="$router.push({name:'server', params:{id}})">
          <div>
            <div class="server-name">
              <el-tooltip :disabled="!showPop" effect="dark" :content="name">
                <h4 ref="name">{{ name }}</h4>
              </el-tooltip>
            </div>
            <div class="blank"></div>
            <el-tag type="success" class="status-tag" v-if="running">运行中</el-tag>
            <el-tag type="info" class="status-tag" v-else>已关闭</el-tag>
          </div>
          <el-divider style="margin: 0"></el-divider>
          <div class="infos">
            <statistic title="映射端口" :value="port"></statistic>
            <template v-if="running">
              <statistic title="在线玩家" :value="`${onlinePlayer} / ${maxPlayer}`"></statistic>
              <statistic title="TPS" :value="tps" :precision="3"
                         :content-style="tpsStyle"
              ></statistic>
            </template>
            <template v-else>
              <statistic title="最后启动时间" :value="lastRun" :format="formatLastRun"
                         :content-style="{ fontSize : '20px', paddingTop: '4px'}"
              ></statistic>
            </template>
          </div>
        </div>
        <el-button-group class="bottom">
          <el-button type="text" class="button auto-size color-danger"
                     @click="closeServer" v-if="running">
            关闭
          </el-button>
          <el-button type="text" class="button auto-size color-success"
                     @click="startServer" v-else>
            开启
          </el-button>
          <template v-if="running">
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" class="button auto-size color-warn"
                       @click="restartServer">
              重启
            </el-button>
          </template>
          <el-divider direction="vertical"></el-divider>
        </el-button-group>
      </template>
    </div>
  </el-card>
</template>

<script>
import Statistic from '@/components/common/Statistic.vue'
import utils from '@/utils'
import api from '@/api'
import { DateTime } from 'luxon'
export default {
    name: 'ServerListCard',
    components: { Statistic },
    props: {
        addCard: {
            type: Boolean,
            default: false,
        },
        serverData: Object,
    },
    computed: {
        ...utils.mapData('serverData',['id','name','running','port','tps','lastRun','onlinePlayer','maxPlayer']),
        showPop() {
            return this.name.gblen() > 20
        },

        tpsStyle() {
            if (this.tps >= 19) {
                return { color: '#67C23A' }
            }
            if (this.tps >= 14) {
                return { color: '#409EFF' }
            }
            if (this.tps >= 9) {
                return { color: '#909399' }
            }
            if (this.tps >= 4) {
                return { color: '#E6A23C' }
            }
            return { color: '#F56C6C' }
        }
    },
    mounted() {
        this.loading = false
    },
    data() {
        return {
            loading: true
        }
    },
    methods: {
        formatLastRun(date) {
            let dateObj
            if(typeof date === 'number') dateObj = DateTime.fromSeconds(date)
            else if(typeof date === 'string') dateObj = DateTime.fromISO(date)
            else if(typeof date instanceof Date) dateObj = DateTime.fromJSDate(date)
            else dateObj = DateTime.fromObject(date)
            DateTime.fromISO()

            return dateObj.toFormat('D T')
        },
        closeServer() {
            api.server.stop(this.id)
        },
        startServer() {
            api.server.start(this.id)
        },
        restartServer() {
            api.server.restart(this.id)
        }
    }
}
</script>

<style scoped>

.infos {
  justify-content: space-between;
}

.infos div {
  padding: 12px 0 0;
}

.server-name {
  width: 70%;
}

.status-tag {
  transform: translate(8px, -8px);
  flex: 0 0 1;
}

.server-name h4 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 5px;
}

.list-card {
  height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-container {
  padding: 16px;
  cursor: pointer;
  flex: 1 1 0;
}

.card-container div {
  display: flex;
}

.add-card {
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  color: rgba(1, 1, 1, 0.6);
}

.add-card:active {
  background-color: #f2f2f2;
}

.add-card i, .add-card span {
  margin: 0 8px;
  font-size: 24px;
}

.bottom {
  width: 100%;
  display: flex;
  align-items: center;
  background-color: #FAFAFA;
}

.button:hover {
  background-color: #F7F7F7;
}

.button:active {
  opacity: 0.6;
}

.bottom .el-divider {
  margin: 0 1px;
}

</style>

