<template>
  <common-chart-card tooltip-prefix="内存使用量"
                    :labels="labels" :datasets="datasets"
                    :value-precision="2" value-suffix=" GB"
                    :customConfig="options"
                    header="内存使用量 (GB)"
                    v-loading="loading">
    当前：{{ current }} GB
  </common-chart-card>
</template>

<script>
import CommonChartCard from '@/components/server/info/common/CommonInfoCard'
import { round } from 'lodash'
import api from '@/api'
export default {
    name: 'MemoryUsage',
    components: { CommonChartCard },
    data() {
        return {
            options: {
                scales: {
                    y: {
                        min: 0,
                    },
                },
            },
        
            loading: true,
            current: 0,
            labels: [],
            count: 0,
            datasets: [],
        }
    },
    created() {
        this.$watch(
            () => this.$route.params,
            () => {
                this.loading = true,
                this.fetchData()
            },
            { immediate: true },
        )
        setInterval(this.fetchData,1000*60)
    },
    methods: {
        async fetchData() {
            const data = await api.server.monitor.memorys(this.id)
            this.datasets = [
                {
                    name: 'Memory',
                    backgroundColor: '#87CDf944',
                    borderColor: '#409EFFAA',
                    tension: 0.4,
                    fill: true,
                    data: data.values,
                }
            ]
            this.current = round(data.current, 2)
            this.labels = data.timestamps
            this.loading = false
        }
    }
}
</script>

<style scoped>

</style>