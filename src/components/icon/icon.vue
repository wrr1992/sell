<template>
<div >
 <ul class="supports" v-if="top===2">
	<li class="support-item border-1px" v-for="(item,index) in supports" :key="index" >
		<span :class="classMap[supports[index].type]+' icon'+size"></span>
		<span class="text">{{supports[index].description}}</span>
	</li>
</ul>
<ul v-else="top===1">
	<li class="support-item ">
	<span :class="classMap[supports[0].type]+' icon'+size"></span>	
	<span class="text">{{supports[0].description}}</span>
	</li>
</ul>
</div>

</template>

<script type="text/ecmascript-6">

export default {
  props: {
    size: {
      type: Number,
      default: 2
    },

    supports: {
      type: Array
    },
    top: {
      type: Number,
      default: 2
    }
  },
  iconNumber() {
    size = this.size;
    return size;
  },
  created() {
    this.classMap = ["decrease", "discount", "special", "invoice", "guarantee"];
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin';

.supports {
	.support-item {

		.icon1 {
			vertical-align: top;
			display: inline-block;
			width: 12px;
			height: 12px;
			margin: 0 4px 0 0;
			background-size: 12px 12px;
			background-repeat: no-repeat;

			&.decrease {
				bg-image('decrease_1');
			}

			&.discount {
				bg-image('discount_1');
			}

			&.guarantee {
				bg-image('guarantee_1');
			}

			&.invoice {
				bg-image('invoice_1');
			}

			&.special {
				bg-image('special_1');
			}
		}

		.icon2 {
			vertical-align: top;
			display: inline-block;
			width: 16px;
			height: 16px;
			margin: 0 6px 0 0;
			background-size: 16px 16px;
			background-repeat: no-repeat;

			&.decrease {
				bg-image('decrease_2');
			}

			&.discount {
				bg-image('discount_2');
			}

			&.guarantee {
				bg-image('guarantee_2');
			}

			&.invoice {
				bg-image('invoice_2');
			}

			&.special {
				bg-image('special_2');
			}
		}

		.icon3 {
			vertical-align: top;
			display: inline-block;
			width: 12px;
			height: 12px;
			margin: 0 6px 0 0;
			background-size: 12px 12px;
			background-repeat: no-repeat;

			&.decrease {
				bg-image('decrease_3');
			}

			&.discount {
				bg-image('discount_3');
			}

			&.guarantee {
				bg-image('guarantee_3');
			}

			&.invoice {
				bg-image('invoice_3');
			}

			&.special {
				bg-image('special_3');
			}
		}

		.icon4 {
			vertical-align: top;
			display: inline-block;
			width: 16px;
			height: 16px;
			margin: 0 6px 0 0;
			background-size: 16px 16px;
			background-repeat: no-repeat;

			&.decrease {
				bg-image('decrease_4');
			}

			&.discount {
				bg-image('discount_4');
			}

			&.guarantee {
				bg-image('guarantee_4');
			}

			&.invoice {
				bg-image('invoice_4');
			}

			&.special {
				bg-image('special_4');
			}
		}

		
	}
}
</style>
