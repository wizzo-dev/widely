<template>
  <div id="join_us">

    <div class="wrapper">
      <div class="forms">
        <div class="steps" v-if="step > 0">
          <div v-if="isMobile()" :style="'width:' + step * 20 + '%'" id="border"></div>
          <div v-else id="border" :style="'height:' + step * 20 + '%'"></div>
          <ul>
            <li v-for="num in numberOfSteps" :class="'step ' + (step >= num ? 'active' : '')" :key="num" >
              <div class="checkbox"></div>
            </li>
          </ul>
        </div>
        <div id="cart" :class="cartOpen ? 'open' : 'close'">
          <template v-if="isMobile()">
            <div class="cart" @click="cartOpen = true">
              <font-awesome-icon icon="fa fa-shopping-cart" />

            </div>
            <div class="close" @click="cartOpen = !cartOpen">
              <font-awesome-icon icon="fa fa-times" />
            </div>
          </template>
          <div class="cart_title bold hide_on_close">
            {{ words.cart_title }}
          </div>
          <ul class="hide_on_close">
            <template v-if="numbersInfo">
              <li v-for="num in numbersInfo" :key="num.id" class="active">
                <div class="options">
                  <div v-if="numbersInfo.length > 1" class="trash" @click="removeNumber(num)">
                      <font-awesome-icon icon="fa fa-trash-alt" />
                  </div>
                  <div v-else class="trash"></div>
                  <div v-if="num.phone_number.length > 3">
                    <div class="small_title bold" v-if="num.phone_number.length < 12">
                      {{ num.phone_number }}
                      <a class="change_number semi_bold" @click="changeNumber(num)" >{{ words.change_number }}</a>
                    </div>
                    <div class="small_title">
                      {{ !num.has_number ? 'מספר חדש' : 'מספר קיים' }}
                    </div>
                  </div>
                  <div class="small_title bold add_ils">
                    {{ num.total_price }}
                  </div>
                </div>
              </li>
            </template>
          </ul>
          <div class="flex hide_on_close">
            <div class="small_title bold">{{ words.total }}</div>
            <div class="total_sub main_color bold">
              <span class="deleted_price add_ils" v-if="total < deletedPrice">{{
                deletedPrice
              }}</span>
              <span class="add_ils">{{ total }}</span>
              {{ words.to_month }}
            </div>
            
          </div>
        </div>
        <div id="form" :class="'step_'+step">
          <routerLink to="/" class="clean_link go_back_home" >{{$store.state.words.go_back_home}}</routerLink>
          <FirstStep v-if="step === 1" @loadData="loadData" @returnStep="step--" @setActiveNumber="setActiveNumber" @toggleProd="toggleProd" :numbers_overseas_info="numbers_overseas_info" :numbersInfo="numbersInfo" :step="step" :numbersUs="numbersUs" :numbers="numbers" @addNewNumber="addNewNumber" @addUsNumber="addUsNumber" @getNumbers="getNumbers" @numbersValidation="numbersValidation" :activeNumber="+activeNumber"/>
          <SecondStep v-if="step === 2" @returnStep="step--" :numbersInfo="numbersInfo" :parentForm="form" :step="step" :numbers="numbers" @saveData="saveCartData" />
          <ThirdStep v-if="step === 3" @returnStep="step--" :numbersInfo="numbersInfo" :parentForm="form" :step="step" :numbers="numbers" @saveData="saveCartData" />
          <FourthStep v-if="step === 4" :skipPay="skipPay" @goToStep="goToStep" :email="form.email ||''" :phone="form.phone_number || ''" @returnStep="step--" :numbersInfo="numbersInfo" :step="step" :numbers="numbers" @saveData="saveCartData" />
          <FifthStep v-if="step === 5" :skipPay="skipPay" @goToStep="goToStep" @returnStep="step--" :numbersInfo="numbersInfo" :step="step" :numbers="numbers" @saveData="saveCartData" />
          <SendOtp v-if="step === 7" :phoneNumber="form.phone_number" @success="step = 8" />
          <ValidateOtpWithId v-if="step === 8" :idCard="form.id_card" :phoneNumber="form.phone_number" @success="step = 4;otpValidate = true" />
        </div>
      </div>
    </div>

    <div id="back_image" :style="`background-image:url(${bgImg})`">
      <div id="white_logo"></div>
    </div>
  </div>
</template>

<script>
import FirstStep from '@/components/FirstStep.vue'
import SecondStep from '@/components/SecondStep.vue'
import ThirdStep from '@/components/ThirdStep.vue'
import FourthStep from '@/components/FourthStep.vue'
import FifthStep from '@/components/FifthStep.vue'
import ValidateOtpWithId from '@/components/OTP/validateWithId.vue'
import SendOtp from '@/components/OTP/sendOtp.vue'

export default {
  components: { FirstStep, SecondStep, ThirdStep, FourthStep, FifthStep,ValidateOtpWithId, SendOtp },
  data() {
    
    return {
      selectedIds: '',
      otpValidate:false,
      activeNumber: 0,
      step: 5,
      deletedPrice: 0,
      loaded: false,
      cartOpen: !this.isMobile(),
      numbersInfo: [],
      total: 0,
      form: {},
      numbers: [],
      numbersUs: [],
      skipPay: false,
      numbers_overseas_info:[],
      numberOfSteps: 5
    }
  },
  mounted() {
    
    this.loadData();
    this.getNumbers();
    this.getUsNumbers();
  },
  computed: {
    words() {
      return this.$store.state.words;
    },
    bgImg() {
      if (this.isMobile()) return 'https://primemobile.co.il/themes/WID/images/step_2.jpg';
      else return 'https://primemobile.co.il/themes/WID/images/step_' + (this.step <= 5 ? this.step : 2) + '.jpg'
    }
  },
  methods: {
    /* eslint-disable */
    loadData(activeNumber = false, dontAdd = false, dontRefresh = false) {
      let plan = '';
      if(this.$route.query.plan && this.$route.query.plan != '')
      {
         plan = this.$route.query.plan;

         //add items to basket by the plan
         this.$router.replace({'query': null});
      }
      this.api({ action: 'cart/get',data:{plan:plan}, method: 'post' }, (data) => {
        if (this.loaded && !dontAdd) {
          this.numbersValidation();
        }
        if (data.data.items === undefined || data.data.items.length == 0) this.addNewNumber();
        
        else {
          let numbers = this.parseNumbers(data.data.items);
          this.numbersInfo = numbers;
          if (!dontRefresh) this.activeNumber = this.numbersInfo[0].id;
          else this.activeNumber = dontRefresh;
        }

        if (activeNumber !== false) this.activeNumber = activeNumber;
        this.numbers_overseas_info = data.data.numbers_overseas_info;
        this.form = data.data.order_data;
        this.total = data.data.total_price;
        this.deletedPrice = data.data.total_price_deleted;
      })
    },
    goToStep(step){
      this.step = step > 0 ? step : 1;
    },

    toggleProd(num,prod) {
    this.api({ action: 'cart/add_item', data:{ item_id:prod.id ,id:num.id } } , async (data) => {
        if(data.data?.error && data.data?.error != "") this.activateError(data.data.error)
        else {
          this.numbersValidation(false,num.id);
        }
    })
	},

    getNumbers() {
      this.api({ action: 'cart/get_numbers', method: 'post' }, (data) => {
        if (data.data.error && data.data.error != '')
          this.activateError(data.data.error)
        else this.numbers = data.data
      })
    },

    getUsNumbers() {
      this.api({ action: 'cart/get_us_numbers', method: 'post' }, (data) => {
        if (data.data.error && data.data.error != '')
          this.activateError(data.data.error)
        else this.numbersUs = data.data
      })
    },
    addUsNumber(item){
      this.api({ action: 'cart/add_us_number', data:{ plan:item },method: 'post' }, (data) => {
        if (data.data.error && data.data.error != '')
          this.activateError(data.data.error)
        else {
          this.getUsNumbers();
          this.loadData(false,true,item.id);
        }
      })
    },  

    removeNumber(num) {
      this.api({ action: 'cart/remove_number', data: { phone_number: num.phone_number, id:num.id } }, ()=>{
					this.loadData(false,true);
      });
    },

    addNewNumber() {
      this.getNumbers()
      this.api(
        { action: 'cart/add_number', method: 'post', data: { id: 'new' } },
        (data) => {
          if (data.data.error && data.data.error != '') {
            this.activateError(data.data.error)
          } else {
            this.loadData(data.data)
          }
        }
      )
    },

    numbersValidation(next = false,numberId = false) {
      for (let i in this.numbersInfo) {
        if (this.numbersInfo[i].phone_number.length < 10) {
          this.activeNumber = this.numbersInfo[i].id;
          this.numbersInfo[i].alert = true;
          return false
        }
      }

     
      this.api({action: 'cart/numbers_validation',data: { numbers_array: this.numbersInfo },},
        (data) => {
          if (data.data?.error && data.data.error != '')
            this.activateError(data.data.error)
          else {
            if (data.data.data && !data.data.data) {
              for (let i in this.numbersInfo) {
                if (this.numbersInfo[i].id == data.data.id_false) {
                  this.numbersInfo[i].alert = true
                }
              }
              return false
            }
            if (next) {
              this.step++
              window.scrollTo(0, 0)
            }
            if (numberId !== false) {
              this.loadData(false,false,numberId)
            }
          }
        }
      )
      return true
    },

    setActiveNumber(id){
        this.activeNumber = id;
    },

    saveCartData(formData, dontMoveStep = false) {
      //active alert if didnt choose city
      if (this.step == 3 && formData.city <= 0) {
        this.activateError(this.words.choose_city)
        return false
      }

      //active alert if didnt choose street
      if (this.step == 3 && formData.street <= 0) {
        this.activateError(this.words.choose_street)
        return false
      }

      
      if(formData) {
        if (formData.phone_number) {
            let phoneNumber = formData.phone_number + '';
            if (phoneNumber[0] !== '0') {
              phoneNumber[0] = '0';
              formData.phone_number = +phoneNumber;
            }
        }
        this.form = {...this.form, ...formData};
      }
     this.$store.commit('setIsLoading', {isLoading: true})

      this.api(
        {
          action: 'cart/data_exist',
          data: { id_card:this.form.id_card ,email:this.form.email },
        },
        (data) => {
            if (data.data) {
              this.api({ action: 'cart/add_cart_data', data: formData })
              this.$store.commit('setIsLoading', {isLoading: false})
              this.$swal
                .fire({
                  icon: 'info',
                  title: `<h2 class="second_step_title" style="font-size: 24px">${this.words.id_is_exist}</h2>`,
                  showDenyButton: true,
                  showCancelButton: false,
                  confirmButtonText: 'אזור אישי',
                  denyButtonText: 'שימוש במספר זהות אחר',
                  customClass:{container: 'second_step_swal'}
                })
                .then((result) => {
                  if (result.isConfirmed) {
                    document.location  = '/';
                  } else if (result.isDenied) {
                    this.step = 2
                  }
                })
            }
            else {
              this.api({ action: 'cart/add_cart_data', data: formData },() => {
                    this.step++
                    window.scrollTo(0, 0)
                    this.$store.commit('setIsLoading', {isLoading: false})
                }
              )
            }
          }
        
      )
    },
    parseNumbers(items) {
            for(let i in items)	{
                items[i].alert = false
                if(items[i].has_number == "1")
                    {
                        items[i].has_number = true
                    }
                else {							
                    items[i].has_number = false
                }
            }
            return items
	},
    changeNumber(num){
    this.activeNumber = num.id
    this.step = 1
    },
  },
}
</script>
<style scoped lang="scss">
@media(max-width: 600px)
{
  .step_4{padding-top: 25px;}	
}
</style>
