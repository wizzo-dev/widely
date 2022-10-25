<template>
	<div class="form">
		<div class="step_title">{{ words.step }} {{ step }}</div>
		<h2 class="title">{{ words.hey }} {{ form.first_name }}, {{ words.whats_your_address }}</h2>
		<form class="small_form" @submit.prevent="save_cart_data()">
			<div class="small_title">{{ words.whats_your_city }}</div>
			<div class="form-item" >
				<!-- <multiselect id="city_select" v-model="value" :options="options" :custom-label="nameWithLang" placeholder="Select one" label="name" track-by="name"></multiselect> -->
			</div>
			<div class="small_title" v-if="openStreet">{{ words.whats_your_street }}</div>
			<div class="form-item" v-if="openStreet">
				<!-- <MultiSelect id="street_select"></MultiSelect> -->
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
				<a class="go_back under_line" @click="return_step()" tabindex="0">{{ words.return_step }}</a>
				<input type="submit" class="btn" :value="words.procced" />
			</div>
		</form>
	</div>
</template>

<script>
export default {
  data() {
    return {
		form:{},
		cities: [],
		openStreet: false
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
  },
  mounted() {
	this.getCities()
  },
  computed: {
    words() {
      return this.$store.state.words
    },
  },
  methods: {
	getCities() {
      this.api({action: 'get_cities',data: { numbers_array: this.numbersInfo },}, (data)=>{
			console.log(data.data);
	})
	}
  }
}
</script>

<style>

</style>