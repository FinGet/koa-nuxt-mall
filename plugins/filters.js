import Vue from 'vue';

Vue.filter('moneyFormat', (value) => {
  return `${value}.00`
});
