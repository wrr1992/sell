<template>
  <div class="cartcontrol">
	 <transition name="move"> 
		<div class="cart-decrease" @click.stop.prevent="removeCart"  v-show="food.count>0"> 
			 <span class="inner icon-remove_circle_outline"></span>
		</div>
	</transition>
	  <div class="cart-count"  v-show="food.count>0">{{food.count}}</div>
	  <div class="cart-add icon-add_circle"  @click.stop.prevent="addCart"></div>
  </div>
</template>

<script type="text/ecmascript-6">
import Vue from "vue";
export default {
  props: {
    food: {
      type: Object
    }
  },
  created() {
    // 调试	console.log(this.food);
  },
  methods: {
    addCart(event) {
      if (!event._constructed) {
        //防止PC端多次被点击
        return;
      }
      if (!this.food.count) {
        Vue.set(this.food, "count", 1);
        // 给对象新增加或删除某个变化的时候
        // 需要用一个Vue.set接口， 这个变化能被观测到，然后通知相应的dom发生变化
        // this.food.count = 1;
      } else {
        this.food.count++;
      }
      
			this.$emit("add", event.target); //  @#￥% event.target 作为dom对象参数传入 父组件(goods 组件)
			
			// 这个 add event 是在哪定义的
    },
    removeCart(event) {
      if (!event._constructed) {
        //防止PC端多次被点击
        return;
      }
      if (this.food.count) {
        this.food.count--;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
.cartcontrol {
	font-size: 0;

	.cart-decrease {
		display: inline;
		padding: 6px;
		opacity: 1;
		transform: translate3D(0, 0, 0);

		.inner {
			display: inline-block;
			font-size: 24px;
			line-height: 24px;
			color: rgb(0, 160, 220);
			transition: all 0.4s linear;
			transform: rotate(0);
		}

		&.move-enter-active, &.move-leave-active {
			transition: all 0.4s linear;
		}

		&.move-enter, &.move-leave-active {
			opacity: 0;
			transform: translate3d(24px, 0, 0);

			.inner {
				transform: rotate(180deg);
			}
		}
	}

	.cart-count {
		width: 12px;
		padding-top: 6px;
		display: inline;
		font-size: 10px;
		line-height: 24px;
		color: rgb(147, 153, 159);
		text-align: center;
		vertical-align: top;
	}

	.cart-add {
		display: inline;
		padding: 6px;
		font-size: 24px;
		line-height: 24px;
		color: rgb(0, 160, 220);
	}
}
</style>
