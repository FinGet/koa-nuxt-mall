<template>
  <div class="container">
    <search @change-type="changeType" @search="search"/>
    <banner />
    <div class="goods-lists">
      <div v-for="item in goodsList" :key="item._id">
        <Goods :data="item" />
      </div>
      <div v-if="isMore" class="">———— 加载更多 ————</div>
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
      isMore: true
    };
  },
  mounted() {
    // this.getGoodsLists()
  },
  async asyncData({ app }) {
    const {data, isMore} = await app.$axios.get("/goods/lists", {
      params: {
        keyword: '',
        type: 'all',
        pageSize: 10,
        page: 1
      }
    });
    return { goodsList: data, isMore };
  },
  methods: {
    async getGoodsLists({keyword='',type='all',pageSize=10,page=1}) {
      const { data, isMore } = await this.$axios.get("/goods/lists", {
        params: {
          keyword: keyword,
          type: type,
          pageSize: pageSize,
          page: page
        }
      });
      this.goodsList = data;
      this.isMore = isMore;
    },
    search(val) {
      console.log(val)
      this.getGoodsLists({keyword: val})
    },
    changeType(val) {
      console.log(val)
      this.getGoodsLists({type: val})
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
</style>
