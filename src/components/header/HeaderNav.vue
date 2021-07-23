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
        <el-row 
          align="center" 
          :gutter="10"
          style="width: 100%;"
        >
          <i class="icon" />
          <h4>EMSS</h4>
          <div class="blank" />
          <el-button 
            type="text"
            @click="signOut"
          >
            注销
          </el-button>
        </el-row>
        <el-divider />
        <el-row
          style="width: 100%;"
          justify="space-around"
        >
          <el-col :span="8">
            <div class="avatar2">
              <el-avatar icon="el-icon-user" />
            </div>
          </el-col>
          <div class="blank" />
          <el-col :span="12">
            <el-row justify="center">
              <h3 class="username">
                {{ username }}
                <el-link>
                  icon="el-icon-edit" 
                  :underline="false" 
                  @click.prevent="changeName"
                </el-link>
              </h3>
            </el-row>
            <el-row justify="center">
              <el-button
                type="text"
                @click="showEdit=true"
              >
                修改密码
              </el-button>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </el-popover>
    <el-dialog 
      v-model="showEdit" 
      title="修改密码"
      top="30px"
      width="35%"
      @close="cancelPwd"
    >
      <el-form
        ref="form"
        label-position="top"
        :rules="rules"
        :model="user"
      >
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
        style="height: 40px; display: flex; align-items: center; text-align: right"
      >
        请联系服务器管理员！
      </p>
      <p 
        v-else 
        style="text-align: right"
      >
        <el-button
          type="text"
          @click="showMsg=true"
        >
          忘记密码?
        </el-button>
      </p>
      <template #footer>
        <el-button @click="cancelPwd">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="confirmPwd"
        >
          确认
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import HeaderBreadcrumb from '@/components/header/HeaderBreadcrumb.vue'
import api from '@/api'

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
            if (value === '') {
                callback(new Error('请输入旧密码！'))
            }
            callback()
        }
        const validPass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入新密码！'))
            }
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
                newPassword: [{ validator: validPass2, trigger: 'blur' },
                    {pattern: /^[a-zA-Z0-9]{6,20}$/, message: '密码只能为大小写字母或数字，且长度为6~20个字符', trigger: 'blur'}],
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
        async confirmPwd() {
            await this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    await api.user.changePwd(this.user.password, this.user.newPassword)
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    })
                    this.showEdit = false
                    this.showMsg = false
                    this.$refs.form.resetFields()
                    return true
                }
                console.log('error submit!!')
                return false
            })
        },
        cancelPwd() {
            this.showEdit = false
            setTimeout(() => {
                this.$refs['form'].resetFields()
                this.showMsg = false
            }, 100)
        },
        signOut() {
            this.$store.commit('clearToken')
            localStorage.removeItem('password')
            this.$router.push({name:'login'})
        },
        async changeName() {
            this.$prompt('新用户名', '修改用户名', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPlaceholder: '由大小写字母、数字或下划线组成，且长度为3~20个字符',
                inputPattern: /^[a-zA-Z0-9_]{3,20}$/,
                inputErrorMessage: '格式不正确',
            }).then(async ({ value }) => {
                await api.user.changeName(value)
            }).catch(() => {})
        }
    },
}
</script>

<style scoped>
.username {
    margin: 0;
    margin-top: 30px;
    display: flex;
    flex-direction: row;
}
.avatar2 .el-avatar--large {
    width: 70px;
    height: 70px;
    line-height: 70px;
}
.avatar2 .el-avatar--icon {
    font-size: 30px;
    margin-top: 10px;
}

.el-form-item {
    margin-bottom: 5px;
}
.avatar-popover {
    display: flex;
    flex-direction: column;
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
.el-divider--horizontal {
    margin: 0;
}
.el-col-8 {
    margin-top: 10px;
    margin-right: 5px;
}
</style>

<style>
.el-popover.el-popper {
    border-radius: 0!important;
    padding: 10px 25px!important;
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