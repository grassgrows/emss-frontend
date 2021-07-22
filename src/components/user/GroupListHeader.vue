<!--
 * @Author: smq
 * @Date: 2021/7/19
 -->
<template>
  <div class="list-header">
    <h1>管理员组列表</h1>
    <div class="blank" />
    <div class="button-group">
      <el-button
        type="primary"
        plain
        icon="el-icon-user"
        @click="showAddUser=true"
      >
        添加管理员
      </el-button>
      <el-button
        type="success"
        plain
        icon="el-icon-plus"
        @click="showAddGroup=true"
      >
        创建管理员组
      </el-button>
    </div>
  </div>
  <el-dialog
    v-model="showAddUser"
    title="创建新用户"
  >
    <el-form
      :model="newUser"
      label-position="left"
      label-width="80px"
    >
      <el-form-item label="用户名">
        <el-input v-model="newUser.username" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input
          v-model="newUser.password"
          type="password"
        />
      </el-form-item>
      <el-form-item label="权限等级">
        <el-select v-model="newUser.permissionLevel">
          <el-option
            v-for="level in permissionList"
            :key="level"
            :label="level"
            :value="level"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showAddUser=false">
        取消
      </el-button>
      <el-button
        type="primary"
        @click="createUser"
      >
        确认
      </el-button>
    </template>
  </el-dialog>
  <el-dialog
    v-model="showAddGroup"
    title="创建管理员组"
  >
    <el-form
      :model="newGroup"
      label-position="left"
      label-width="80px"
    >
      <el-form-item label="组名">
        <el-input v-model="newGroup.groupName" />
      </el-form-item>
      <el-form-item label="最大权限">
        <el-select v-model="newGroup.maxPermissionLevel">
          <el-option
            v-for="level in permissionList"
            :key="level"
            :label="level"
            :value="level"
          />
        </el-select>
      </el-form-item>
      <template #footer>
        <el-button @click="showAddGroup=false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="createGroup"
        >
          确认
        </el-button>
      </template>
    </el-form>
  </el-dialog>
</template>

<script>
import api from '@/api'

export default {
    name: 'GroupListHeader',
    data() {
        return {
            permissionList: [0, 1, 2, 3, 4],
            showAddUser: false,
            showAddGroup: false,
            newUser: {},
            newGroup: {},
        }
    },
    methods: {
        createGroup() {
            this.showAddGroup = false
            console.log('add group')
        },
        async createUser() {
            await api.userGroup.createUser(this.newUser)
            this.newUser = {}
            this.showAddUser = false
        },
    },
}
</script>

<style scoped>
.list-header {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-end;
}

.button-group {
    display: flex;
    flex-direction: row;
    align-items: center;
}
</style>
