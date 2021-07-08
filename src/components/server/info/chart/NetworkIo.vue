<template>
  <common-chart-card :labels="labels" :datasets="datasets"
                    :value-precision="2" value-suffix=" Mbps"
                    header="网络带宽IO （Mbps）"
                    v-loading="loading"
  ><span>当前：</span>
    <span style="color: #67C23A"><i class="el-icon-upload2"></i>{{ currentUpload }} Mbps</span>
    <span>&nbsp;</span>
    <span style="color: #409EFF"><i class="el-icon-download"></i>{{ currentDownload }} Mbps</span>
  </common-chart-card>
</template>

<script>
import { round } from 'lodash'
import CommonChartCard from '@/components/server/info/common/CommonChartCard.vue'
import api from '@/api'

export default {
    name: 'NetworkIo',
    components: {
        CommonChartCard,
    },
    data() {
        return {
            loading: true,
            labels: [],
            count: 0,
            datasets: [],
            currentUpload: 0,
            currentDownload: 0,
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
            { immediate: true },
        )

        setInterval(this.fetchData, 1000 * 60)
    },
    methods: {
        async fetchData() {
            const data = await api.server.monitor.networks(this.id)
            this.datasets = [
                {
                    name: 'Download',
                    label: '下载',
                    backgroundColor: '#87CDf944',
                    borderColor: '#409EFFAA',
                    tension: 0.4,
                    fill: true,
                    data: data.downloads,
                },
                {
                    name: 'Upload',
                    label: '上传',
                    backgroundColor: 'rgba(121,186,86,0.27)',
                    borderColor: '#67C23AAA',
                    tension: 0.4,
                    fill: true,
                    data: data.uploads,
                },
            ]
            this.currentUpload = round(data.current.upload, 2)
            this.currentDownload = round(data.current.download, 2)
            this.labels = data.timestamps
            this.loading = false
        },
    },
}
</script>

<style scoped>
</style>