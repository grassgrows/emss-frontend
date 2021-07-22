<!--
 * @Author: WarmthDawn、
 * @Date: 2021/7/22
 -->
<template>
  <div class="container">
    <div class="header">
      <div class="card">
        <h3>{{ displayHello }}， WarmthDawn， 今天服务器也在正常运行中</h3>
        <p class="run">
          服务器已经运行了 {{ runningTime.days }} 天 {{ runningTime.hours }} 小时 {{ runningTime.minutes }} 分 {{
            runningTime.seconds
          }} 秒
        </p>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <div class="card stat">
          <div class="desc">
            <p>服务器状态概览</p>
          </div>
          <div class="space"></div>
          <div class="wrapper">
            <el-divider direction="vertical"></el-divider>
            <statistic
              title="管理员数量"
              :value="users"
              class="statistic"
              reverse
              content-style="color: #67C23A;"
            />
            <el-divider direction="vertical"></el-divider>
            <statistic
              title="运行中服务器"
              :value="running"
              class="statistic"
              reverse
              content-style="color: #67C23A;"
            />
            <el-divider direction="vertical"></el-divider>
            <statistic
              title="已关闭服务器"
              :value="stopped"
              class="statistic"
              reverse
              content-style="color: #F56C6C;"
            />
            <el-divider direction="vertical"></el-divider>
            <statistic
              title="服务器总数"
              :value="total"
              class="statistic"
              reverse
              content-style="color: #409EFF;"
            />
            <el-divider direction="vertical"></el-divider>
          </div>
        </div>
        <div class="card alerts">
          <div class="title">服务器消息通知</div>
          <div v-if="alerts.length <= 0">
            <el-alert
              :closable="false"
              title="暂时没有消息通知哦"
              center
            ></el-alert>
          </div>
          <div>

            <el-alert
              v-for="(a, index) in alerts"
              :key="index"
              :closable="false"
              :description="formatTime(a.time)"
              :title="a.msg"
              :type="a.level.toLowerCase()"
            ></el-alert>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="system">
          <system-cpu-usage />
        </div>
        <div class="system">
          <system-memory-usage />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import SystemMemoryUsage from '@/components/workbench/SystemMemoryUsage'
import SystemCpuUsage from '@/components/workbench/SystemCpuUsage'
import Statistic from '@/components/common/Statistic'
import {mapState} from 'vuex'
import api from '@/api'
import {DateTime} from 'luxon'

export default {
    name: 'Workbench',
    components: {
        SystemCpuUsage,
        SystemMemoryUsage,
        Statistic
    },
    data() {
        return {
            users: 0,
            alerts: [],
            startingTime: DateTime.now(),
            runningTime: 0,

            timer: 0,
        }
    },
    computed: {
        ...mapState(['serverList']),
        running() {
            return this.serverList.filter((s) => s.running).length
        },
        stopped() {
            return this.serverList.filter((s) => !s.running).length
        },
        total() {
            return this.serverList.length
        },

        displayHello() {
            const time = DateTime.now().hour
            if (time < 4) {
                return '夜深了'
            }
            if (time < 7) {
                return '起的好早啊'
            }
            if (time < 10) {
                return '早上好'
            }
            if (time < 13) {
                return '记得吃午饭'
            }
            if (time < 17) {
                return '下午好'
            }
            if (time < 20) {
                return '晚上好'
            }
            return '晚安'
        }
    },
    mounted() {
        api.userGroup.getUserList().then((val) => {
            this.users = val.length ?? 0
        })

        api.system.notifications().then((val) => {
            this.alerts = val ?? []
        })

        api.system.startingTime().then((val) => {
            this.startingTime = DateTime.fromISO(val)

            if (this.timer) {
                clearInterval(this.timer)
            }
            this.timer = setInterval(() => {
                this.runningTime = DateTime.now().diff(this.startingTime, ['hours', 'minutes', 'seconds', 'days', 'milliseconds'])
            }, 1000)
        })
    },
    methods: {
        formatTime(time) {
            return DateTime.fromISO(time).toFormat('DDDD TT')
        }
    },
    beforeUnmount() {
        if (this.timer) {
            clearInterval(this.timer)
        }
    }

}
</script>

<style
  scoped
  lang="less"
>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;

  .content {
    display: flex;
    flex: auto;

    .left {
      flex: auto;
    }

  }
}

.extra-header {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.card {
  margin: 5px 16px 24px;
  box-sizing: border-box;
  padding: 10px 30px;
  background-color: rgba(255, 255, 255, 0.8);
}

.title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
}

.stat {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;

  .desc {
    font-size: 18px;
    font-weight: bold;
  }

  .space {
    flex: auto;
  }

  .wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: stretch;
    padding: 0 20px;

    .el-divider {
      margin: 16px 8px;
      height: auto;
    }

    .statistic {
      padding: 5px 16px;
      width: 100px;
    }
  }
}

.alerts {
  display: flex;
  flex-direction: column;


  & > div {

    & > div {
      margin: 5px 0;
    }

    display: flex;
    flex-direction: column;
  }
}

.system {
  margin: 5px 16px 24px;
}

.header {
  .card {
    margin: 0 0 16px;
  }

  p.run {
    text-align: right;
    color: rgba(0, 0, 0, .5);
  }
}

</style>
