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
        v-model:server-list="serverList"
        :user-group="u"
      />
    </div>
  </div>
</template>
<script>
import UserGroupListItem from '@/components/user/UserGroupListItem.vue'

export default {
    name: 'Users',
    components: {
        UserGroupListItem,
    },
    data() {
        return {
            serverList: ['1', '2', '3'],
            userGroupList: [
                {
                    id: 1,
                    groupName: '组1',
                    maxPermissionLevel: 5,
                    members: [
                        {
                            id: 1,
                            username: '张三',
                            permissionLevel: '1',
                        },
                        {
                            id: 2,
                            username: '李四',
                            permissionLevel: '2',
                        },
                        {
                            id: 3,
                            username: '王五',
                            permissionLevel: '3',
                        },
                    ],
                    serverName: ['s1111', 's21111111111111', '11111s3'],
                },
                {
                    id: 2,
                    groupName: '组2',
                    maxPermissionLevel: 5,
                    members: [
                        {
                            id: 1,
                            username: '张三1',
                            permissionLevel: '1',
                        },
                        {
                            id: 2,
                            username: '李四1',
                            permissionLevel: '2',
                        },
                        {
                            id: 3,
                            username: '王五1',
                            permissionLevel: '3',
                        },
                    ],
                    serverName: ['s1', 's2', 's3'],
                },
                {
                    id: 3,
                    groupName: '组3',
                    maxPermissionLevel: 5,
                    members: [
                        {
                            id: 1,
                            username: '张三2',
                            permissionLevel: '1',
                        },
                        {
                            id: 2,
                            username: '李四2',
                            permissionLevel: '2',
                        },
                        {
                            id: 3,
                            username: '王五2',
                            permissionLevel: '3',
                        },
                    ],
                    serverName: ['s1', 's2', 's3'],
                },
            ],
        }
    },
}
</script>

<style scoped>
.user-group-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
.list-container {
    width: 50%;
}
</style>
