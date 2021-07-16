<template>
  <div ref="xterm" />
</template>

<script>
import {Terminal} from 'xterm'
import {FitAddon} from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import {throttle} from 'lodash'

export default {
    name: 'Xterm',
    emits: ['resize', 'key'],
    data() {
        return {
            terminal: new Terminal(),
            fitAddon: new FitAddon(),
        }
    },
    mounted() {
        this.terminal.loadAddon(this.fitAddon)
        this.terminal.open(this.$refs.xterm)
        this.fitAddon.fit()
        this.terminal.onResize((arg) => this.$emit('resize', arg))
        this.terminal.onKey((arg) => this.$emit('key', arg))

        new ResizeObserver(throttle((entries) => entries
            .filter((e) => e.target === this.$el)
            .forEach(() => this.fitTerm()), 1000)).observe(this.$el)
    },
    methods: {
        fitTerm() {
            if(this.$el.visible) {
                this.fitAddon.fit()
            }
        }
    }
}
</script >

<style scoped >

</style >
