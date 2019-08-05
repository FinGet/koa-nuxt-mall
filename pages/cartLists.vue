<template>
  <div class="cart-lists">
    <ul class="product-lists">
      <li :class="{'product-item': true, 'active': item.checked}" @click="checkGood(index)" v-for="(item, index) in lists" :key="item._id">
        <div class="delete" @click.stop="deleteProduct(item._id, index)">
          <i class="el-icon-delete-solid"></i>
        </div>
        <div class="img">
          <img :src="item.goodsImage" alt />
        </div>
        <div class="info-box">
          <div class="info">
            <p class="name">{{item.goodsName}}</p>
            <p>
              <el-tag class="my-tag">{{item.goodsColor}}</el-tag>
            </p>
          </div>
          <div class="num">
            <div @click.stop="">
              <el-input-number v-model="item.goodsNum" @change="changeNum($event, item.goodsId)" :min="1"></el-input-number>
            </div>
            <p class="price"><span>¥</span>{{item.salePrice * item.goodsNum | moneyFormat}}</p>
          </div>
        </div>
      </li>
    </ul>
    <div v-if="isMore" class="load-more" @click="loadMore">———— 加载更多 ————</div>
    <div class="opear">
      <el-checkbox v-model="checkAll">全选</el-checkbox>
      <div class="total">
        <p>
          合计：<span class="price"><span>¥</span>{{totalPrice | moneyFormat}}</span>
        </p>
        <div class="submit-btn">结算</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  data() {
    return {
      lists: [],
      isMore: true,
      page: 1,
      checkAll: false
    };
  },
  mounted() {
    this.getCartLists();
  },
  watch: {
    checkAll(val) {
      this.lists.forEach(item => {
        item.checked = val;
      })
    }
  },
  computed: {
    totalPrice() {
      let total = 0
      this.lists.forEach(item => {
        if(item.checked) {
          total += item.salePrice * item.goodsNum
        }
      })
      return total;
    }
  },
  methods: {
    async getCartLists(page = 1, loadMore) {
      let res = await this.$axios.get("/users/cartLists", {
        params: {
          page: page
        }
      });
      if (res.status == 200) {
        this.lists = loadMore? [...res.data,...this.lists] : res.data;
        this.isMore = res.isMore;
      } else {
        this.$message.error(res.msg);
      }
    },
    // 选择商品
    checkGood(index) {
      this.lists[index].checked = !this.lists[index].checked
      for(let i = 0; i<this.lists.length-1; i++) {
        if(!this.lists[i].checked) return
      }
      this.checkAll = true;
    },
    // 加载更多
    loadMore() {
      this.getCartLists({ page: ++this.page, loadMore: true });
    },
    // 改变商品数量
    async changeNum(val, id) {
      // console.log(val, id)
      let res = await this.$axios.post('/users/updatePro', {
        id: id,
        num: val
      })
      if(!res.status == 200) {
        this.$message.error(res.msg)
      }
    },
    // 删除
    deleteProduct(id, index) {
      this.$confirm('此操作将清楚该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(async () => {
        let res = await this.$axios.delete('/users/deletePro', {
          params: {
            id: id
          }
        })
        if(res.status == 200) {
          this.$message.success('删除成功!');
          this.lists.splice(index, 1);
        }
      })
    }
  }
};
</script>

<style lang="less" scoped>
.cart-lists {
  width: 80%;
  margin: 0 auto;
  .product-lists {
    .product-item {
      .marginB(20px);
      .flex-align--center;
      background: #fff;
      padding: 20px;
      border-radius: 5px;
      cursor: pointer;
      &.active {
        box-shadow: 0 0 5px @redColor;
        &:hover {
          box-shadow: 0 0 3px @redColor;
        }
      }
    }
    .delete{
      .marginR(20px);
      color: @redColor;
      font-size: 20px;
    }
    .img {
      .marginR(20px);
      height: 80px;
      img {
        height: 100%;
      }
    }
    .info-box {
      .flex-justify--between-align--center;
      flex: 1;
      .info {
        .name {
          color: @blackColor;
          font-size: 15px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
      .num {
        .price {
          .marginT(20px);
          color: @redColor;
          font-weight: bold;
          font-size: 16px;
        }
      }
    }
  }
  .opear {
    .flex-justify--between-align--center;
    background: #fff;
    height: 80px;
    padding: 0 20px;
    .total {
      .flex-align--center;
      .submit-btn {
        .my-btn;
        .marginL(20px);
        width: 120px;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
      }
    }
  }
}
.my-tag {
  background-color: @redColor;
  border-color: @lightColor;
  color: @white;
}
</style>