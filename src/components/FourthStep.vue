<template>
	<div class="form" id="fourth_step" style="margin: 0" >
			<div class="step_title" v-html="words.step+' '+ step"></div>
			<h2 class="title" v-html="words.where_to_send_invoice"></h2>
			<form class="small_form" @submit.prevent="openUser()">
				<div class="invoice_wrapper">
					<div :class="'option '+(form.invoice == '0' ? 'active' : '')" @click="form.invoice = 0">
						<div class="small_title bold" v-html="words.email"></div>
						<div class="radio"></div>
						<div class="value semi_bold">
							{{ email }} <a class="change_number semi_bold" @click.stop="$emit('goToStep', 2)" v-html="words.change_number"></a>
						</div>
					</div>
					<div :class="'option '+(form.invoice == '1' ? 'active' : '')" @click="form.invoice = 1">
						<div class="small_title bold" v-html="words.send_sms"></div>
						<div class="radio"></div>
						<div class="value semi_bold">
							{{ phone }} <a class="change_number semi_bold" @click.stop="$emit('goToStep', 2)" v-html="words.change_number"></a>
						</div>
					</div>
				</div>
				<div class="terms">
					<div class="pdf_wrapper">
					</div>
					<div class="sig_wrapper">
					<h4 v-html="words.sign_terms"></h4>
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
			invoice: 0 // invoice sending method, 0 = mail, 1 = SMS
		},
		isLoading: false,
		pdfSrc: 'https://primemobile.co.il/media/terms.pdf',
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
			if (this.$refs.signaturePad.isEmpty()) this.activateError(this.words.signature_requierd)
			else {
				const { data } = this.$refs.signaturePad.saveSignature();
				const formData = {signature: data}
				this.$emit('saveData',formData, true);
				if(this.skipPay) return this.saveDidsToAccount();
				this.api({ action: 'api/add_account', data: { } }, (data) => {
					if(data.data.error && data.data.error != "") {
						this.activateError(data.data.error);
						return this.$store.commit('setIsLoading', {isLoading: false});
					}
					else if(data.data && !this.skipPay) {
						this.$emit('goToStep', this.step + 1);window.scrollTo(0,0); 
					}
				});
			}
			this.$store.commit('setIsLoading', {isLoading: false});
			
	},
	saveDidsToAccount() {
			this.$emit('saveData',null, true);
			this.api({ action: 'api/save_dids_to_account'}, (data)=>{
			if(data.data.error && data.data.error != "") {
			this.activateError(data.data.error);
			this.$store.commit('setIsLoading', {isLoading: false});
			} else document.location = '/activate';

			this.$emit('saveData',false);
			})
	},
	clearSig() {
      this.$refs.signaturePad.clearSignature();
    },
  },
}
</script>

<style lang="scss">
   #fourth_step{
	.terms {
		&{display: flex;flex-direction: column;justify-content: center;text-align: initial;}
		.sig_wrapper{
			&{margin-bottom: 20px;}
			.btn_clear_sig{font-size: 16px;text-decoration: underline;}
		}
	}
   }
</style>