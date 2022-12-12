<template>
    <div class="form">
        <h2 class="title" v-html="words.number_to_activate"></h2>
        <div id="number_and_arrows">
            <div>
                <a v-if="isPrev" class="move" @click="changeActiveNumber('prev')" v-html="words.prev_num"></a>
            </div>
            <div id="active_number_input" v-html="activeItem.number"></div>
            <div>
                <a v-if="isNext" class="move" @click="changeActiveNumber('next')" v-html="words.next_num"></a>
            </div>
        </div>
        <form class="small_form" @submit.prevent="submit()">
            <div class="invoice_wrapper">	
                <div :class="'option '+(activeItem.sim == '1' ? 'active' : '')" @click="activeItem.sim = 1">
                    <div class="small_title bold" v-html="words.i_have_sim"></div>
                    <div class="radio"></div>
                    <div class="form-item" style="margin-top: 20px" v-if="activeItem.sim == '1'">
                        <input input-mode="numeric" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"  maxlength="6" type="text" id="iccid" v-model="activeItem.iccid" autocomplete="off" required/>
                        <label for="iccid" v-html="words.last_six_dig"></label>
                    </div>
                </div>
                <div :class="'option '+(activeItem.sim == '0' ? 'active' : '')" @click="activeItem.sim = 0">
                    <div class="small_title bold" v-html="words.delivery_guy"></div>
                    <div class="radio"></div>
                    <template v-if="activeItem.sim == '0'">
                        <form @submit.prevent="saveNumberInfo()">
                            <div class="small_title" v-html="words.whats_your_city"></div>
                            <div class="form-item">
                                <input  type="text" id="city" v-model="personalInfo.city" autocomplete="off" required/>
                                <label for="city" v-html="words.city"></label>
                            </div>
                            <div class="small_title" v-html="words.whats_your_address"></div>
                            <div class="options">
                                <div class="form-item">
                                    <input type="text" id="street" v-model="personalInfo.street" autocomplete="off" required/>
                                    <label for="street" v-html="words.street"></label>
                                </div>
                                <div class="form-item">
                                    <input type="number" id="house_num" v-model="personalInfo.house_num" autocomplete="off" required/>
                                    <label for="house_num" v-html="words.house_num"></label>
                                </div>
                            </div>
                            <div class="form-item">
                                <input inputmode="numeric" type="text" id="zip" v-model="personalInfo.zip" autocomplete="off" required/>
                                <label for="zip" v-html="words.zip"></label>
                            </div>
                            <div class="btn_wrapper">
                                <input type="submit" class="btn" :value="words.send_to_mail" />
                            </div>
                        </form>
                    </template>
                </div>
            </div>
            <div class="small_title bold" v-html="words.chnage_user_name"></div>
            <div class="form-item">
                <input type="text" id="user_name" v-model="activeItem.user_name" autocomplete="off" required/>
                <label for="house_num" v-html="words.my_user_name"></label>
            </div>
            <div class="btn_wrapper" v-if="activeItem.sim != '0'">
                <input type="submit" class="btn" :value="words.procced" />
            </div>
        </form>
    </div>
</template>
<script>
export default {
  components: { },
  props: {
    step: {
      required: true,
      type: Number,
    },
    allowMobility: {
      required: true,
      type: Boolean,
    },
    numbers: {
      required: true,
      type: Array,
    }
  },
    data() {
        return {
            phoneNumber:'',
            activeNumber:0,
            personalInfo:{},
            userLoged:true
        }
    },
    mounted(){
        this.loadInfo();
    },
    computed: {
      words() {
        return this.$store.state.words
      },
      isNext(){
        if(!this.numbers[(this.activeItem.id + 1)])
            {
                return false;
            }
        return this.numbers[(this.activeItem.id + 1)].id; 
    },
    isPrev(){
        if(!this.numbers[(this.activeItem.id - 1)])
            {
                return false;
            }
        return this.numbers[(this.activeItem.id - 1)].id; 
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
        loadInfo(){
            this.api({ action: 'cart/load_info', data: {}  , onComplete: (data) => {
                this.personalInfo = data.data;
            }});

            this.$store.commit('setIsLoading', {isLoading: false})  
          },
        submit(){
			if(this.activeItem.purchase_type == "new" || this.allowMobility)
				{
					this.saveNumberInfo();
				}
			else{
                 this.$emit('sendOtpForMobility' , this.activeItem.number)
				}
		},
        saveNumberInfo:function(){
              let form = {};
              let isNew = (this.activeItem.purchase_type == "new" ? 'כן' : 'לא');
              form.number = this.activeItem.number;
              form.user_name = this.activeItem.user_name;
              form.id = this.activeItem.item_id;
              form.iccid = this.activeItem.iccid;
              this.$store.commit('setIsLoading', {isLoading: true})

              
              if(form.is_esim == 0)
              {
                  this.api({ action: 'send_email_to_support', data: { form :form , personalInfo: this.personalInfo, is_new: isNew }  }, (data) => {
                    if(data.data.error && data.data.error != "")
                    {
                        this.activateError(data.data.error);
                    }
                    else{
                        var text = 'הסים נשלח אלייך בהצלחה ויגיע תוך 5 ימי עסקים';
                        this.activatePromptExit(text, 'success');
                        }
                  });
                  this.activeNumber = false;
                  this.$store.commit('setIsLoading', {isLoading: false})  
              }
              else{

                if(form.iccid.length > 0 && form.iccid.length < 6)
                  {
                      this.activateError(this.words.iccid_short);
                      this.activeNumber = false;
                      return false;
                  }
  
                  this.api({ action: 'api/prov_create_user', data: form  }, (data) => {
                      if(data.data.error && data.data.error != "")
                      {
                          this.activateError(data.data.error);
                      }
                      else{
                            form.domain_user_id = data.data.data.id;
                            this.api({ action: 'api/prov_create_mobile', data: form  }, (data) => {
                            if(data.data.error && data.data.error != "")
                            {
                                this.activateError(data.data.error);
                            }
                            else{

                                // this.$emit('numberActivated' , form.number);
                                // //alert number activeted
                                //     if(data.data)
                                //         {
                                //             var text = 'מספר '+form.number+' הופעל בהצלחה!!';
                                //             this.activatePromptExit(text, 'success');
                                //         }

                                let note = "";
                                for (let i in data.data.data.notes)
                                {
                                    note +=' '+data.data.data.notes[i];
                                }
                                this.$store.commit('setIsLoading', {isLoading: false});

                                this.$swal({
                                icon: 'success',
                                text: note,
                                showCloseButton: false,
                                showCancelButton: false, 
                                allowOutsideClick: false,
                                showConfirmButton: true,
                                confirmButtonText: 'אוקיי',
                                }).then(() => {
                                    this.$router.go();
                                });
                            }
                            
                        });
                      }
                      this.$store.commit('setIsLoading', {isLoading: false})  
                  });
                  
              }
          },
        changeActiveNumber(type){
			if(type == 'next')
				{
					this.activeNumber = this.isNext;
				}
			else{
					this.activeNumber = this.isPrev;
			}
		},
        }
}
</script>