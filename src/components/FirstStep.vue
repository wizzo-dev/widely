<template>
  <div class="form">
    <div class="step_title">{{ words.step }} {{ step }}</div>
    <h2 class="title" v-html="words.choose_number"></h2>
    <h3 class="sec_title_step" v-html="words.first_step_sec_title"></h3>
    <div id="numbers_wrapper">
      <div
        class="number_wrapper"
        :class="{ alert: activeItem.alert }"
        @click="activeItem.alert ? (activeItem.alert = false) : ''"
      >
        <div
          v-if="numbersInfo.length > 1"
          class="trash"
          @click="removeNumber(activeItem)"
        >
          <i class="far fa-trash-alt"></i>
        </div>
        <div class="pack_num" v-html="activeIndex"></div>
        <div class="options">
          <a
            :class="'tab ' + (activeItem.has_number == '1' ? 'active' : '')"
            @click="changeHasNum(activeItem, true)"
            v-html="words.has_number"
          ></a>
          <a
            :class="'tab ' + (activeItem.has_number == 0 ? 'active' : '')"
            @click="changeHasNum(activeItem, false)"
            v-html="words.dont_has_number"
          ></a>
        </div>
        <form v-if="activeItem.has_number">
          <div class="form-item">
            <div class="flag" :title="words.change_country"></div>
            <input
              inputmode="numeric"
              oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
              maxlength="13"
              type="text"
              id="phone_number"
              v-model="activeItem.phone_number"
              autocomplete="off"
              required
            />
            <label for="phone_number" v-html="words.my_number_is"></label>
          </div>
        </form>
        <form id="choose_number" v-else>
          <template v-if="numbers && numbers.length > 0">
            <div class="options">
              <template v-for="(number, i) in numbers" :key="i">
                <a
                  @click="setActiveNumber(number)"
                  :class="
                    'number ' +
                    (number.number == activeItem.phone_number ? 'active' : '')
                  "
                  >{{ number.number }}</a
                >
              </template>
              <a
                class="chose_number"
                @click="getNumbers()"
                v-html="words.mix_numbers"
              ></a>
            </div>
          </template>
        </form>
        <div class="prods_wrapper">
          <div class="prod" v-for="(prod, i) in activeItem.products" :key="i">
            <div class="checkbox">
              <label class="container_check">
                <input
                  type="checkbox"
                  v-model="prod.active"
                  @input="toggleProduct(activeItem, prod)"
                />
                <span class="checkmark"></span>
              </label>
            </div>
            <div class="content">
              <div class="title_prod bold" >
                {{prod.name}}
                <template v-if="prod.price > 0">
                  /
                  <span class="semi_bold add_ils" v-html="prod.price"></span>
                  <span
                    class="deleted_price add_ils"
                    v-html="prod.deleted_price"
                  ></span>
                </template>
              </div>
              <div class="sub_title semi_bold" v-html="prod.description"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="btn_wrapper">
      <a
        v-if="numbersInfo.length < 5"
        class="btn dashed"
        @click="addNumber(true)"
        tabindex="0"
        v-html="words.add_new_number"
      ></a>
      <div class="paging">
        <template v-for="(item, i) in numbersInfo" :key="i">
          <a
            :class="{ active: item.id == activeItem.id }"
            class="item_page"
            @click="setActiveNumberById(item.id)"
            >{{ i + 1 }}</a
          >
        </template>
      </div>
      <a
        class="btn"
        @click="numbersValidation(true)"
        tabindex="0"
        v-html="words.procced"
      ></a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    numbersInfo: {
      required: true,
      type: Array,
    },
    activeNumber: {
      required: true,
      type: Number,
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
  computed: {
    words() {
      return this.$store.state.words
    },
    activeItem() {
      let item = {}
      
      for (let i in this.numbersInfo){
        
        if (this.numbersInfo[i].id == this.activeNumber) item = this.numbersInfo[i]
      }
      if (item.products) {
          item.products = item.products.map(prod=>{
            prod.active = !!prod.active
          return prod
        })
      }
      return item
    },
    activeIndex() {
      let item = 0
      for (let i in this.numbersInfo) {
        item++
        if (this.numbersInfo[i].id == this.activeNumber) return item
      }
      return item
    },
  },
  methods: {
    setActiveNumber(number){
    this.numbersValidation();
    this.activeItem.phone_number = number.number
    },
     setActiveNumberById(id){
     this.$emit('setActiveNumber', id);
    },
    numbersValidation(next){
    this.$emit('numbersValidation', next)
    },
    toggleProduct(num,prod) {
    this.$emit('toggleProd', num,prod)
	},
    removeNumber(num) {
	this.api({ action: 'cart/remove_number', data: { phone_number: num.phone_number, id:num.id }} , () => {
		this.loadData(false,true);
	});		
	},
	changeHasNum(num,status) {
	num.has_number = status
	this.activeItem.phone_number = ""
	this.api({ action: 'cart/change_has_num', data: { id:num.id, status } });
	},
    getNumbers() {
        this.$emit('getNumbers')
    },
    addNumber() {
          this.api({ action: 'cart/numbers_validation', data: { numbers_array: this.numbersInfo }, }, (data) => {
            if(data.data.error && data.data.error != "") this.activateError(data.data.error);
            else{	
              if(data.data.id_false > 0 && !data.data.status) {
                for(let i in this.numbersInfo)
                  {
                    if(this.numbersInfo[i].id == data.data.id_false) {
                      this.setActiveNumberById(this.numbersInfo[i].id);
                      this.activeItem.alert = true;
                    }
                  }
              }
              else {
                this.$emit('addNewNumber');
              }
            }
            });
		},
  }
}
</script>

<style></style>
