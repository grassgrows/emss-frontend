<!--
 * @Author: smq
 * @Date: 2021/7/9
 -->
<template>
  <common-chart-card
    v-loading="loading"
    tooltip-prefix="在线玩家数："
    :labels="labels"
    :datasets="datasets"
    :value-precision="2"
    value-suffix=" 人"
    :custom-config="options"
    header="服务器在线玩家"
  >
    当前： {{ current }} 人在线
  </common-chart-card>
</template>

<script>
import CommonChartCard from '@/components/server/info/common/CommonChartCard'
import api from '@/api'
import { round } from 'lodash'

export default {
    name: 'OnlineNumber',
    components: {
        CommonChartCard
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
                    }
                }
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
            { immediate : true }
        )
        setInterval(this.fetchData, 1000*60)
    },
    methods: {
        async fetchData() {
            const data = await api.server.monitor.onlineNumbers(this.id)
            this.datasets = [
                {
                    name: 'OnlineNumber',
                    backgroundColor: '#87CDf944',
                    borderColor: '#409EFFAA',
                    fill: true,
                    data: data.values,
                },
            ],
            this.current = round(data.current, 2)
            this.labels = data.timestamps
            this.loading = false
        }
    }
}
</script>

<style scoped>

</style>
