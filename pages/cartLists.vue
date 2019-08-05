<template>
  <div class="cart-lists">
    <ul class="product-lists">
      <li class="product-item">
        <div class="img">
          <img src="" alt="">
        </div>
        <div class="info">
          <p>asjdfjasjkdfjkasjdfasdfasdfasdfas</p>
          <p>红色，黄色</p>
        </div>
        <div class="num">

        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        lists: [],
        isMore: true
      }
    },
    mounted() {
      this.getCartLists();
    },
    methods: {
      async getCartLists(page = 1) {
        let res = await this.$axios.get('/users/cartLists',{
          params: {
            page: page
          }
        })
        if(res.status == 200) {
          this.lists = res.data;
          this.isMore = res.isMore;
        } else {
          this.$message.error(res.msg);
        }
      }
    }
  }
</script>

<style lang="less" scoped>
.cart-lists {
  width: 80%;
  margin: 0 auto;
  .product-lists {
    .product-item {
      .flex-align--center;
      background: #fff;
      padding: 20px;
      border-radius: 5px;
      cursor: pointer;
      box-shadow: 0 0 2px @redColor;
      &:hover{
        box-shadow: 0 0 3px @redColor;
      }
    }
  }
}
</style>