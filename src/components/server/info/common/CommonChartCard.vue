<!--
 * @Author: WarmthDawn
 * @Date: 2021/7/9
 -->
<template>
  <el-card
    :body-style="{ padding: '0px', borderRadius: '0px' }"
  >
    <div class="common-card">
      <div class="card-header">
        {{ header }}
      </div>
      <div class="card-content">
        <slot />
      </div>
      <line-chart
        :labels="cpLabels"
        :datasets="datasets"
        :options="options"
        class="card-chart"
        @click="$emit('click')"
      />
    </div>
  </el-card>
</template>

<script>
import LineChart from '@/components/common/chart/LineChart.vue'
import { merge, round } from 'lodash'
import { DateTime } from 'luxon'

export default {
    name: 'CommonChartCard',
    components: {
        LineChart,
    },
    props: {
        header: {
            type: String,
            required: true,
        },
        currents: [],
        valuePrecision: Number,
        valueSuffix: {
            type: String,
            default: '',
        },
        tooltipPrefix: {
            type: String,
            default: '',
        },
        customConfig: Object,
        labels: Array,
        datasets: Array,
        rawLabel: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            options: {},
            count: 0,
        }
    },
    computed: {
        cpLabels() {
            if (!Array.isArray(this.labels) || this.labels.length <= 0) return []
            if (this.rawLabel) return this.labels
            if (typeof this.labels[0] === 'number') return this.labels.map((l) => DateTime.fromSeconds(l))
            if (typeof this.labels[0] === 'string') return this.labels.map((l) => DateTime.fromISO(l))
            return this.labels.map((l) => DateTime.fromObject(l))
        },
    },
    watch: {
        labels(value) {
            if (!Array.isArray(value) || value.length <= 0) return
            const step = Math.round(Math.abs(value[value.length - 1] - value[0]) / 5 / 60)
            this.options.scales.x.time.stepSize = Math.max(step, 1)
        },
    },
    mounted() {
        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: false,
                tooltip: {
                    displayColors: false,
                    callbacks: {
                        label: (item) => `${this.tooltipPrefix || `${item.dataset.label}： `}${round(item.raw, this.valuePrecision)}${this.valueSuffix}`,
                    },
                },
            },
            elements: {
                point: {
                    hoverRadius: 8,
                    hitRadius: 8,
                    radius: 0,
                },
            },
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        // Luxon format string
                        unit: 'minute',
                        tooltipFormat: 'DD TT',
                        displayFormats: {
                            minute: 'T',
                        },
                        stepSize: 4,
                    },
                    display: true,
                },
                y: {
                    display: true,
                    ticks: {
                        color: '#909399AA',
                    },
                    min: 0,
                },
            },
        }
        if (typeof this.customConfig !== 'undefined') {
            merge(defaultOptions, this.customConfig)
        }
        this.options = defaultOptions
    },
    methods: {},
}
</script>

<style scoped>
.common-card {
  height: 180px;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.card-header {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
}

.card-content {
  color: rgba(0, 0, 0, .55);
  font-size: 12px;
  margin: 0 0 8px 8px;
}

.card-chart {
  flex: 1 1 0;
  height: 120px;
}

</style>
