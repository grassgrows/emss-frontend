<!--
 * @Author: smq
 * @Date: 2021/7/7
 -->
<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
import store from '@/store'

function processRoute(to, next) {
    const { serverList } = store.state
    for (let i = 0; i < serverList.length; i++) {
        const s = serverList[i]
        if (s.abbr === to.params.abbr) {
            store.commit('setServer', s)
            return next()
        }
    }
    return next({ path: '/404' })
}

export default {
    name: 'server',
    data() {
        return {}
    },
    beforeRouteEnter(to, from, next) {
        processRoute(to, next)
    },
    beforeRouteUpdate(to, from, next) {
        processRoute(to, next)
    },
}
</script>

<style scoped>

</style>
