<template>
  <div class="app">
    <v-header v-bind:seller="seller"></v-header>
    <div class="tab border-1px">
       <router-link to="/goods">商品</router-link>
        <router-link to="/ratings">评论</router-link>
        <router-link to="/seller">商家</router-link>
    </div>
  <keep-alive>
    <router-view :seller="seller"></router-view>
  </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
import header from "./components/header/header";
const ERR_OK = 0;

export default {
  data() {
    return {
      seller: {}
    };
  },
  created() {
    this.$http.get("/api/seller").then(response => {
      response = response.body;
      if (response.errno === ERR_OK) {
        this.seller = response.data;
        this.$router.push("/goods")
      }
    });
  },

  components: {
    "v-header": header
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import './common/stylus/mixin.styl';

.tab {
  display: flex;
  height: 40px;
  line-height: 40px;
  width: 100%;
  text-align: center;

  a {
    flex: 1;
    text-align: center;
  }
}
</style>