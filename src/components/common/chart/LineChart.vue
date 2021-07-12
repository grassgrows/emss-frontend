<!--
 * @Author: WarmthDawn
 * @Date: 2021/7/8
 -->
<template>
  <div>
    <canvas ref="line_chart" />
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default {
    name: 'LineChart',
    props: [
        'options',
        'labels',
        'datasets',
    ],
    data() {
        return {}
    },
    watch: {
        options(value) {
            this.chart.options = value
            this.chart.update()
        },
        labels(value) {
            if (typeof this.chart === 'undefined') {
                return
            }
            this.chart.data.labels = value
            this.chart.update()
        },
        datasets(value) {
            if (typeof this.chart === 'undefined') {
                return
            }
            const len = value.length
            if (this.chart.data.datasets.length !== len) {
                this.chart.data.datasets = value
            } else {
                for (let i = 0; i < len; i++) {
                    this.chart.data.datasets[i].data = value[i].data
                }
            }
            this.chart.update()
        },
    },
    mounted() {
        const chart = new Chart(this.$refs.line_chart, {
            type: 'line',
        })
        chart.draw()
        this.chart = chart
    },
    unmounted() {
        this.chart.clear()
    },
    methods: {
        getRandomInt() {
            return Math.floor(Math.random() * (50 - 5 + 1)) + 5
        },
    },
}
</script>

<style scoped>

</style>