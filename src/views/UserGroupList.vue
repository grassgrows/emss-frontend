<!--
 * @Author: smq
 * @Date: 2021/7/19
 -->
<template>
  <div class="user-group-list">
    <div
      v-for="u in userGroupList"
      :key="u.id"
      class="list-container"
    >
      <user-group-list-item
        @refresh="refresh"
        :data="u"
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
        next((vm) => vm.refreshAll())
    },
    data() {
        return {
            userGroupList: [],
        }
    },
    methods: {
        async refreshAll() {
            this.userGroupList = await api.userGroup.getGroupList()
        },
        async refresh(id) {
            for(let i=0;i<this.userGroupList.length;i++){
                if(this.userGroupList[i].id === id){
                    this.userGroupList[i] = await api.userGroup.getGroupInfo(id)
                    break
                }
            }
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
