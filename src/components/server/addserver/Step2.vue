<template>
    <div class="step2">
       <el-form class="form" label-width="100px" label-position="left">
           <el-form-item label="Docker镜像" class="input-style">
               <el-select v-model="selectedDocker" placeholder="请选择..." style="width: 100%;">
                   <el-option
                       v-for="docker in dockerList"
                       :key="docker"
                       :label="docker"
                       :value="docker"
                   ></el-option>
               </el-select>
           </el-form-item>
           <el-form-item label="服务器位置" class="input-style">
               <el-input></el-input>
           </el-form-item>
           <el-form-item label="启动命令" class="input-style">
               <el-input></el-input>
           </el-form-item>
           <el-form-item label="端口映射" class="input-style">
               <el-space spacer=":" style="width: 100%">
                   <el-input placeholder="主机端口"></el-input>
                   <el-input placeholder="容器端口"></el-input>
               </el-space>
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
.input-style{
    width: 90%;
}
</style>
