<template>
  <div class="detail">
    <div class="img-box">
      <img :src="bigImg" alt="大图" class="big-img" />
      <div>
        <img
          :class="{'small-img':true, 'active':curr==item.id}"
          :src="item.small_url"
          alt
          v-for="item in detail.imgs"
          :key="item.id"
          @mouseenter="enter(item.big_url, item.id)"
        />
      </div>
    </div>
    <div class="info">
      <p class="title">{{detail.title}}</p>
      <div class="color">
        <el-radio-group v-model="form.color"  size="mini">
          <el-radio-button label="red">红色</el-radio-button>
          <el-radio-button label="yellow">黄色</el-radio-button>
          <el-radio-button label="black">黑色</el-radio-button>
          <el-radio-button label="white">白色</el-radio-button>
        </el-radio-group>
      </div>
      <div class="num">
        <el-input-number v-model="form.num"  :min="1" :max="10"></el-input-number>
      </div>
      <p class="tip">
        配 送 至  四川成都市武侯区城区有货，仅剩4件在线支付运费6元 由 <span>汐妮璐官方旗舰店</span> 负责发货, 并提供售后服务.
      </p>
      <div class="submit-btn" @click="onSubmit">加入购物车</div>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>成功加入购物车！</span>
      <span slot="footer" class="dialog-footer">
        <nuxt-link to='/'><el-button type="danger">继续购物</el-button></nuxt-link>
        <nuxt-link to="/cartLists"><el-button>去购物车</el-button></nuxt-link>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: '',
      detail: { imgs: [] },
      bigImg: "",
      curr: "",
      form: {color:'red',num:1},
      dialogVisible: false
    };
  },
  async mounted() {
    let id = this.$route.params.id;
    this.id = id;
    const response = await this.$axios.get("/goods/detail", {
      params: { id: id }
    });
    if (response.status == 200) {
      this.detail = response.data;
      this.bigImg = response.data.imgs[0].big_url;
      this.curr = response.data.imgs[0].id;
    } else {
      this.$message.error(response.msg);
    }
  },
  methods: {
    enter(url, curr) {
      this.bigImg = url;
      this.curr = curr;
    },
    // 加入购物车
    async onSubmit() {
      let res = await this.$axios.post('/users/addCart', {
        goodsId: this.id,
        num: this.form.num,
        color: this.form.color
      })
      console.log(res)
      if(res.status == 200) {
        // this.$message.success('加入购物车成功！');
        this.dialogVisible = true;
      } else {
        this.$message.error(res.msg);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.detail {
  .flex-justify--center;
  width: 800px;
  background: @white;
  padding: 20px;
  margin: 0 auto;
  .img-box {
    width: 400px;
    .big-img {
      display: block;
      width: 350px;
      margin: 0 auto;
    }
    .small-img {
      .marginL(3px);
      cursor: pointer;
      &.active {
        border: 2px solid @redColor;
      }
    }
  }
  .info {
    .marginL(20px);
    .title {
      font-size: 20px;
      color: @blackColor;
    }
    .color, .num {
      .marginT(20px);
    }
    .tip {
      .marginT(20px);
      color: @greyColor;
      font-size: 12px;
      span {
        color: @redColor;
      }
    }
    .submit-btn {
      .my-btn;
      font-size: 14px;
      width: 200px;
      height: 40px;
      line-height: 40px;
      .marginT(50px);
    }
  }
}
</style>