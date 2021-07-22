<!--
 * @Author: WarmthDawn
 * @Date: 2021/7/6
 -->
<template>
  <div class="my-header-nav">
    <div
      class="button small"
      @click="$router.back()"
    >
      <i class="el-icon-back" />
    </div>
    <div
      class="button"
      @click="$emit('collapse-click')"
    >
      <i :class="icon" />
    </div>

    <header-breadcrumb v-if="showBreadcrumb" />
    <div class="blank" />
    <el-popover
      placement="bottom"
      trigger="click"
    >
      <template #reference>
        <div class="my-header-end">
          <el-avatar
            class="avatar"
            icon="el-icon-user"
          />
        </div>
      </template>
      <div class="avatar-popover">
        <el-col :span="8">
          <el-avatar icon="el-icon-user" />
        </el-col>
        <el-col :span="8">
          <el-row justify="center">
            <h3>{{ username }}</h3>
          </el-row>
          <el-row justify="center">
            <el-button type="text">
              编辑
            </el-button>
          </el-row>
        </el-col>
      </div>
    </el-popover>
    <el-dialog 
      v-model="showEdit" 
      title="编辑用户信息"
      top="18px"
    >
      <el-form
        ref="form"
        label-position="top"
        :rules="rules"
        :model="user"
      >
        <el-form-item label="账号">
          <el-input v-model="user.username" />
        </el-form-item>
        <el-form-item
          label="旧密码"
          prop="password"
        >
          <el-input
            v-model="user.password"
            type="password"
          />
        </el-form-item>
        <el-form-item
          label="新密码"
          prop="newPassword"
        >
          <el-input
            v-model="user.newPassword"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="checkPassword"
        >
          <el-input
            v-model="user.checkPassword"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <p 
        v-if="showMsg" 
        style="height: 40px; display: flex; align-items: center;"
      >
        请联系服务器管理员！
      </p>
      <p v-else>
        <el-button
          type="text"
          @click="showMsg=true"
        >
          忘记密码?
        </el-button>
      </p>
      <template #footer>
        <el-button @click="cancel">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="confirm"
        >
          确认
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import HeaderBreadcrumb from '@/components/header/HeaderBreadcrumb.vue'

export default {
    name: 'HeaderNav',
    components: { HeaderBreadcrumb },
    props: {
        collapseSide: {
            type: Boolean,
            default: true,
        },
        showBreadcrumb: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        const validPass = (rule, value, callback) => {
            if (value === '' && this.user.newPassword !== '') {
                callback(new Error('请输入旧密码！'))
            }
            callback()
        }
        const validPass2 = (rule, value, callback) => {
            if (value !== '') {
                this.$refs.form.validateField('password')
            }
            if (value !== '' && this.user.checkPassword !== '') {
                this.$refs.form.validateField('checkPassword')
            }
            callback()
        }
        const validPass3 = (rule, value, callback) => {
            if (value !== this.user.newPassword) {
                callback(new Error('两次输入密码不一致！'))
            } else {
                callback()
            }
        }
        return {
            user: {
                username: localStorage.getItem('username'),
                password: '',
                newPassword: '',
                checkPassword: '',
            },
            showEdit: false,
            showMsg: false,
            rules: {
                password: [{ validator: validPass, trigger: 'blur' }],
                newPassword: [{ validator: validPass2, trigger: 'blur' }],
                checkPassword: [{ validator: validPass3, trigger: 'blur' }],
            },
        }
    },
    computed: {
        icon() {
            return this.collapseSide ? 'el-icon-s-unfold' : 'el-icon-s-fold'
        },
    },
    methods: {
        confirm() {
            this.showEdit = false
            setTimeout(() => {
                this.$refs['form'].resetFields()
                this.showMsg = false
            }, 100)
        },
        cancel() {
            this.showEdit = false
            setTimeout(() => {
                this.$refs['form'].resetFields()
                this.showMsg = false
            }, 100)
        },
    },
}
</script>

<style scoped>
h3 {
    margin: 5px 0;
}
.el-avatar--large {
    width: 50px;
    height: 50px;
    line-height: 50px;
}
.el-avatar--icon {
    font-size: 20px;
}

.el-form-item {
    margin-bottom: 5px;
}
.avatar-popover {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
}
.my-header-nav {
  flex-direction: row;
  display: flex;
  align-items: center;
  height: 100%;
}

.button {
  font-size: 2em;
  color: #8a8a8a;
  margin-right: 30px;
}

.button.small {
  font-size: 1.5em;
  margin-right: 15px;
}

.button:hover {
  color: #4888d6;
}

@media screen and (max-width: 768px) {
  .button:hover, .button {
    color: #4888d6;
  }
}
.my-header-end {
  flex: 0 0 1;
}
</style>

<style>
.el-popover.el-popper {
    border-radius: 0!important;
}
.el-dialog {
    border-radius: 0!important;
}
.el-dialog__body {
    padding: 5px 20px!important;
}
.el-input__inner {
    border-radius: 0!important;
}
</style>