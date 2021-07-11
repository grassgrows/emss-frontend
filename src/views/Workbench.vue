<!--
 * @Author: smq
 * @Date: 2021/7/5
 -->
<template>
  <h1>主页</h1>
</template>

<script>

export default {
    name: 'Workbench',
    mounted() {
        this.$store.commit('refreshServerList')
    },

}
</script>

<style scoped>

</style>