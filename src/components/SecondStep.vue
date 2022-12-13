<template>
<div class="form">
	<div class="step_title">{{ words.step }} {{ step }}</div>
	<h2 class="title" v-html="words.nice_to_meet_you"></h2>
	<form class="form_steps" @submit.prevent="submit()">
		<div class="small_title" v-html="words.what_id"></div>
		<div class="form-item">
			<input inputmode="numeric"
			oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" maxlength="9" id="id_card" v-model="form.id_card" autocomplete="off" required/>
			<label for="id_card" v-html="words.busines_id"></label>
		</div>
		<div class="form-item">
			<input type="text" id="company_name" autocomplete="off" v-model="form.company_name" />
			<label for="company_name"  v-html="words.company_name"></label>
		</div>
		<div class="small_title" v-html="words.whats_your_name"></div>
		<div class="options">
			<div class="form-item">
				<input type="text" id="first_name" v-model="form.first_name" autocomplete="off" required/>
				<label for="first_name" v-html="words.first_name"></label>
			</div>
				<div class="form-item">
				<input  type="text" id="last_name" v-model="form.last_name" autocomplete="off" required/>
				<label for="last_name" v-html="words.last_name"></label>
			</div>
		</div>
		<div class="small_title" v-html="words.how_well_get_in_touch"></div>
		<div class="form-item">
			<input inputmode="email" type="text" id="email" v-model="form.email" autocomplete="off" required/>
			<label for="email" v-html="words.my_email_is"></label>
		</div>
		<div class="form-item">
			<input inputmode="numeric"  type="tel" id="phone" v-model="form.phone_number" autocomplete="off" required/>
			<label for="phone" v-html="words.my_number_is"></label>
		</div>
		<div class="btn_wrapper">
			<a class="go_back under_line" @click="$emit('returnStep')" tabindex="0" v-html="words.return_step"></a>
			<input type="submit" class="btn" :value="words.procced" />
		</div>
	</form>
</div>
</template>
<script>
export default {
	data() {
		return {
		form: {
			id_card: '',
			first_name: '',
			last_name: '',
			email: '',
			phone_number: '',
			company_name: ''
			}
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
	parentForm: {
		required: true,
		type: Object,
	},
},
methods:{
	submit(){
		if(!(isNaN(this.form.id_card))){
			this.$emit('saveData', this.form);
		}
		else this.activateError(this.$store.state.words.insertValidId);
	}
},
mounted() {
	if (this.parentForm && Object.entries(this.parentForm).length) {
		this.form.id_card = this.parentForm.id_card;
		this.form.first_name = this.parentForm.first_name;
		this.form.last_name = this.parentForm.last_name;
		this.form.email = this.parentForm.email;
		this.form.phone_number = this.parentForm.phone_number;
	}
},
computed: {
	words() {
		return this.$store.state.words
	},
	},
}
</script>
