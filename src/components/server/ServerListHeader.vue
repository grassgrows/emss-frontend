<!--
 * @Author: WarmthDawn
 * @Date: 2021/7/9
 -->
<template>
    <div class="extra-header">
        <h1>服务器列表</h1>
        <div class="blank"></div>
        <div class="general-status">
            <statistic title="运行中" :value="running"
                       class="statistic" reverse
                       contentStyle="color: #67C23A;"
            ></statistic>
            <statistic title="已停止" :value="stopped"
                       class="statistic" reverse
                       contentStyle="color: #F56C6C;"
            ></statistic>
            <statistic title="总共" :value="total"
                       class="statistic" reverse
                       contentStyle="color: #409EFF;"
            ></statistic>
        </div>
    </div>
</template>

<script>
import Statistic from '@/components/common/Statistic.vue'
import { mapState } from 'vuex'

export default {
    name: 'ServerListHeader',
    components: { Statistic },
    computed: {
        ...mapState(['serverList']),
        running() {
            return this.serverList.filter((s)=>s.running).length
        },
        stopped() {
            return this.serverList.filter((s)=>!s.running).length
        },
        total() {
            return this.serverList.length
        }
    }
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

.general-status {
  display: flex;
  flex-direction: row;
  padding: 0 20px;
}

.general-status .statistic {
  padding: 5px 20px;
  width: 50px;
}

@media screen and (max-width: 768px) {
  .general-status .statistic {
    padding: 0 10px;
  }
}
</style>
