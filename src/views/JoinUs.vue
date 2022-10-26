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

        <div id="form">
          <routerLink to="/" class="clean_link go_back_home" v-html="$store.state.words.go_back_home"></routerLink>
          <FirstStep v-if="step === 1" @loadData="loadData" @returnStep="step--" @setActiveNumber="setActiveNumber" @toggleProd="toggleProd" :numbersInfo="numbersInfo" :step="step" :numbers="numbers" @addNewNumber="addNewNumber" @getNumbers="getNumbers" @numbersValidation="numbersValidation" :activeNumber="+activeNumber"/>
          <SecondStep v-if="step === 2" @returnStep="step--" :numbersInfo="numbersInfo" :parentForm="form" :step="step" :numbers="numbers" @saveData="saveCartData" />
          <ThirdStep v-if="step === 3" @returnStep="step--" :numbersInfo="numbersInfo" :step="step" :numbers="numbers" @saveData="saveCartData" />
          <FourthStep v-if="step === 4" :skipPay="skipPay" @showLoader="toggleLoader" @goToStep="goToStep" @returnStep="step--" :numbersInfo="numbersInfo" :step="step" :numbers="numbers" @saveData="saveCartData" />
          <FifthStep v-if="step === 5" :skipPay="skipPay" @showLoader="toggleLoader" @goToStep="goToStep" @returnStep="step--" :numbersInfo="numbersInfo" :step="step" :numbers="numbers" @saveData="saveCartData" />
          <SendOtp v-if="step === 7" :phoneNumber="form.phone_number" @success="step = 8" />
          <ValidateOtpWithId v-if="step === 8" :idCard="form.id_card" :phoneNumber="form.phone_number" />
        </div>
      </div>
    </div>

    <div id="back_image" :style="'background-image:url(https://primemobile.co.il/themes/WID/images/step_' + (step <= 5 ? step : 2) + '.jpg)'">
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
      activeNumber: 0,
      step: 1,
      deletedPrice: 0,
      showLoader: false,
      loaded: false,
      cartOpen: !this.isMobile(),
      numbersInfo: [],
      total: 0,
      form: {},
      numbers: [],
      skipPay: false,
      numberOfSteps: 5
    }
  },
  mounted() {
    this.loadData()
    this.getNumbers()
  },
  computed: {
    words() {
      return this.$store.state.words
    },
  },
  methods: {
    /* eslint-disable */
    loadData(activeNumber = false, dontAdd = false, dontRefresh = false) {
      this.api({ action: 'cart/get', method: 'post' }, (data) => {
        if (this.loaded && !dontAdd) {
          this.numbersValidation()
        }
        if (data.data.items === undefined || data.data.items.length == 0) this.addNewNumber()
        
        else {
          let numbers = this.parseNumbers(data.data.items)
          this.numbersInfo = numbers
          if (!dontRefresh) this.activeNumber = this.numbersInfo[0].id
          else this.activeNumber = dontRefresh
        }

        if (activeNumber !== false) this.activeNumber = activeNumber

        this.form = data.data.order_data
        this.total = data.data.total_price
        this.deletedPrice = data.data.total_price_deleted
        // this.loaded = true
      })
    },

    toggleLoader(isLoaderShow){
      this.showLoader = isLoaderShow;
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
          this.numbersInfo[i].alert = true
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
      this.showLoader = true;

      this.api(
        {
          action: 'api/identification_number_exists',
          data: { id_card:this.form.id_card },
        },
        (data) => {
          if (data.data.error && data.data.error != '') {
            this.activateError(data.data.error)
           return this.showLoader = false

          } else {
            if (data.data.data.exists && !this.otp_validate) {
              this.api({ action: 'cart/add_cart_data', data: formData })
              this.showLoader = false

              this.$swal
                .fire({
                  icon: 'info',
                  title: this.words.id_is_exist,
                  showDenyButton: true,
                  showCancelButton: false,
                  confirmButtonText: 'המשך לזיהוי',
                  denyButtonText: 'שימוש במספר זהות אחר',
                })
                .then((result) => {
                  if (result.isConfirmed) {
                    this.step = 7
                    this.skipPay = true
                  } else if (result.isDenied) {
                    this.step = 2
                  }
                })
            } else if (data.data.data.exists && this.otp_validate) {

              this.step = 4
              this.showLoader = false
            } else {

              this.api(
                { action: 'cart/add_cart_data', data: formData },
                () => {
                  if (!dontMoveStep) {
                    this.step++
                    window.scrollTo(0, 0)
                    this.showLoader = false
                  }
                }
              )
            }
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
