<template>
  <div ref="xterm" />
</template>

<script>
import {Terminal} from 'xterm'
import {FitAddon} from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import {throttle} from 'lodash'
import {runCatching} from '@/utils/functionUtils'
import {AttachAddon} from 'xterm-addon-attach/src/AttachAddon'

export default {
    name: 'Xterm',
    emits: ['resize'],
    data() {
        return {
            terminal: {},
            fitAddon: {},
            attachAddon: undefined,
        }
    },
    mounted() {
        this.terminal = new Terminal({
            convertEol: true,
        })
        this.fitAddon = new FitAddon()
        this.terminal.loadAddon(this.fitAddon)
        this.terminal.open(this.$refs.xterm)
        this.fitAddon.fit()

        this.terminal.onResize((arg) => this.$emit('resize', arg))

        new ResizeObserver(throttle((entries) => entries
            .filter((e) => e.target === this.$el)
            .forEach(() => this.fitTerm()), 2000)).observe(this.$el)
    },
    beforeUnmount() {
        runCatching(() => {
            this.attachAddon.dispose()
        })
        runCatching(() => {
            this.terminal.dispose()
        })
        runCatching(() => {
            this.fitAddon.dispose()
        })

    },
    methods: {
        fitTerm() {
            runCatching(() => {
                this.fitAddon.fit()
            })
        },

        initTerm(ws) {
            this.attachAddon && this.attachAddon.dispose()
            this.attachAddon = new AttachAddon(ws)
            this.terminal.loadAddon(this.attachAddon)
        }
    }
}
</script>

<style scoped>
</style>
