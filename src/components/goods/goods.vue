<template>
<div>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,index) in goods" :key="index" class="menu-item" @click="selectMenu(index,$event)"  :class="{'current':currentIndex===index}" >
          <!-- <star :size="36" :score="seller.score"></star>-->
          <span class="text border-1"><icon v-show="item.type>0" :size="3" :icontype="item.type"></icon>{{item.name}}</span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="(item,index) in goods" :key="index" ref="foodList">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="(food,index1) in item.foods" :key="index1" class="food-item"  @click="selectFood(food,$event)">
              <div class="foodicon">
                <img :src="food.icon" width="57" height="57">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="fooddesc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food" @add="addFood"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcard ref="shopcart" :selectFoods="selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></shopcard>
  </div>
  <div><food :food="selectedFood" @add="addFood" ref="food"></food></div>
  </div>
</template>

<script type="text/ecmascript-6">
import icon from "../../components/icon/icon";
import BScroll from "better-scroll";
import shopcard from "../../components/shopcard/shopcard";
import cartcontrol from "../../components/cartcontrol/cartcontrol";
import food from "../../components/food/food";
const ERR_OK = 0;
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      goods: [],
      listHight: [], // 每个区间的高度
      scrollY: 0,
      selectedFood: {}
    };
  },

  created() {
    this.$http.get("/api/goods").then(response => {
      response = response.body;
      if (response.errno === ERR_OK) {
        this.goods = response.data;
        this.$nextTick(() => {
          this._initScroll();
          this._calculateHeight();
        });
      }
    });
  },
  

  // Vue计算属性都写在computed
  computed: {
    currentIndex() {
      for (let i = 0; i < this.listHight.length; i++) {
        let height1 = this.listHight[i];
        let height2 = this.listHight[i + 1];
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i;
        }
      }
      return 0;
    },
    selectFoods() {
      let foods = [];
      this.goods.forEach(good => {
        good.foods.forEach(food => {
          if (food.count) {
            foods.push(food);
          }
        });
      });
      return foods;
    }
  },
  // Vue方法都写在methods
  methods: {
    selectMenu(index, event) {
      if (!event._constructed) {
        return;
      }
      let foodList = this.$refs.foodList;
      let el = foodList[index];
      this.foodsScroll.scrollToElement(el, 300);
    },
    selectFood(food1,event){
      if(!event._constructed){ // 如果不存在这个属性,则为原生点击事件，不执行下面的函数
        return;
      }
      this.selectedFood=food1;
      this.$refs.food.show();
    },
    addFood(target) {
      
      this._drop(target); // @#￥%  接收由 cardcontal 传过来的事件
    },
    _drop(target) {// 调用shopcard 的drop方法
    // 体验优化 异步执行下落动画
    console.log('aa');
       this.$nextTick(() => {  
          this.$refs.shopcart.drop(target);// 调用 shopcard 的drop方法
        });
    },
    _initScroll() {
      this.meunScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      });
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true,
        probeType: 3
      });
      this.foodsScroll.on("scroll", pos => {
        this.scrollY = Math.abs(Math.round(pos.y));

      });
    },
    _calculateHeight() {
      let height = 0;
      let foodList = this.$refs.foodList;

      this.listHight.push(height);
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i];
        height += item.clientHeight;
        this.listHight.push(height);
      }
    }
  },
  components: {
    icon,
    shopcard,
    cartcontrol,
    food
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin'
.goods {
  display: flex;
  overflow: hidden;
  position: absolute;
  top: 174px;
  width: 100%;
  bottom: 46px;

  .menu-wrapper {
    flex: 0 0 80px;
    width: 80px;
    background: #f3f5f7;

    .menu-item {
      text-align: center;
      display: table;
      width: 54px;
      height: 56px;
      line-height: 14px;
      padding: 0 12px;

      &.current {
        position: relative;
        z-index: 10;
        background: #fff;
        font-weight: 700;
        margin-top: -1px;

        .text {
          border-none();
        }
      }

      .text {
        display: table-cell;
        font-size: 12px;
        vertical-align: middle;
        width: 56px;
        border-1px(rgba(7, 17, 27, 0.1));
      }
    }
  }

  .foods-wrapper {
    flex: 1;

    .title {
      padding-left: 14px;
      border-left: 2px solid #d9dde1;
      height: 26px;
      line-height: 26px;
      font-size: 12px;
      color: rgb(147, 153, 159);
      background-color: #f3f5f7;
    }

    .food-item {
      display: flex;
      margin: 0 18px 0 18px;
      padding: 18px 0;
      border-1px(rgba(7, 17, 27, 0.1));

      &:last:child {
        border-none();
        margin-bottom: 0;
      }

      .foodicon {
        flex: 0 0 57px;
        width: 57px;
        margin-right: 10px;
      }

      .content {
        flex: 1;

        .name {
          margin: 2px 0 8px 0;
          height: 14px;
          line-height: 14px;
          font-size: 14px;
          color: rgba(7, 17, 27, 1);
        }

        .fooddesc, .extra {
          line-height: 10px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }

        .fooddesc {
          line-height: 14px;
          margin-bottom: 8px;
        }

        .extra .count {
          margin-right: 12px;
        }

        .price {
          font-weight: 700;
          line-height: 24px;

          .now {
            color: rgb(240, 20, 20);
            margin-right: 8px;
            font-size: 14px;
          }

          .old {
            font-size: 10px;
            text-decoration: line-through;
            color: rgb(147, 153, 159);
          }
        }

        .cartcontrol-wrapper {
          position: absolute;
          bottom: 14px;
          right: 0;
        }
      }
    }
  }
}
</style>
