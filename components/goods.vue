<template>
  <div class="goods">
    <div class="img">
      <img :src="data.img_url" alt="图片">
    </div>
    <p class="title">{{data.title}}</p>
    <p class="price"><span>¥</span>{{data.price | moneyFormat}}</p>
  </div>
</template>

<script>
  export default {
    props: {
      data: Object
    }
  }
</script>

<style lang="less" scoped>
.goods {
  .marginT(20px);
  width: 230px;
  height: 322px;
  background: #fff;
  border-radius: 3px;
  cursor: pointer;
  box-shadow: 1px 1px 3px @greyColor;
  transition: all 500ms;
  &:hover {
    box-shadow: 0px 0px 3px @greyColor;
    transform: translateY(-10px);
  }
  .img {
    height: 200px;
    .flex-justify-align--center;
    img {
      display: block;
      width: 140px;
    }
  }
  .title {
    .overLine;
    padding: 0 20px;
    color: @blackColor;
  }
}
</style>