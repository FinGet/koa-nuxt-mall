<template>
  <div class="container">
    <search @change-type="changeType" @search="search" />
    <banner />
    <div class="lists-box">
      <div 
        v-loading="isLoading" 
        element-loading-text="请稍等，加载中..."
        class="goods-lists"
        >
        <div v-for="(item, index) in goodsList" :key="index" @click="goDetail(item._id)">
          <Goods :data="item" />
        </div>
      </div>
      <div v-if="isMore" class="load-more" @click="loadMore">———— 加载更多 ————</div>
    </div>
  </div>
</template>

<script>
import Banner from "~/components/banner";
import Search from "~/components/search";
import Goods from "~/components/goods";
export default {
  components: {
    Banner,
    Search,
    Goods
  },
  data() {
    return {
      goodsList: [],
      isMore: true,
      isLoading: false,
      page: 1
    };
  },
  mounted() {
    // this.getGoodsLists()
  },
  async asyncData({ app }) {
    const { data, isMore } = await app.$axios.get("/goods/lists");
    return { goodsList: data, isMore };
  },
  methods: {
    async getGoodsLists({
      keyword = "",
      type = "all",
      pageSize = 10,
      page = 1,
      loadMore= false
    }) {
      this.isLoading = true;
      const response = await this.$axios.get("/goods/lists", {
        params: {
          keyword: keyword,
          type: type,
          pageSize: pageSize,
          page: page
        }
      });
      this.isLoading = false;
      console.log(loadMore)
      if (response.status == 200) {
        this.goodsList = loadMore?[...this.goodsList,...response.data]:response.data;
        this.isMore = response.isMore;
      }
    },
    // 搜索
    search(val) {
      this.page = 1;
      this.getGoodsLists({ keyword: val });
    },
    // 切换快速搜索
    changeType(val) {
      this.page = 1;
      this.getGoodsLists({ type: val });
    },
    // 加载更多
    loadMore() {
      this.getGoodsLists({ page: ++this.page,loadMore: true });
    },
    // 查看详情
    goDetail(id) {
      this.$router.push({name: 'detail-id', params: {id: id}})
    }
  }
};
</script>

<style lang="less" scoped>
.goods-lists {
  padding: 0 40px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 230px);
  grid-row-gap: 10px;
  grid-column-gap: 30px;
}
.load-more {
  margin: 20px auto;
  text-align: center;
  height: 30px;
  line-height: 30px;
  width: 600px;
  background: #fff;
  border-radius: 5px;
  cursor: pointer;
  color: @redColor;
}
</style>
