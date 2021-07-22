<!--
 * @Author: WarmthDawn
 * @Date: 2021/7/9
 -->
<template>
  <common-chart-card
    v-loading="loading"
    tooltip-prefix="系统内存"
    :labels="labels"
    :datasets="datasets"
    :value-precision="2"
    value-suffix=" GB"
    :custom-config="options"
    header="系统内存"
  >
    当前：{{ current }} GB/ {{ max }} GB
  </common-chart-card>
</template>

<script>
import CommonChartCard from '@/components/server/info/common/CommonChartCard.vue'
import {round} from 'lodash'
import api from '@/api'

const GB = 1024.0 * 1024 * 1024
export default {
    name: 'SystemMemoryUsage',
    components: {CommonChartCard},
    props: {
        id: {
            type: Number,
            default: -1,
        }
    },
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
            max: 0,
            labels: [],
            count: 0,
            datasets: [],
        }
    },
    created() {
        this.$watch(
            () => this.$route.params,
            () => {
                this.loading = true
                this.fetchData()
            },
            {immediate: true},
        )
        setInterval(this.fetchData, 1000 * 5)
    },
    methods: {
        async fetchData() {
            const data = await api.system.info()
            this.datasets = [
                {
                    name: 'Memory',
                    backgroundColor: '#87CDf944',
                    borderColor: '#409EFFAA',
                    tension: 0.4,
                    fill: true,
                    data: data.memorys.map((it) => it / GB),
                }
            ]
            this.current = round(data.currentMemory / GB, 2)
            this.max = round(data.maxMemory / GB, 2)
            this.labels = data.timestamps
            this.loading = false
        }
    }
}
</script>

<style scoped>

</style>
