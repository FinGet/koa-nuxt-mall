<template>
  <div class="form">
    <el-form label-width="80px" :model="form" ref="ruleForm" :rules="rules">
      <el-form-item label="昵称" prop="userName">
        <el-input v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="userPwd">
        <el-input type="password" v-model="form.userPwd"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="sub-btn" type="primary" @click="onSubmit">登录，走一波</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js'
import FormMixins from './form_mixins'
import { mapActions } from 'vuex'
export default {
  mixins: [FormMixins],
  methods: {
    ...mapActions(['userlogin']),
    onSubmit() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.$axios.post('/users/signin', {
            userName: this.form.userName,
            userPwd : CryptoJS.MD5(this.form.userPwd).toString(),
          }).then(res => {
            if (res.status == 200) {
              this.$message.success(`欢迎您，${this.form.userName}`)
              this.$router.push({path:'/'})
              this.userlogin(res.user)
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.form {
  width: 400px;
  margin: 50px auto;
}
.sub-btn{
  .my-btn;
}
</style>