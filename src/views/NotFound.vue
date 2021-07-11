<!--
 * @Author: WarmthDawn
 * @Date: 2021/7/6
 -->
<template>
    <el-result title="404" icon="error" suTitle="路径不存在">
        <template #extra>
            <el-button type="primary" size="medium" @click="$router.back()">返回</el-button>
        </template>
    </el-result>
</template>
<script>
export default{
    name: 'NotFound',
}
</script>

<style>
</style>
