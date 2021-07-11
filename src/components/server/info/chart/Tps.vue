<!--
 * @Author: smq
 * @Date: 2021/7/9
 -->
<template>
  <common-chart-card
    v-loading="loading"
    tooltip-prefix="TPS: "
    :labels="labels"
    :datasets="datasets"
    :value-precision="2"
    :custom-config="options"
    header="服务器TPS"
  >
    当前：{{ current }}
  </common-chart-card>
</template>

<script>
import CommonChartCard from '@/components/server/info/common/CommonChartCard'
import { round } from 'lodash'
import api from '@/api'

export default {
    name: 'Tps',
    components: {
        CommonChartCard
    },
    data() {
        return {
            options: {
                scales: {
                    y: {
                        min: 0,
                        max: 20,
                    }
                }
            },

            loading: true,
            current: 0,
            labels: [],
            count: 0,
            datasets: []
        }
    },
    created() {
        this.$watch(
            () => this.$route.params,
            () => {
                this.loading = true
                this.fetchData()
            },
            { immediate: true}
        )
        setInterval(this.fetchData,1000*60)
    },
    methods: {
        async fetchData() {
            const data = await api.server.monitor.tpses(this.id)
            this.datasets = [
                {
                    name: 'Tps',
                    backgroundColor: '#87CDf944',
                    borderColor: '#409EFFAA',
                    tension: 0.4,
                    fill: true,
                    data: data.values,
                },
            ]
            this.current = round(data.current, 2)
            this.labels = data.timestamps
            this.loading = false
        },
    }

}
</script>

<style scoped>

</style>