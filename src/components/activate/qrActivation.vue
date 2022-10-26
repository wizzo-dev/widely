<template>
    <div class="form">
        <h2 class="title" v-html="$store.state.words.activate_esim_scan"></h2>
        <qrcode-vue :value="qrValue" :size="qrSize" level="H" id="qrCode"/>
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
    step: {
      required: true,
      type: Number,
    },
  },
    data() {
        return {
            phoneNumber:'',
            email:'',
            qrSize:300,
            qrValue:'LPA:1$smdp.io$4K-1M7KT9-18MJUAY',
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
        if(!this.numbers[(this.active_item.id + 1)])
            {
                return false;
            }
        return this.numbers[(this.active_item.id + 1)]; 
    },
    isPrev(){
        if(!this.numbers[(this.active_item.id - 1)])
            {
                return false;
            }
        return this.numbers[(this.active_item.id - 1)]; 
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
        downloadImage(){
            const link = document.createElement('a');
            link.download = 'QrCode.png';
            link.href = document.getElementById('qrCode').toDataURL();
            link.click();
        },
        sendQrToMail: function()
		{
			this.api({ action: 'sendQrToMail', data: { qr: this.qrValue, email:this.email }} , (data) => {
                if(data.data.error && data.data.error != "")
                {
                    this.activateError(data.data.error);
                }
                else{
                    this.alert(this.$store.state.words.send_succesfuly);
                }	 
            });
		},
        }
}
</script>