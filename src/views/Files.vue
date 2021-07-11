<!--
 * @Author: smq
 * @Date: 2021/7/11
 -->
<template>
  <div class="files">
    <FileList />
  </div>
</template>

<script>
import FileList from '@/views/file/FileList'
import file from '@/api/file'

export default {
    name: 'Files',
    components: {
        FileList
    },
    beforeRouteEnter(to, from, next){
        next((vm)=> vm.refresh())
    },
    beforeRouteUpdate() {
        this.refresh()
    },
    data() {
        return {
            files: []
        }
    },
    methods: {
        refresh() {
            this.files = file.getFiles(this.$route.params.filePath).files
        }
    }
}
</script>

<style scoped>

</style>