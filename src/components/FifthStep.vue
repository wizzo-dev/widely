<template>
	<div class="form">
		<div class="step_title" v-html="words.step+' '+ step"></div>
		<h2 class="title" v-html="words.payment_info"></h2>
		<form class="small_form" @submit.prevent="saveCredit()">
			<div class="form-item">
				<input oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" 
						maxlength="16"  type="tel" id="card_number" v-model="credit.number" autocomplete="off" v-cardformat:restrictNumeric v-cardformat:formatCardNumber required/>
				<label for="card_number" v-html="words.card_number"></label>
			</div>
			<div class="form-item">
				<input oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"  maxlength="10"  type="number" id="card_id" v-model="credit.id" autocomplete="off" required/>
				<label for="card_id" v-html="words.card_id"></label>
			</div>
			<div class="options">
				<div class="form-item">
					<input oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" v-cardformat:formatCardExpiry  maxlength="5" id="expire" type="text" autocomplete="off" v-model="credit.expire" required>
					<label for="street" v-html="words.expire"></label>
				</div>
				<div class="form-item">
					<input oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" v-cardformat:formatCardCVC  maxlength="4" id="cvv" type="number" autocomplete="off" v-model="credit.cvv" required>
					<label for="street" v-html="words.cvv"></label>
				</div>
			</div>
			<div class="btn_wrapper">
				<a class="go_back under_line" @click="this.$emit('returnStep')" tabindex="0" v-html="words.return_step"></a>
				<input type="submit" class="btn" :value="words.pay">
			</div>
		</form>
	</div>
</template>

<script>
export default {
  data() {
    return {
		isLoading: false,
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
  methods: {
		saveCredit() {
			this.$store.commit('setIsLoading', {isLoading: true});
			this.show_loader = true;
			this.api({ action: 'api/save_dids', data: this.credit}, (data)=>{
				if(data.data?.error && data.data?.error != "") {
				this.activateError(data.data.error);
				this.$store.commit('setIsLoading', {isLoading: false});
				}
				// else document.location = '/activate';
					
			this.$store.commit('setIsLoading', {isLoading: false});
			})
		},
  },
}
</script>

<style>

</style>