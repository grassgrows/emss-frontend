<template>
  <div ref="xterm" />
</template>

<script>
import {Terminal} from 'xterm'
import {FitAddon} from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import {throttle} from 'lodash'
import {runCatching} from '@/utils/functionUtils'

export default {
    name: 'Xterm',
    emits: ['resize'],
    data() {
        return {
            terminal: {},
            fitAddon: {},
            // attachAddon: undefined,
            disposables: [],
            ws: {},
            written: false
        }
    },
    mounted() {
        this.terminal = new Terminal({
            convertEol: true,
            cursorBlink: true,
        })
        this.fitAddon = new FitAddon()
        this.terminal.loadAddon(this.fitAddon)
        this.terminal.open(this.$refs.xterm)
        this.fitAddon.fit()

        this.terminal.onResize((arg) => this.$emit('resize', arg))
        let curr_line = ''
        this.terminal.prompt = () => {
            this.terminal.write('\r\n')
            this.ws?.send(curr_line)
            this.ws?.send('\r')
            curr_line = ''
        }

        this.terminal.onData((e)=> {
            this.terminal.write(e)
            curr_line += e
        })

        this.terminal.onKey((e) => {
            const ev = e.domEvent
            // const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey

            if (this.written) {
                this.terminal.write(curr_line)
                this.written = false
            }
            if (ev.code === 'Enter') {
                this.terminal.prompt()
            } else if (ev.keyCode === 8) {
                if (curr_line) {
                    curr_line = curr_line.slice(0, curr_line.length - 1)
                    this.terminal.write('\b \b')
                }
            }

        })

        this.terminal.textarea.addEventListener('paste', ev => {
            const paste = (ev.clipboardData || window.clipboardData).getData('text')
            ev.preventDefault()
            const lines = paste.split(/[(\r\n)\r\n]+/).filter((it) => it)
            lines.forEach((it, index) => {
                curr_line += it
                this.terminal.write(it)
                if (index < lines.length - 1) {
                    this.terminal.prompt()
                }
            })

        })

        new ResizeObserver(throttle((entries) => entries
            .filter((e) => e.target === this.$el)
            .forEach(() => this.fitTerm()), 2000)).observe(this.$el)
    },
    beforeUnmount() {
        // runCatching(() => {
        //     this.attachAddon.dispose()
        // })
        this.disposeListeners()
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
            // this.attachAddon && this.attachAddon.dispose()
            // this.attachAddon = new AttachAddon(ws)
            // this.terminal.loadAddon(this.attachAddon)
            this.ws = ws
            this.disposables.push(
                this.addSocketListener(ws, 'message', ev => {
                    const data = ev.data
                    this.terminal.write(typeof data === 'string' ? data : new Uint8Array(data))
                    this.written = true
                })
            )
            this.disposables.push(this.addSocketListener(ws, 'close', () => this.disposeListeners()))
            this.disposables.push(this.addSocketListener(ws, 'error', () => this.disposeListeners()))
        },
        disposeListeners() {
            this.disposables.forEach(d => d.dispose())
            this.disposables = []
        },

        addSocketListener(ws, type, handler) {
            ws.addEventListener(type, handler)
            return {
                dispose: () => {
                    if (!handler) {
                        // Already disposed
                        return
                    }
                    ws.removeEventListener(type, handler)
                }
            }
        }

    }
}
</script>

<style scoped>
</style>
