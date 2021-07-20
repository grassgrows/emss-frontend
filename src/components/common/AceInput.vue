<template>
  <div class="edit-container">
    <div class="editor" ref="ace"></div>
  </div>
</template>

<script>
import ace from 'ace-builds'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/webpack-resolver'
export default {
    name: 'AceInput',
    props: {
        value: {
            type: String,
            default: () => ''
        }
    },
    emits: ['update:value'],
    data() {
        return {
            editor: {}
        }
    },
    watch: {
    },
    mounted() {
        const editor = ace.edit(this.$refs.ace, {
            // minLines: 20, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
            fontSize: 14, // 编辑器内字体大小
            theme: 'ace/theme/github', // 默认设置的主题
            tabSize: 4 // 制表符设置为 4 个空格大小
        })
        this.editor = editor
        this.editor.on('input', ()=>this.$emit('update:value', this.editor.getValue()))
    }
}
</script>

<style scoped>
.editor {
    height: 100%;
}
</style>