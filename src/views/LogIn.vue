<template>
  <div class="log-in">
    <div class="logo">
      <el-card>
        <template #header>
          xxx
        </template>
      </el-card>
    </div>
    <div class="login-form">
      <div class="form">
        <h2>登录</h2>
        <el-form
          :model="user"
          label-width="50px"
          label-position="left"
        >
          <el-form-item label="账号">
            <el-input 
              v-model="user.username"
              clearable
            />
          </el-form-item>
          <el-form-item label="密码">
            <el-input 
              v-model="user.password"
              show-password
              clearable
            />
          </el-form-item>
        </el-form>
        <div class="button">
          <el-button
            round
            @click="login;$router.push({name:'workbench'})"
          >
            登录
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'LogIn',
    data() {
        return {
            user: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        login() {
            console.log('...')
        }
    }
}
</script>

<style scoped>
.log-in {
    background-image: url("../../public/bg.png");
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
.logo {
    width: 100%;
    margin: 0 0 0 100px;
}
.login-form {
    position: relative;
    width: 100%;
    height: 400px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    margin:0 150px 0 200px;
}
.form {
    position: relative;
    width: 80%;
    height: 80%;
    padding: 50px;
}
.form h2 {
    position: relative;
    color: #fff;
    font-size: 24px;
    font-weight: 600;
    letter-spacing: 5px;
    margin-bottom: 30px;
    cursor: pointer;
}
.button {
    margin-top: 40px;
}
</style>

<style lang="less">
.form .el-input__inner {
    width: 100%;
    padding: 10px 20px;
    background: rgba(255, 255, 255, 0.2);
    outline: none;
    border-radius: 30px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    font-size: 16px;
    letter-spacing: 1px;
    color: #fff;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.form .el-button{
  background: #fff;
  color: #666;
  max-width: 100px;
  margin-bottom: 20px;
  font-weight: 600;
  cursor: pointer;
}

.form .el-form-item__label {
  font-size: 17px;
}
</style>