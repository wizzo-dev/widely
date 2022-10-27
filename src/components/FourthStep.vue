<template>
	<div class="form" >
			<div class="step_title" v-html="words.step+' '+ step"></div>
			<h2 class="title" v-html="words.where_to_send_invoice"></h2>
			<form class="small_form" @submit.prevent="openUser()">
				<div class="invoice_wrapper">
					<div :class="'option '+(form.invoice == '0' ? 'active' : '')" @click="form.invoice = 0">
						<div class="small_title bold" v-html="words.email"></div>
						<div class="radio"></div>
						<div class="value semi_bold">
							{{ form.email }} <a class="change_number semi_bold" @click="$emit('goToStep', 2)" v-html="words.change_number"></a>
						</div>
					</div>
					<div :class="'option '+(form.invoice == '1' ? 'active' : '')" @click="form.invoice = 1">
						<div class="small_title bold" v-html="words.send_sms"></div>
						<div class="radio"></div>
						<div class="value semi_bold">
							{{ form.phone_number }} <a class="change_number semi_bold" @click="$emit('goToStep', 2)" v-html="words.change_number"></a>
						</div>
					</div>
				</div>
				<div class="checkbox checkbox_approve">
					<label for="checkbox_approve" class="title_prod bold" v-html="words.approve_terms"></label>
					<label class="container_check">
							<input type="checkbox" id="checkbox_approve" v-model="approve"/>
							<span class="checkmark"></span>
					</label>
				</div>		
				<div class="btn_wrapper">
					<a class="go_back under_line" @click="$emit('returnStep')" tabindex="0" v-html="words.return_step"></a>
					<input type="submit" class="btn" :value="words.procced">
				</div>
			</form>
	</div>
</template>

<script>
export default {
  data() {
    return {
		form:{},
		approve: 0,
		isLoading: false,

	}
  },
  props: {
    numbersInfo: {
      required: true,
      type: Array,
    },
    step: {
      required: true,
      type: Number,
    },
    numbers: {
      required: true,
      type: Array,
    },
    skipPay: {
      required: true,
      type: Boolean,
    },
  },
  computed: {
    words() {
      return this.$store.state.words
    },
  },
  methods: {
	onSelectCity() {
		this.openStreet = true;
		this.api({action: 'cart/save_city',data: { city: this.selectedCity }});
	},
	openUser() {  
			this.$store.commit('setIsLoading', {isLoading: true});
			if(this.approve === 0) this.activateError(this.words.please_approve);
			else {
				this.$emit('saveData',null, true);
				
				if(this.skipPay) 
				return this.saveDidsToAccount();
				
				this.api({ action: 'api/add_account', data: { } }, (data) => {
					
					if(data.data.error && data.data.error != "") {
													
						this.activateError(data.data.error);
						return this.$store.commit('setIsLoading', {isLoading: true});
					}
					else if(data.data && !this.skipPay) {
						this.$emit('goToStep', this.step + 1);window.scrollTo(0,0); 
					}
				});
			}
			this.$store.commit('setIsLoading', {isLoading: true});
			
	},
	saveDidsToAccount() {
			this.$emit('saveData',null, true);
			this.api({ action: 'api/save_dids_to_account'}, (data)=>{
			if(data.data.error && data.data.error != "") {
			this.activateError(data.data.error);
			this.$store.commit('setIsLoading', {isLoading: true});
			} else document.location = '/activate';

			this.$emit('saveData',false);
			})
	},
  },
}
</script>

<style>

</style>