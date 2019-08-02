<template>
  <div class="search">
    <div class="input-box">
      <el-autocomplete
        class="search-input"
        @keyup.enter.native="search"
        v-model="keyword"
        :fetch-suggestions="querySearch"
        placeholder="来呀，快活呀，反正又不要钱!!!"
        :trigger-on-focus="false"
        @select="handleSelect"
      >
      </el-autocomplete>
      <el-button class="search-btn" @click="search" icon="el-icon-search"></el-button>
    </div>
    <div class="filter">
      <span
        @click="changeType(item.value)"
        v-for="item in filter"
        :key="item.value"
        :class="{'active':item.value==current}"
      >{{item.label}}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyword: "",
      suggestions: [
        { value: "球鞋" },
        { value: "科比" },
        { value: "鹿歌2019夏装新品时尚" },
        { value: "运动鞋" },
        { value: "夏季" },
        { value: "索硕连衣裙2019夏季新品" },
        { value: "凉爽裙子" },
        { value: "花花公子" },
        { value: "2019夏季精品" },
        { value: "牛仔裤男" },
        { value: "时尚女装" },
        { value: "小清新" },
        { value: "Air Jordan" },
        { value: "Adidas阿迪达斯男鞋" },
        { value: "烽火体育" }
      ],
      current: "all",
      filter: [
        { value: "all", label: "全部" },
        { value: "dress", label: "女装" },
        { value: "manwear", label: "男装" },
        { value: "shoes", label: "球鞋" }
      ]
    };
  },
  methods: {
    querySearch(queryString, cb) {
      let suggestions = this.suggestions;
      queryString = queryString.split("");
      let results = [];
      for (let i = 0; i < queryString.length; i++) {
        suggestions.forEach(item => {
          if (item.value.indexOf(queryString[i]) > -1) results.push(item);
        });
      }
      results = Array.from(new Set(results))
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    // 选择推荐搜索
    handleSelect(item) {
      this.$emit('search', item.value)
    },
    // 搜索
    search() {
      this.$emit('search',  this.keyword)
    },
    // 切换快速选择
    changeType(type) {
      this.current = type;
      this.$emit('change-type', type)
    }
  }
};
</script>

<style lang="less" scoped>
.search {
  width: 560px;
  margin: 20px auto;
  .search-input {
    width: 500px;
  }
  .filter {
    .marginT;
    color: @blackColor;
    span {
      .marginR;
      cursor: pointer;
      &:hover {
        color: @lightColor;
      }
      &.active {
        color: @lightColor;
        font-weight: bold;
      }
    }
  }
  .input-box {
    .flex-justify-align--center;
  }
  .search-btn {
    .marginL;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    .my-btn(@bg:@redColor, @hover:#dd3d39, @active: #bd2d2c);
  }
}
</style>