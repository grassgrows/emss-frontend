<!--
 * @Author: WarmthDawn
 * @Date: 2021/7/9
 -->
<template>
  <common-chart-card
    v-loading="loading"
    :labels="labels"
    :datasets="datasets"
    :value-precision="3"
    value-suffix=" KB/s"
    header="磁盘IO （KB/s）"
  >
    <span>当前：</span>
    <span style="color: #409EFF">读 {{ currentRead }} KB/s</span>
    <span>&nbsp;&nbsp;</span>
    <span style="color: #67C23A">写 {{ currentWrite }} KB/s</span>
  </common-chart-card>
</template>

<script>
import {round} from 'lodash'
import CommonChartCard from '@/components/server/info/common/CommonChartCard.vue'
import api from '@/api'

export default {
    name: 'FileIo',
    components: {
        CommonChartCard,
    },
    props: {
        id: {
            type: Number,
            default: -1
        }
    },
    data() {
        return {
            labels: [],
            count: 0,
            datasets: [],
            loading: true,
            currentRead: 0,
            currentWrite: 0,
        }
    },
    created() {
        this.$watch(
            () => this.$route.params,
            () => {
                this.loading = true
                this.fetchData()
            },
            // 组件创建完后获取数据，
            // 此时 data 已经被 observed 了
            {immediate: true},
        )
        setInterval(this.fetchData, 1000 * 60)
    },
    methods: {
        async fetchData() {
            const data = await api.server.monitor.disks(this.id)
            this.datasets = [
                {
                    name: 'Read',
                    label: '读',
                    backgroundColor: '#87CDf944',
                    borderColor: '#409EFFAA',
                    tension: 0.4,
                    fill: true,
                    data: data.reads,
                },
                {
                    name: 'Write',
                    label: '写',
                    backgroundColor: 'rgba(121,186,86,0.27)',
                    borderColor: '#67C23AAA',
                    tension: 0.4,
                    fill: true,
                    data: data.writes,
                },
            ]
            this.currentWrite = round(data.current.write, 2)
            this.currentRead = round(data.current.read, 2)
            this.labels = data.timestamps
            this.loading = false
        },
    },
}
</script>

<style scoped>
</style>
