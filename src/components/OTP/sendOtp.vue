<template>
    <div class="form">
        <h2 class="title" v-html="words.activate_title"></h2>
        <form class="form_steps" @submit.prevent="sendOtp()">
            <div class="form-item">
                <input input-mode="numeric" type="number" id="phone" v-model="phoneNumberLocal" autocomplete="off" required/>
                <label for="phone" v-html="words.my_number_is"></label>
            </div>
            <div class="small_title" v-html="words.how_send_otp"></div>
            <div class="radio_wrapper">
                <div class="container">
                    <input type="radio" id="sms_input" name="send_type" value="SMS" v-model="send_type">
                    <label for="sms_input" class="checkmark"></label>
                    <label for="sms_input">{{words.sms}}</label>
                </div>
                <div class="container">
                    <input type="radio" id="call_input" name="send_type" value="CALL" v-model="send_type">
                    <div  class="checkmark"></div>
                    <label for="call_input">{{words.call}}</label>
                </div>
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
            phoneNumberLocal:'',
            send_type:'SMS'
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
            let phoneNumber = this.phoneNumberLocal ;
          
			this.api({ action: 'api/send_otp', data: { number:phoneNumber ,type: this.send_type}}, (data) => {
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
<style scoped lang="scss">
.radio_wrapper{
    display: flex;gap:30px;margin-bottom: 20px;
/* The container */
.container {
    border:none;
    display: block;
    position: relative;
    padding: 0 0 0 35px;
    cursor: pointer;
    font-size: 22px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  label{
    @media (max-width: 600px) {font-size: 15px;}
  }
  
  /* Hide the browser's default radio button */
  .container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }
  
  /* Create a custom radio button */
  .checkmark {
    position: absolute;
    top: 5px;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: #eee;
    border-radius: 50%;
  }
  
  /* On mouse-over, add a grey background color */
  .container:hover input ~ .checkmark {
    background-color: #ccc;
  }
  
  /* When the radio button is checked, add a blue background */
  .container input:checked ~ .checkmark {
    background-color: #6fda8c;
  }
  
  /* Create the indicator (the dot/circle - hidden when not checked) */
  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }
  
  /* Show the indicator (dot/circle) when checked */
  .container input:checked ~ .checkmark:after {
    display: block;
  }
  
  /* Style the indicator (dot/circle) */
  .container .checkmark:after {
       top: 9px;
      left: 9px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: white;
  }
      
}

</style>