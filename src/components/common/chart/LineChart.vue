<template>
  <div>
    <canvas ref="line_chart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chartjs'

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
    methods: {
        getRandomInt() {
            return Math.floor(Math.random() * (50 - 5 + 1)) + 5
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
}
</script>

<style scoped>

</style>