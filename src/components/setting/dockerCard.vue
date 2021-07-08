<template>
    <el-card shadow="hover">
        <div class="docker-card">
            {{ dockerData }}
            <div class="blank"></div>
            <div><el-button size="medium" round>下载</el-button></div>
        </div>
    </el-card>
</template>

<script>
export default {
    name: 'DockerCard',
    props: {
        dockerData: Object
    }
}
</script>

<style scoped>
.docker-card{
    display: flex;
}

</style>