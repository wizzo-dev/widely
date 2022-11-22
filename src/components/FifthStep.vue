<template>
	<div class="form" >
		<div class="step_title" v-html="words.step+' '+ step"></div>
		<h2 class="title" v-html="words.payment_info"></h2>
		<a class="go_back under_line" @click="$emit('returnStep')" tabindex="0" v-html="words.return_step"></a>
		<iframe :src="'https://widely.co.il/payments/do_redirect/'+ paymentId" v-if="paymentId > 0"></iframe>
	</div>
</template>

<script>
export default {
  data() {
    return {
		isLoading: false,
		loaded:false,
		paymentId:0,
		credit:{
			number:'',
			id:'',
			expire:'',
			cvv:''
		},
	}
  },
  props: {
    step: {
      required: true,
      type: Number,
    },
  },
  computed: {
    words() {
      return this.$store.state.words
    },
  },
  mounted(){
	this.getPayment();
  },
  methods: {
		getPayment() {
			this.$store.commit('setIsLoading', {isLoading: true});
			this.api({ action: 'create_payment'}, (data)=> {
				this.paymentId = data.data;
			this.$store.commit('setIsLoading', {isLoading: false});
			})
		},
  },
}
</script>

<style>
	iframe{border: none;height: 700px;width: 100%;}
</style>