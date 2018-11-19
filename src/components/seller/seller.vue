<template>
<!--BScroll 容器结构 外层有一个容器wrapper，有一个固定的视口高度，
内层是一个div 可以被内容撑开，内层视口高度>外层容器高度 滚动-->
  <div class="seller" ref="seller">
  	<div class="seller-count">
      <div class="overview">
        <h1 class="title">{{seller.name}} </h1>
        <div class="desc">
          <star :size="36" :score="seller.score"></star>
           <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>

        <ul class="remark">
          <li>
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite"  @click="toggleFavorite">
          <span class="icon-favorite"  :class="{'active':favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
      <icon :size="3" :supports="seller.supports"></icon>
      </div>
      <split></split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="(pic,index) in seller.pics" :key="index">
              <img :src="pic" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <h1 class="title border-1px">商家信息</h1>
        <ul>
          <li class="info-item" v-for="(info,index) in seller.infos" :key="index">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import star from "../../components/star/star";
import split from "../../components/split/split";
import icon from "../../components/icon/icon";
import BScroll from "better-scroll";
import { saveToLocal, loadFromLocal } from "../../common/js/store.js";
export default {
  props: {
    seller: {
      type: Object
    }
  },
 data() {
      return {
        favorite: (() => {
          return loadFromLocal(this.seller.id, 'favorite', false);
        })()
      };
    },
  ready() {
    this._initScroll();
    this._initPics();
  },
  watch: {
    // seller 数据为空，请求到seller数据变化的时候 seller数据发生变化
    seller() {
      this.$nextTick(() => {
        this._initScroll();
        this._initPics();
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this._initScroll();
      this._initPics();
    });
  },
  computed: {
    favoriteText() {
      return this.favorite ? "已收藏" : "请收藏";
    }
  },
  methods: {
    _initScroll() {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.seller, {
          click: true
        });
      } else {
        this.scroll.refresh();
      }
    },
    _initPics() {
       
      if (this.seller.pics) {
        
        let picWidth = 120;
        let picmargin = 6;
        let width = (picWidth + picmargin) * this.seller.pics.length - picmargin;
        this.$refs.picList.style.width = width + "px";

        this.$nextTick(() => {
         
          if (!this.picScroll) {
            this.picScroll = new BScroll(this.$refs.picWrapper, {
              scrollX: true,
              eventPassthrough: "vertical" // 滚动的时候忽略垂直方向的滚动
            });
          } else {
            this.picScroll.refresh();
          }
        });
      }
    },
    toggleFavorite(event) {
      if (!event._constructed) {
        return;
      }
      this.favorite = !this.favorite;
      //这个值缓存到前端中
      saveToLocal(this.seller.id, "favorite", this.favorite);
    }
  },

  components: {
    star,
    split,
    icon
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl';

.seller {
  position: absolute;
  top: 174px;
  left: 0;
  bottom: 0;
  width: 100%;
  overflow: hidden;

  .seller-count {
    .overview {
      position: relative;
      padding: 18px;

      .title {
        margin-bottom: 8px;
        line-height: 14px;
        color: rgb(7, 17, 27);
        font-size: 14px;
        font-weight: 700;
      }

      .desc {
        padding-bottom: 18px;
        border-1px(rgba(7, 17, 27, 0.1));

        .star {
          display: inline-block;
          margin-right: 8px;
          vertical-align: top;
        }

        .text {
          display: inline-block;
          margin-right: 12px;
          line-height: 18px;
          vertical-align: top;
          font-size: 10px;
          color: rgb(77, 85, 93);
        }
      }

      .remark {
        display: flex;
        padding-top: 18px;

        li {
          display: inline-block;
          flex: 1;
          text-align: center;
          border-right: 1px solid rgba(7, 17, 27, 0.1);

          &:last-child {
            border: none;
          }

          h2 {
            margin-bottom: 4px;
            line-height: 10px;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }

          .content {
            line-height: 24px;
            font-size: 10px;
            color: rgb(7, 17, 27);

            .stress {
              font-size: 24px;
            }
          }
        }
      }

      .favorite {
        position: absolute;
        width: 50px;
        right: 11px;
        top: 18px;
        text-align: center;

        .icon-favorite {
          display: block;
          margin-bottom: 4px;
          line-height: 24px;
          font-size: 24px;
          color: #d4d6d9;

          &.active {
            color: rgb(240, 20, 20);
          }
        }

        .text {
          line-height: 10px;
          font-size: 10px;
          color: rgb(77, 85, 93);
        }
      }
    }

    .bulletin {
      padding: 18px 18px 0 18px;

      .title {
        margin-bottom: 8px;
        line-height: 14px;
        color: rgb(7, 17, 27);
        font-size: 14px;
      }

      .content-wrapper {
        padding: 0 12px 16px 12px;
        border-1px(rgba(7, 17, 27, 0.1));

        p {
          line-height: 24px;
          font-size: 12px;
          color: rgb(240, 20, 20);
        }
      }

      .supports {
        li {
          padding: 16px 12px;
          border-1px(rgba(7, 17, 27, 0.1));
          font-size: 0;

          &:last-child {
            border-none();
          }

          .text {
            line-height: 14px;
            font-size: 12px;
            color: rgb(7, 17, 27);
          }
        }
      }
    }

    .pics {
      padding: 18px;

      .title {
        margin-bottom: 12px;
        line-height: 14px;
        color: rgb(7, 17, 27);
        font-size: 14px;
      }

      .pic-wrapper {
        width: 100%;
        overflow: hidden;
        white-space: nowrap; // 图片超过屏幕宽度的时候不会被折行

        .pic-list {
          li {
            display: inline-block;
            margin-right: 6px;
            width: 120px;
            height: 90px;

            &:last-child {
              margin: 0;
            }
          }
        }
      }
    }

    .info {
      padding: 18px 18px 0 18px;
      color: rgb(7, 17, 27);

      .title {
        padding-bottom: 12px;
        line-height: 14px;
        border-1px(rgba(7, 17, 27, 0.1));
        font-size: 14px;
      }

      .info-item {
        padding: 16px 12px;
        line-height: 16px;
        border-1px(rgba(7, 17, 27, 0.1));
        font-size: 12px;

        &:last-child {
          border-none();
        }
      }
    }
  }
}
</style>
