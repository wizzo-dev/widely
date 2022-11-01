<template>
    <div id="join_us" v-if="loaded">
      <div class="wrapper">
        <div class="forms">
          <div class="steps" v-if="step > 0">
            <div v-if="isMobile()" :style="'width:' + step * 20 + '%'" id="border"></div>
            <div v-else id="border" :style="'height:' + step * 20 + '%'"></div>
            <ul>
              <li v-for="num in numberOfSteps" :class="'step ' + (step >= num ? 'active' : '')" :key="num" @click="step = num">
                <div class="checkbox"></div>
              </li>
            </ul>
          </div>
          <div id="form">
            <activateNumber v-if="step === 1" :step="step" :numbers="numbers" :personalInfo="personalInfo" @qrActivated="qrActivated" @sendOtpForMobility="sendOtpForMobility"/>
            <sendOtp v-if="step === 2" :phoneNumber="phoneNumber" @success="successOtpSend"/>
            <validateOtp v-if="step === 3" :phoneNumber="phoneNumber" @success="validateOtp"/>
            <activateQr v-if="step === 4" :qrCode="qrCode"/>
          </div>
        </div>
      </div>
      <div id="back_image" :style="'background-image:url(https://primemobile.co.il/themes/WID/images/step_' + (step <= 5 ? step : 2) + '.jpg)'">
        <div id="white_logo"></div>
      </div>
    </div>
  </template>
  <script>
  import activateNumber from '@/components/activate/activateNumber.vue'
  import activateQr from '@/components/activate/qrActivation.vue'
  import sendOtp from '@/components/OTP/sendOtp.vue'
  import validateOtp from '@/components/OTP/validateOtp.vue'
 
 
  export default {
    components: { activateNumber, sendOtp ,validateOtp, activateQr},
    data() {
      return {
        step: 1,
        deletedPrice: 0,
        phoneNumber: 0,
        loaded: false,
        cartOpen: !this.isMobile(),
        total: 0,
        form: {},
        numbers: [],
        personalInfo: {},
        skipPay: false,
        numberOfSteps:5,
        qrCode:''
      }
    },
    mounted() {
      this.loadData();
    },
    computed: {
      words() {
        return this.$store.state.words
      },
      
    },
    methods: {
      successOtpSend(phone){
        this.phoneNumber = phone;
        this.step++;
      },
      validateOtp(){
        this.step = 1;
      },
      loadData(){
            this.$store.commit('setIsLoading', {isLoading: true})  
            this.api({ action: 'api/get_open_order_numbers'}, (data) => {
              if(data.data.error && data.data.error != "")
              {
                this.activateError(data.data.error);
              }
            else{
              if(!data.data.length > 0)
                {
                  this.$swal({
                  icon:  'info',
                  title: this.$store.state.words.no_numbers_av,
                  showDenyButton: true,
                  showCancelButton: false,
                  confirmButtonText: 'הפעלה ממספר אחר',
                  denyButtonText: 'חזרה לדף הבית',
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.step = 2;
                  } else if (result.isDenied) {
                  document.location = '/';
                  }
                });
                }
              else{
                for(let i in data.data)
                  {
                    data.data[i].sim = 1;
                    data.data[i].user_name = '';
                    data.data[i].iccid = '';
                  }
                  this.numbers = data.data;
                }
              }
      
            });
            this.loaded = true;
          
          },
          sendOtpForMobility(phoneNumber){
            this.phoneNumber = phoneNumber;
            this.step = 2;
          },
          qrActivated(qrCode){
            this.qrCode = qrCode;
            this.step = 4;
          },
    },
  }
  </script>
  