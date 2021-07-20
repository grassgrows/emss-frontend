<!--
 * @Author: smq
 * @Date: 2021/7/19
 -->
<template>
  <div class="list-item">
    <el-card
      shadow="always"
      class="user-card"
    >
      <template #header>
        <span>{{ userGroup.groupName }}</span>
      </template>
      <div class="server-group">
        <el-space wrap>
          <el-tag
            v-for="serverAbbr in userGroup.serverName"
            :key="serverAbbr"
            closable
            @close="removeServer(serverAbbr)"
            @click="$router.push({name:'server', params:{serverAbbr}})"
          >
            {{ server.resizeTo(8, '..') }}
          </el-tag>
          <el-select
            v-if="selectVisible"
            v-model="newServer"
          >
            <el-option
              v-for="serverAbbr in serverAbbrList"
              :key="serverAbbr"
              :label="serverAbbr"
              :value="serverAbbr"
            />
          </el-select>
          <el-button
            v-if="selectVisible"
            size="medium"
            @click="addServer"
          >
            确认
          </el-button>
          <el-button
            v-else
            size="medium"
            @click="showSelect"
          >
            + 服务器
          </el-button>
        </el-space>
      </div>
      <div class="user-table">
        <el-table
          :data="members"
          style="width: 100%"
          @update:data="$emit('update:members', $event)"
        >
          <el-table-column
            label="用户"
            align="center"
          >
            <template #default="scope">
              <span>{{ scope.row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="权限"
            align="center"
          >
            <template #default="scope">
              <el-select
                v-if="editing.has(scope.row.id)"
                v-model="scope.row.permissionLevel"
              >
                <el-option
                  v-for="level in userGroup.maxPermissionLevel"
                  :key="level"
                  :label="level"
                  :value="level"
                />
              </el-select>
              <span v-else>{{ scope.row.permissionLevel }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
          >
            <template #default="scope">
              <el-button
                v-if="editing.has(scope.row.id)"
                type="text"
                size="medium"
                @click="toggleEditing(scope.row.id, false)"
              >
                确认
              </el-button>
              <el-button
                v-else
                type="text"
                @click.prevent="toggleEditing(scope.row.id, true)"
              >
                编辑权限
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="bottom-button">
        <div class="blank" />
        <el-button
          type="text"
          @click="showManagerUser=true"
        >
          管理用户
        </el-button>
      </div>
    </el-card>
  </div>
  <el-dialog
    v-model="showManagerUser"
    title="管理用户"
  >
    <el-transfer
      v-model="userIds"
      :data="userList"
      :titles="['可选用户','当前用户']"
      :props="{
        key: 'id',
        label: 'username'
      }"
    />
    <template #footer>
      <el-button @click="manageUser">
        确认
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
    name: 'UserGroupListItem',
    props: {
        userGroup: {
            type: Object,
            default: () => ({}),
        },
        serverAbbrList: {
            type: Array,
            default: () => [],
        },
        userList: {
            type: Array,
            default: () => [],
        }
    },
    data() {
        const getUserIds = () => {
            const ids = []
            this.userGroup.members.forEach((element) => {
                ids.push(element.id)
            })
            return ids
        }
        return {
            selectVisible: false,
            newServer: '',
            members: this.userGroup.members,
            editing: new Set(),
            showManagerUser: false,
            userIds: getUserIds(),
        }
    },
    methods: {
        showSelect() {
            this.selectVisible = true
        },
        addServer() {
            this.selectVisible = false
            // eslint-disable-next-line vue/no-mutating-props
            // this.serverList.push(this.newServer);
            this.$emit('update:serverList', this.serverAbbrList)
        },
        toggleEditing(id, value) {
            if (value) {
                this.editing.add(id)
            } else {
                this.editing.delete(id)
            }
        },
        removeServer(server) {
            console.log(server)
        },
        manageUser() {
            console.log('manage user')
        },
    },
}
</script>

<style scoped>
.user-card {
    height: fit-content;
    width:100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.list-item {
    margin: 16px;
}

.server-group, .user-table{
    margin-bottom: 10px;
}
.bottom-button {
    display: flex;
    flex-direction: row;
}
</style>