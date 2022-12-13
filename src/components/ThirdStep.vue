<template>
	<div class="form">
		<div class="step_title">{{ words.step }} {{ step }}</div>
		<h2 class="title">{{ words.hey }} {{ form.first_name }}, {{ words.whats_your_address }}</h2>
		<form class="small_form" @submit.prevent="$emit('saveData', {...form, city: selectedCity, street: selectedStreet})">
			<div class="small_title">{{ words.whats_your_city }}</div>
			<div class="form-item" >
				<Select2 v-model="selectedCity" :required="true" :settings="settingsCity" @select="onSelectCity()"/>
			</div>
			<div class="small_title" v-if="openStreet">{{ words.whats_your_street }}</div>
			<div class="form-item" v-if="openStreet">
				<Select2 v-model="selectedStreet" :required="true" :settings="settingsStreet" />
			</div>
			<div class="small_title">{{ words.whats_your_address }}</div>
			<div class="options">
				
				<div class="form-item">
					<input type="number" id="house_num" v-model="form.house_num" autocomplete="off" required/>
					<label for="house_num">{{ words.house_num }}</label>
				</div>
			</div>
			<div class="form-item">
				<input inputmode="numeric" type="number" id="zip" v-model="form.zip" autocomplete="off" required oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" maxlength="9"/>
				<label for="zip">{{ words.zip }}</label>
			</div>
			<div class="btn_wrapper">
				<a class="go_back under_line" @click="$emit('returnStep')" tabindex="0">{{ words.return_step }}</a>
				<input type="submit" class="btn" :value="words.procced" />
			</div>
		</form>
	</div>
</template>

<script>
import Select2 from 'vue3-select2-component';
export default {
  data() {
    return {
		form:{},
		cities: ["vach"],
		selectedCity: '',
		openStreet: false,
		selectedStreet:'',
		isLoading: false,
		settingsCity: {
			language: {
					noResults(){ return "לא נמצאו תוצאות";},
					searching() { return "מחפש.."; }
				},
				dir: "rtl",
			ajax: {
				url: window.api_url + 'get_cities',
				headers:{"Authorization" : localStorage.getItem('user_token')},
				data(params) {
					var query = {
						search: params.term,
						_type: 'query',
						name: params.term
					};	  
					return query;
				},
				processResults(response) {
					let list = response.data.items; 
					var ret = [];
					for (let i in list) ret.push({id: list[i].id, text: list[i].name});
					return {
						results:ret
					};
				},
			
			}
		},
		settingsStreet: {
			language: {
					noResults(){ return "לא נמצאו תוצאות";},
					searching() { return "מחפש.."; }
				},
				dir: "rtl",
				ajax: {
				url: window.api_url + 'get_streets',
				headers:{"Authorization" : localStorage.getItem('user_token')},
				data(params) {
					var query = {
						search: params.term,
						_type: 'query',
						name: params.term
					};	  
					return query;
				},
				processResults (response) {
					let list = response.data.items; 
					var ret = [];
					for (let i in list) ret.push({id: list[i].id, text: list[i].name});
					return {
						results:ret
					};
				},
			
			}
		},
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
   mounted() {
	if (this.parentForm && Object.entries(this.parentForm).length) {

		this.form = {...this.parentForm}
		this.selectedCity = this.parentForm.city;
		this.selectedStreet = this.parentForm.street;
	}
  },
  computed: {
    words() {
      return this.$store.state.words
    },
  },
  methods: {
	onSelectCity() {
		this.openStreet = true
		this.api({action: 'cart/save_city',data: { city: this.selectedCity }});
	},
  },
components: {Select2},
}
</script>

<style>

</style>