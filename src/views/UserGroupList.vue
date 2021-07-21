<!--
 * @Author: smq
 * @Date: 2021/7/19
 -->
<template>
  <div class="user-group-list">
    <div
      v-for="u in userGroupList"
      :key="u"
      class="list-container"
    >
      <user-group-list-item
        v-model:server-list="serverAbbrList"
        :user-group="u"
        :user-list="userList"
      />
    </div>
  </div>
</template>
<script>
import UserGroupListItem from '@/components/user/UserGroupListItem.vue'
import api from '@/api'

export default {
    name: 'Users',
    components: {
        UserGroupListItem,
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => vm.refresh())
    },
    data() {
        return {
            serverAbbrList: [],
            userGroupList: [],
            userList: [],
        }
    },
    methods: {
        async refresh() {
            this.userGroupList = await api.userGroup.getGroupList()
            this.serverAbbrList = await api.userGroup.getAbbrList()
            this.userList = await api.userGroup.getUserList()
        }
    }
}
</script>

<style scoped lang="less">
.user-group-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
.list-container {
    width: 50%;
    @media screen and (max-width: 768px) {
      width: 100%;
    }
}
</style>
