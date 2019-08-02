<template>
  <div class="banner">
    <el-carousel :interval="4000" type="card" height="255px">
      <el-carousel-item v-for="item in lists" :key="item._id">
        <h3 class="medium">
          <a href="https://finget.github.io" target="_bank">
            <img :src="item.img_url" alt="">
          </a>
        </h3>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lists: []
    }
  },
  mounted() {
    this.getBanners()
  },
  methods: {
    async getBanners() {
      const {data} = await this.$axios.get("/banner/lists")
      this.lists = data;
    }
  }
};
</script>

<style lang="less" scoped>
.banner {
  img {
    width: 100%;
  }
}
</style>