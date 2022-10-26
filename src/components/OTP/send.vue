<template>
    <div class="form">
        <h2 class="title" v-html="words.activate_title"></h2>
        <form class="form_steps" @submit.prevent="send_otp()">
            <div class="form-item">
                <input input-mode="numeric" type="number" id="phone" v-model="phoneNumber" autocomplete="off" required/>
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
    
    activeItem: {
      required: true,
      type: Array,
    },
    
  },
    data() {
        return {
            phoneNumber:'',
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
        send_otp(move = false)
		{
			this.api_call({ url: 'api/send_otp', data: { number:this.phoneNumber }, onComplete: (data) => {
                if(data.data.error && data.data.error != "")
					{
						this.activateError(data.data.error);
					}
                    else{
                        if(data.data)
                        {
                            this.$emit("success");
                        }
                        else{
                            this.activateError(this.words.goto_help);
                        }
                    }
				 	
                }});
		},
    }
}
</script>