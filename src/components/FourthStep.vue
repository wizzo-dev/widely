<template>
	<div class="form" id="fourth_step" style="margin: 0" v-if="loaded">
			<div class="step_title" v-html="words.step+' '+ step"></div>
			<h2 class="title" v-html="words.where_to_send_invoice"></h2>
			<form class="" @submit.prevent="openUser()">
				<div class="invoice_wrapper">
					<div :class="'option '+(form.invoice_email ? 'active' : '')" @click="form.invoice_email = !form.invoice_email">
						<div class="small_title bold" v-html="words.email"></div>
						<div class="radio"></div>
						<div class="value semi_bold">
							{{ email }} <a class="change_number semi_bold" @click.stop="$emit('goToStep', 2)" v-html="words.change_number"></a>
						</div>
					</div>
					<div :class="'option '+(form.invoice_sms ? 'active' : '')" @click="form.invoice_sms = !form.invoice_sms">
						<div class="small_title bold" v-html="words.send_sms"></div>
						<div class="radio"></div>
						<div class="value semi_bold">
							{{ phone }} <a class="change_number semi_bold" @click.stop="$emit('goToStep', 2)" v-html="words.change_number"></a>
						</div>
					</div>
				</div>
				<div class="terms">
					<h4 class="inner_title" v-html="words.read_terms"></h4>
					<div class="pdf_wrapper">
						<div v-html="terms"></div>
					</div>
					<div class="sig_wrapper">
					<h4 class="inner_title" v-html="words.sign_terms"></h4>
					<SignaturePad :width="300" :height="100" :customStyle="sigPadStyle" ref="signaturePad"  />
					<div class="sig_controls">
						<a @click="clearSig" class="btn_clear_sig" v-html="words.clear_signature"></a>
					</div>
					</div>
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
		form:{
			invoice_sms: false, // invoice sending method, 0 = mail, 1 = SMS,
			invoice_email: false
		},
		isLoading: false,
		terms: '',
		loaded:false,
		numOfPages: 0,
		sigPadStyle: {border: 'black 1px solid', marginTop: '5px' }
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
    phone: {
      required: true,
      type: String,
    },
    email: {
      required: true,
      type: String,
    },
  },
  mounted(){
	this.$store.commit('setIsLoading', {isLoading: true});

	this.api({ action: 'get_terms', data: { } }, (data) => {
		this.terms = data.data.text;
		this.loaded = true;
		this.$store.commit('setIsLoading', {isLoading: false});

	});
  },
  computed: {
    words() {
      return this.$store.state.words
    },
  },
  methods: {
	urltoFile(url, filename, mimeType){
    mimeType = mimeType || (url.match(/^data:([^;]+);/)||'')[1];
    return (fetch(url)
        .then(function(res){return res.arrayBuffer();})
        .then(function(buf){return new File([buf], filename, {type:mimeType});})
    );
},
	onSelectCity() {
		this.openStreet = true;
		this.api({action: 'cart/save_city',data: { city: this.selectedCity }});
	},
	openUser() {
			this.$store.commit('setIsLoading', {isLoading: true});
			if (this.$refs.signaturePad.isEmpty()) this.activateError(this.words.signature_requierd)
			else {
				const { data } = this.$refs.signaturePad.saveSignature();
				const {invoice_sms, invoice_email} = this.form;				
				const formData = {signature: data, invoice_sms: +invoice_sms, invoice_email: +invoice_email}
				
				this.$emit('saveData',formData);


			}
			this.$store.commit('setIsLoading', {isLoading: false});
			
	},
	clearSig() {
      this.$refs.signaturePad.clearSignature();
    },
  },
}
</script>

<style lang="scss" scoped>
   #fourth_step{
	@media(max-width: 600px)
	{
		form{max-width: 97vw;overflow: hidden;}	
	}
	.pdf_wrapper{
		&{max-height: 200px;overflow-y: scroll;}
		@media (max-width: 600px) {margin: 0 10px;}
		@media (min-width: 600px) {}
	}
	.inner_title{    font-weight: 900;margin: 20px 0;text-decoration: underline;}
	.terms {
		&{display: flex;flex-direction: column;justify-content: center;text-align: initial;}
		@media (max-width: 600px) {align-items: center;}
		@media (min-width: 600px) {}

		.sig_wrapper{
			&{margin-bottom: 20px;}
			.btn_clear_sig{font-size: 16px;text-decoration: underline;}
		}
	}
   }
</style>