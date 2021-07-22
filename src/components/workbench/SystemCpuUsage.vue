<!--
 * @Author: WarmthDawn
 * @Date: 2021/7/9
 -->
<template>
  <common-chart-card
    v-loading="loading"
    tooltip-prefix="系统CPU占用："
    :labels="labels"
    :datasets="datasets"
    :value-precision="2"
    value-suffix="%"
    :custom-config="options"
    header="系统CPU使用率 (%)"
  >
    当前： {{ current }}%
  </common-chart-card>
</template>

<script>
import CommonChartCard from '@/components/server/info/common/CommonChartCard.vue'
import api from '@/api'
import {round} from 'lodash'

export default {
    name: 'SystemCpuUsage',
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
            options: {
                scales: {
                    y: {
                        min: 0,
                        max: 100,
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
                this.loading = true
                this.fetchData()
            },
            // 组件创建完后获取数据，
            // 此时 data 已经被 observed 了
            {immediate: true},
        )
        setInterval(this.fetchData, 1000 * 5)
    },
    methods: {
        async fetchData() {
            const data = await api.system.info()
            this.datasets = [
                {
                    name: 'CPU',
                    backgroundColor: '#87CDf944',
                    borderColor: '#409EFFAA',
                    tension: 0.4,
                    fill: true,
                    data: data.cpus.map((it)=>it * 100),
                },
            ]
            this.current = round(data.currentCpu * 100, 2)
            this.labels = data.timestamps
            this.loading = false
        },
    },
}
</script>

<style scoped>

</style>
