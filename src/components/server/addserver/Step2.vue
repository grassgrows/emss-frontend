<template>
    <div class="step2">
       <el-form>
           <el-form-item label="Docker镜像">
               <el-select v-model="selectedDocker" placeholder="请选择...">
                   <el-option
                       v-for="docker in dockerList"
                       :key="docker"
                       :label="docker"
                       :value="docker"
                   ></el-option>
               </el-select>
           </el-form-item>
           <el-form-item label="服务器位置">
               <el-input></el-input>
           </el-form-item>
           <el-form-item label="启动命令">
               <el-input></el-input>
           </el-form-item>
       </el-form>
    </div>
</template>

<script>
export default {
    name: 'Step2',
    props: {
        clearData: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        clearData: function () {
            this.selectedDocker = ''
        }
    },
    data() {
        return {
            selectedDocker: '',
            dockerList: ['docker1','docker2','docker3']
        }
    }
}
</script>

<style scoped>

</style>