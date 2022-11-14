<template>
    <div class="form">
        <h2 class="title" v-html="$store.state.words.insert_otp"></h2>
        <form class="form_steps" @submit.prevent="validateOtp()">
            <div class="form-item">
                <input input-mode="numeric" type="number" id="otp" v-model="otp" autocomplete="off" required/>
                <label for="otp" v-html="$store.state.words.my_otp_is"></label>
            </div>
            <div class="btn_wrapper">
                <button type="button" class="btn btn-primary" :disabled="allowCodeSend" @click="startCountdown">
                  <vue-countdown v-if="allowCodeSend" :time="60000" @end="onCountdownEnd" v-slot="{ totalSeconds }">{{ $store.state.words.send_more_code }} {{ totalSeconds }}</vue-countdown>
                  <span v-else >{{$store.state.words.send_code}}</span>
                </button>
                <input type="submit" class="btn" :value="words.procced"/>
            </div>
        </form>
    </div>
</template>
<script>
import VueCountdown from '@chenfengyuan/vue-countdown';

export default {
  components: { VueCountdown },
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
            allowCodeSend:true,
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
      startCountdown(){
        this.$emit('sendOtp');
        this.allowCodeSend = true;
      },
      onCountdownEnd() {
        this.allowCodeSend = false;
      },
      validateOtp(){

			var phone = '';
			this.allow_code_send = false;
			if(this.activeItem && this.activeItem.number && this.activeItem.number.length != '')
				{
					phone = this.activeItem.number;
				}
			else{
				phone = this.phoneNumber;
			}
			this.api({ action: 'api/validate_otp', data:{ phone:phone ,code: this.otp }}, (data) => {
					if(data.data.error && data.data.error != "")
					{
						this.activateError(data.data.error);
					}
					else{
              this.$emit("success");
					}
					
                });
		},
    }
}
</script>