<template>
    <div id="join_us">
      <div id="wave_animation_wrapper" v-if="showLoader">
        <div id="wave_animation">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
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
            <activateNumber v-if="step === 2" @setActiveNumber="setActiveNumber" @toggleProd="toggleProd" :step="step" :numbers="numbers"  :activeNumber="+activeNumber"/>
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

  export default {
    components: { activateNumber},
    data() {
      return {
        step: 1,
        deletedPrice: 0,
        loaded: false,
        cartOpen: !this.isMobile(),
        total: 0,
        form: {},
        numbers: [],
        personalInfo: {},
        skipPay: false,
        showLoader:false,
        numberOfSteps:5
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
  
      loadData(){
            this.showLoader = true;   
            this.api({ action: 'api/get_open_order_numbers', data: {}  , onComplete: (data) => {
            if(data.data.error && data.data.error != "")
              {
                this.activateError(data.data.error);
              }
            else{
              if(!data.data.length > 0)
                {
                this.activateInfo(this.words.no_numbers_av).then((result) => {
                  if (result.isConfirmed) {
                    this.step = 2;
                  } else if (result.isDenied) {
                    this.alert("vacvh");
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
      
            }});
                  
            this.loadInfo();
          
          },
          loadInfo: function(){
            this.api({ action: 'cart/load_info', data: {}  , onComplete: (data) => {
            if(data.data.error && data.data.error != "")
              {
                this.activateError(data.data.error);
              }
            else{
                this.personalInfo = data.data;
              }
            }});
            this.showLoader = false;
          },
  
   

  
    },
  }
  </script>
  