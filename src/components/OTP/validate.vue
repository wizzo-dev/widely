<template>
    <div class="form">
        <h2 class="title" v-html="words.insert_otp"></h2>
        <form class="form_steps" @submit.prevent="validate_otp()">
            <div class="form-item">
                <input input-mode="numeric" type="number" id="otp" v-model="otp" autocomplete="off" required/>
                <label for="otp" v-html="words.my_otp_is"></label>
            </div>
            <div class="btn_wrapper">
                <a v-if="!allow_code_send" style="pointer-events: none;opacity: 0.6" class="btn" v-html="words.send_more_code+ ' '+ timeLeft"></a>
                <a v-else @click="send_otp(true);allow_code_send = false;" class="btn" v-html="words.send_code"></a>
                <input type="submit" class="btn" :value="words.procced"/>
            </div>
        </form>
    </div>
</template>
<script>

export default {
  components: { },
  props: {
    
    activeItem: {
      required: true,
      type: Array,
    },
    phoneNumber: {
      required: true,
      type: Number,
    },
    
  },
    data() {
        return {
            allow_code_send:false,
            otp:'',
        }
    },
    mounted(){

    },
    computed: {
      words() {
        return this.$store.state.words
      }
    },
    methods:{
        validate_otp(){

			var phone = '';
			this.allow_code_send = false;
			if(this.activeItem && this.activeItem.number && this.activeItem.number.length != '')
				{
					phone = this.activeItem.number;
				}
			else{
				phone = this.phone_number;
			}
			window.api_call({ url: 'api/validate_otp', data:{ phone:phone ,code: this.otp },onComplete: (data) => {
					if(data.data.error && data.data.error != "")
					{
						this.activateError(data.data.error);
					}
					else{
                            this.$emit("success");
					}
					
                }});
		},
    }
}
</script>