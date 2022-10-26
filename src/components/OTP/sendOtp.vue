<template>
    <div class="form">
        <h2 class="title" v-html="words.activate_title"></h2>
        <form class="form_steps" @submit.prevent="sendOtp()">
            <div class="form-item">
                <input input-mode="numeric" type="number" id="phone" v-model="phoneNumberLocal" autocomplete="off" required/>
                <label for="phone" v-html="words.my_number_is"></label>
            </div>
            <div class="btn_wrapper">
                <input type="submit" class="btn" :value="words.procced"/>
            </div>
        </form>
    </div>
</template>
<script>
export default {
  components: { },
  props: {
    phoneNumber: {
      required: true,
      type: Text,
    },
    
  },
    data() {
        return {
            phoneNumberLocal:''
        }
    },
    mounted(){
        if(this.phoneNumber != '') this.phoneNumberLocal = this.phoneNumber;
    },
    computed: {
      words() {
        return this.$store.state.words
      }
    },
    methods:{
        sendOtp()
		{
            let phoneNumber = '0'+this.phoneNumberLocal ;
            
			this.api({ action: 'api/send_otp', data: { number:phoneNumber }}, (data) => {
                if(data.data.error && data.data.error != "")
					{
						this.activateError(data.data.error);
					}
                    else{
                        if(data.data)
                        {
                            this.$emit("success" , phoneNumber);
                        }
                        else{
                            this.activateError(this.$store.state.words.goto_help);
                        }
                    }
                });
		},
    }
}
</script>