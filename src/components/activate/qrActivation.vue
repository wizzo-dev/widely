<template>
    <div class="form">
        <h2 class="title" v-html="$store.state.words.activate_esim_scan"></h2>
        <qrcode-vue :value="qrCode" :size="qrSize" level="H" id="qrCode"/>
        <a class="btn" @click="downloadImage" v-html="$store.state.words.activate_esim_download"></a>
        <h2 class="title" v-html="$store.state.words.activate_esim_send_to_mail"></h2>
        <form class="form_steps" @submit.prevent="sendQrToMail()" style="margin-bottom: 50px">
            <div class="form-item">
                <input inputmode="email" type="text" id="email" v-model="email" autocomplete="off" required/>
                <label for="otp" v-html="$store.state.words.my_email_is"></label>
            </div>
            <div class="btn_wrapper">
                <input type="submit" class="btn" :value="$store.state.words.send_to_mail" />
            </div>
        </form>
        <div class="btn_wrapper">
            <input type="submit" @click="finish" class="btn" :value="$store.state.words.finish"/>
        </div>
    </div>
</template>
<script>
  import QrcodeVue from 'qrcode.vue'

export default {
  components: { QrcodeVue },
  props: {
    qrCode: {
      required: true,
      type: Text,
    },
  },
    data() {
        return {
            phoneNumber:'',
            email:'',
            qrSize:300,
            qrValue:'LPA:1$smdp.io$4K-1M7L9N-1FGG29N',
            activeNumber:0,
            userLoged:true
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
        downloadImage(){
            const link = document.createElement('a');
            link.download = 'QrCode.png';
            link.href = document.getElementById('qrCode').toDataURL();
            link.click();
        },
        sendQrToMail()
		{
			this.api({ action: 'sendQrToMail', data: { qr: this.qrCode, email:this.email }} , (data) => {
                if(data.data.error && data.data.error != "")
                {
                    this.activateError(data.data.error);
                }
                else{
                    this.activateSuccess(this.$store.state.words.send_succesfuly);
                }	 
            });
		},		
		finish(){
			this.api({ action: 'api/get_open_order_numbers', data: {}}, (data) => {
			if(data.data.error && data.data.error != "")
				{
					this.activateError(data.data.error);
				}
			else{
				if(data.data.length > 0)
					{
                        this.$emit('loadData');
					}
				else{
					this.activateSuccess(this.$store.state.words.finish_all);
                        this.api({ action: 'cart/finish'});
                        setTimeout( ()=> {
                                document.location = '/';
                        },3000);
                    }
				}

			});
		},	
    }
}
</script>