<template>
    <div class="form">
        <h2 class="title" v-html="words.number_to_activate"></h2>
        <div id="number_and_arrows">
            <div>
                <a v-if="is_prev" class="move" @click="changeActiveNumber('prev')" v-html="words.prev_num"></a>
            </div>
            <div id="active_number_input" v-html="activeItem.number"></div>
            <div>
                <a v-if="is_next" class="move" @click="changeActiveNumber('next')" v-html="words.next_num"></a>
            </div>
        </div>
        <form class="small_form" @submit.prevent="submit()">
            <div class="invoice_wrapper">	
                <div :class="'option '+(activeItem.sim == '1' ? 'active' : '')" @click="activeItem.sim = 1">
                    <div class="small_title bold" v-html="words.i_have_esim"></div>
                    <div class="radio"></div>
                </div>
                <div :class="'option '+(activeItem.sim == '2' ? 'active' : '')" @click="activeItem.sim = 2">
                    <div class="small_title bold" v-html="words.i_have_sim"></div>
                    <div class="radio"></div>
                    <div class="form-item" style="margin-top: 20px" v-if="activeItem.sim == '2'">
                        <input input-mode="numeric" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"  maxlength="6" type="number" id="iccid" v-model="activeItem.iccid" autocomplete="off" required/>
                        <label for="iccid" v-html="words.last_six_dig"></label>
                    </div>
                </div>
                <div :class="'option '+(activeItem.sim == '0' ? 'active' : '')" @click="activeItem.sim = 0">
                    <div class="small_title bold" v-html="words.delivery_guy"></div>
                    <div class="radio"></div>
                    <template v-if="activeItem.sim == '0'">
                        <form @submit.prevent="save_number_info()">
                            <div class="small_title" v-html="words.whats_your_city"></div>
                            <div class="form-item">
                                <input  type="text" id="city" v-model="personal_info.city" autocomplete="off" required/>
                                <label for="city" v-html="words.city"></label>
                            </div>
                            <div class="small_title" v-html="words.whats_your_address"></div>
                            <div class="options">
                                <div class="form-item">
                                    <input type="text" id="street" v-model="personal_info.street" autocomplete="off" required/>
                                    <label for="street" v-html="words.street"></label>
                                </div>
                                <div class="form-item">
                                    <input type="number" id="house_num" v-model="personal_info.house_num" autocomplete="off" required/>
                                    <label for="house_num" v-html="words.house_num"></label>
                                </div>
                            </div>
                            <div class="form-item">
                                <input inputmode="numeric" type="text" id="zip" v-model="personal_info.zip" autocomplete="off" required/>
                                <label for="zip" v-html="words.zip"></label>
                            </div>
                            <div class="btn_wrapper">
                                <input type="submit" class="btn" :value="words.send_to_mail" />
                            </div>
                        </form>
                    </template>
                </div>
            </div>
            <div class="small_title bold" v-html="words.chnage_user_name"></div>
            <div class="form-item">
                <input type="text" id="user_name" v-model="activeItem.user_name" autocomplete="off" />
                <label for="house_num" v-html="words.my_user_name"></label>
            </div>
            <div class="btn_wrapper" v-if="activeItem.sim != '0'">
                <input type="submit" class="btn" :value="words.procced" />
            </div>
        </form>
    </div>
</template>
<script>
export default {
  components: { },
  props: {
    step: {
      required: true,
      type: Number,
    },

    numbers: {
      required: true,
      type: Array,
    },
    
  },
    data() {
        return {
            phoneNumber:'',
            activeNumber:0,
            userLoged:true
        }
    },
    mounted(){

    },
    computed: {
      words() {
        return this.$store.state.words
      },
      isNext(){
        if(!this.numbers[(this.activeItem.id + 1)])
            {
                return false;
            }
        return this.numbers[(this.activeItem.id + 1)].id; 
    },
    isPrev(){
        if(!this.numbers[(this.activeItem.id - 1)])
            {
                return false;
            }
        return this.numbers[(this.activeItem.id - 1)].id; 
    },
    activeItem(){
        var item = {};
        for(let i in this.numbers)
            {
                if(this.numbers[i].id == this.activeNumber)
                    {
                        item = this.numbers[i];
                    }
            }
        return item;  
        }, 
    },
    methods:{
        changeActiveNumber(type){
			if(type == 'next')
				{
					this.activeNumber = this.is_next;
				}
			else{
					this.activeNumber = this.is_prev;
			}
		},
        loadData: function(){
			if(this.userLoged == true)
				{
					this.load_numbers();
                }
                else{
                    this.$emit('changeStep', 2)
                }
                
                this.loaded = true;	
		},
        }
}
</script>