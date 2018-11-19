<template>
<div>
  <div class="shopcard">
  	<div class="content" @click="togglelist">
		  <div class="content-left">
			  <div class="logo-wrapper"><div>{{selectFoods}}</div>
				  <div class="logo" :class="{'hightlight':totalCount>0}" >
					  <i class="icon-shopping_cart" :class="{'hightlight':totalCount>0}" ></i>
				  </div>
				  <div class="num" v-show="totalCount>0">{{totalCount}}</div>
				</div>
				<div class="price" :class="{'hightlight':totalPrice>0}">￥{{totalPrice}}元</div>
				<div class="desc">另需配送费￥{{deliveryPrice}}元</div>
		  </div>
		  <div class="content-right" @click.stop.prevent="pay">
			  <div class="pay" :class="payClass">{{paydesc}}</div>
		  </div>
	  </div>
		<div class="ball-content">
				<div v-for="(ball,index) in balls" :key="index">
					<transition name="drop"  @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
							<div class="ball" v-show="ball.show">
								<div class="inner inner-hook"></div>
							</div>
							
					</transition>
				</div>
		</div>	
		<transition name="fold">
			<div class="shopcart-list" v-show="listShow">	
				<div class="list-header">
					<h1 class="title">购物车</h1>
					<span class="empty" @click="empty">清空</span>
				</div>
				<div class="list-content" ref="listContent">
					<ul>
						<li class="food" v-for="(food,index) in selectFoods" :key="index">
							<span class="name">{{food.name}}</span>
							<div class="price">
								<span>￥{{food.price*food.count}}</span>
							</div>
							<div class="cartcontrol-wrapper">
								<cartcontrol @add="addFood" :food="food"></cartcontrol>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</transition>
  </div>
	<transition name="fade">
	<div class="list-mask" @click="hidelist" v-show="listShow">

	</div>
	</transition>
	</div>
</template>

<script type="text/ecmascript-6">
import cartcontrol from "../../components/cartcontrol/cartcontrol";
import BScroll from "better-scroll";
export default {
  props: {
    selectFoods: {
      type: Array,
      default() {
        return [];
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      balls: [
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false }
      ],
      dropBalls: [],
      fold: true
    };
  },
  created() {
    // 调试	console.log(this.food);
    // console.log(this.food);
  },
  computed: {
    totalPrice() {
      // console.log(this.selectFoods);
      let total = 0;
      this.selectFoods.forEach(food => {
        total += food.price * food.count;
      });
      return total;
    },
    totalCount() {
      let count = 0;
      this.selectFoods.forEach(food => {
        count += food.count;
      });
      return count;
    },
    paydesc() {
      if (this.totalPrice === 0) {
        return this.minPrice + "元起送";
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice;
        return "还差￥" + diff + "元起送";
      } else {
        return "去结算";
      }
    },
    payClass() {
      if (this.totalPrice < this.minPrice) {
        return "not-enough";
      } else {
        return "enough";
      }
    },
    listShow() {
      if (!this.totalCount) {
        this.fold = true;
        return false;
      }
      let show = !this.fold;
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.listContent, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      }

      return show;
    }
  },
  methods: {
    drop(el) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i];
        if (!ball.show) {
          ball.show = true;
          ball.el = el;
          this.dropBalls.push(ball);
          return;
        }
      }
    },
    addFood(target) {
      this.drop(target);
    },
    beforeDrop(el) {
      let count = this.balls.length;
      while (count--) {
        let ball = this.balls[count];
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect(); // 得到元素相当于视口的偏移
          let x = rect.left - 32;
          let y = -(window.innerHeight - rect.top - 22);
          el.style.display = "";
          el.style.webkitTransfrom = "translate3d(0," + y + "px,0)";
          el.style.transform = `translate3d(0,${y}px,0)`;
          let inner = el.getElementsByClassName("inner-hook")[0];
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
          inner.style.transform = `translate3d(${x}px,0,0)`;
        }
      }
    },
    dropping(el, done) {
      let rf = el.offsetHeight;
      this.$nextTick(() => {
        el.style.webkitTransform = "translate3d(0,0,0)";
        el.style.transform = "translate3d(0,0,0)";
        let inner = el.getElementsByClassName("inner-hook")[0];
        inner.style.webkitTransform = "translate3d(0,0,0)";
        inner.style.transform = "translate3d(0,0,0)";
        el.addEventListener("transitionend", done);
      });
    },
    afterDrop(el) {
      let ball = this.dropBalls.shift();
      if (ball) {
        ball.show = false;
        el.style.display = "none";
      }
    },
    togglelist() {
      if (!this.totalCount) {
        return;
      }
      this.fold = !this.fold;
		},
			hidelist(){
			  this.fold = true;
		},
    empty() {
      this.selectFoods.forEach(food => {
        food.count = 0;
      });
		},
		pay(){
			if(this.totalPrice<this.minPrice){
				return;
			}
			window.alert('需要支付'+this.totalPrice+'元')
		}
	
  },
  components: {
    cartcontrol
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin';

.shopcard {
	position: fixed;
	left: 0;
	bottom: 0;
	height: 48px;
	width: 100%;
	z-index: 50;

	.content {
		display: flex;
		background: #141d27;
		font-size: 0;
		color: rgba(255, 255, 255, 0.4);

		.content-left {
			flex: 1;

			.logo-wrapper {
				display: inline-block;
				position: relative;
				top: -10px;
				margin: 0 12px;
				padding: 6px;
				width: 56px;
				height: 56px;
				box-sizing: border-box;
				vertical-align: top;
				border-radius: 50%;
				background: #141d27;

				.logo {
					width: 100%;
					height: 100%;
					border-radius: 50%;
					background: #2b343c;
					text-align: center;

					&.hightlight {
						background: rgb(0, 160, 220);
					}

					.icon-shopping_cart {
						line-height: 44px;
						font-size: 24px;
						color: #80858a;

						&.hightlight {
							color: rgb(255, 255, 255);
						}
					}
				}

				.num {
					position: absolute;
					top: 0;
					right: 0;
					font-size: 9px;
					color: #fff;
					background-color: rgb(240, 20, 20);
					line-height: 16px;
					width: 24px;
					height: 16px;
					border-radius: 16px;
					font-weight: 700;
					text-align: center;
					box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
				}
			}

			.price {
				display: inline-block;
				line-height: 24px;
				margin-top: 12px;
				box-sizing: border-box;
				border-right: 1px solid rgba(255, 255, 255, 0.1);
				font-size: 16px;
				font-weight: 700;
				padding: 0 12px 0 0;

				&.hightlight {
					color: rgb(255, 255, 255);
				}
			}

			.desc {
				display: inline-block;
				vertical-align: top;
				line-height: 24px;
				margin: 12px 0 0 12px;
				font-size: 10px;
			}
		}

		.content-right {
			flex: 0 0 105px;
			width: 105px;

			.pay {
				height: 48px;
				line-height: 48px;
				font-size: 12px;
				text-align: center;
				font-weight: 700;

				&.not-enough {
					background: #2b333b;
				}

				&.enough {
					background: #00b43c;
					color: #fff;
				}
			}
		}
	}

	.ball-content {
		.ball {
			position: fixed; // 这个小球是相对于视口做动画所以是fixed布局
			width: 32px;
			height: 32px;
			bottom: 22px;
			left: 32px;
			z-index: 200;
			transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41); // cubic-bezier曲线运动
		}

		.inner { // 最终落点的位置
			width: 16px;
			height: 16px;
			border-radius: 50px;
			background: rgb(0, 160, 220);
			transition: all 0.4s linear;
		}
	}

	.shopcart-list {
		position: absolute;
		left: 0;
		top: 0;
		z-index: -1;
		width: 100%;
		transform: translate3d(0, -100%, 0);

		&.fold-enter-active, &.fold-leave-active {
			transition: all 0.5s;
		}

		&.fold-enter, &.fold-leave-active {
			transform: translate3d(0, 0, 0);
		}

		.list-header {
			height: 40px;
			line-height: 40px;
			background: #f3f5f7;
			border-bottom: 1px solid rgba(7, 17, 27, 0.1);
			padding: 0 18px;

			.title {
				float: left;
				font-size: 14px;
				color: rgb(7, 17, 27);
			}

			.empty {
				float: right;
				font-size: 12px;
				color: rgb(0, 160, 220);
			}
		}

		.list-content {
			padding: 0 18px;
			max-height: 217px;
			background: #fff;
			overflow: hidden;

			.food {
				position: relative;
				padding: 12px 0;
				box-sizing: border-box;
				border-1px(rgba(7, 17, 27, 0.1));

				.name {
					line-height: 24px;
					font-size: 14px;
				}

				.price {
					position: absolute;
					right: 90px;
					bottom: 12px;
					line-height: 24px;
					color: rgb(240, 20, 20);
					font-weight: 700;
				}

				.cartcontrol-wrapper {
					position: absolute;
					right: 0;
					bottom: 16px;
				}
			}
		}
	}
}

.list-mask {
	position: fixed;//相当于窗口定位  所以position:fixed
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 40; //	z-index: 40； 小于shopcard的z-index
	backdrop-filter: blur(10px);
	opacity: 1;
	background: rgba(7, 17, 27, 0.6)
	&.fade-enter-active, &.fade-leave-active {
		transition: all 0.5s;
	}

	&.fade-enter, &.fade-leave-active {
		opacity: 0;
		background: rgba(7, 17, 27, 0);
	}
}
</style>
