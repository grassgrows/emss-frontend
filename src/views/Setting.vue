<template>
    <el-card shadow="always">
        <div class="setting-container">
            <el-form class="form" v-model="systemSetting" style="width: 50%">
                <el-form-item label="系统名称">
                    <el-input v-model="systemSetting.name"></el-input>
                </el-form-item>
                <el-form-item label="Docker容器列表">
                    <el-collapse>
                        <el-collapse-item title="查看docker...">
                            <div v-for="dockerData in systemSetting.dockerList" :key="dockerData">
                                <docker-card :docker-data="dockerData"></docker-card>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </el-form-item>
                <el-form-item label="服务端路径">
                    <el-input v-model="systemSetting.path"></el-input>
                </el-form-item>
            </el-form>
        </div>
    </el-card>
</template>

<script>
import DockerCard from '@/components/setting/dockerCard.vue'
export default {
    name: 'Setting',
    components: {
        DockerCard
    },
    data() {
        return {
            dockerDemo: 'demoDocker',
            systemSetting:{
                name: '',
                dockerList: ['docker1', 'docker2','自定义镜像'],
                path: ''
            }
        }
    }
}
</script>

<style scoped>


</style>