const globalMixin = {
    computed: {
      isApp(){
        //return true;
        return (!this.isNull(window.cordova) && window.cordova != false); // true
      },
    },
    methods: {
      alert(msg, confirmLink, confirmTxt,className){
        this.$swal.fire({ html: msg, cancelButtonText: 'אישור',confirmButtonText: `<a href="${confirmLink}">${confirmTxt}</a>`,customClass:{container: className}});
      },
      bg(pic){
        return 'background-image:url(' + pic + ')';
      },
      get_word(key){
        return this.$store.words[key];
      },
      save_item_to_store(item){
        
        if (this.isNull(item)) return;
        
        switch (item.type)
        {
          case 'video': this.$store.state.videos[item.id] = item; break;
          case 'article': this.$store.state.articles[item.id] = item; break;
          case 'faq': this.$store.state.faq[item.id] = item; break;
        }
      },
      format_number: function(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      isNull: function (str)
      {
        return (str == '' || str == null || str == undefined);
      },
  
      parse_date(str){
        var d=new Date(str); return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
      },
      
      get_me(){
        return this.$store.user;
      },

      is_subscribed(){
        return (this.get_me() && this.get_me().is_subscribed);
      },

      set_user_token(str)
      {
        localStorage.setItem('user_token',str);
    
        var myDate = new Date();
        myDate.setMonth(myDate.getMonth() + 12);
        let cookieName = 'app_user';
        let cookieValue = (str == '' ? '0' : '1');
        document.cookie = cookieName +"=" + cookieValue + ";expires=" + myDate + ";domain=.nadlancenter;path=/";
      },
      activateInfo(text) {
        this.$swal({
          icon:  'info',
          title: text,
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'הפעלה ממספר אחר',
          denyButtonText: 'חזרה לדף הבית',
        })
      },

      activateError(text) {
        this.$swal({
          icon: 'error',
          text: text,
          showCloseButton: true,
          showCancelButton: false,
          showConfirmButton: false,
        })
      },

      debounce(func, timeout = 300){
        let timer;
        return (...args) => {
          clearTimeout(timer);
          timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
      },
      
      get_item(action, type, id){

        var promise = new Promise((resolve) => {

          if (this.$store.state[type][id] != null)
          {
            resolve(this.$store.state[type][this.id]);
          }
          else
          {
            this.api({action: action, data: { id: id }, method:'get'}, (data) => {

              this.save_item_to_store(data.data)

              resolve(data.data);
            });
          }

        });
        return promise;
      },

      api(settings, func, failFunc){
    
        if (this.isNull(func)) func = function(){};
    
         var headers = {
           'Content-Type': 'application/json; charset=utf-8'
         };
      
         if(!this.isNull(localStorage.getItem('user_token'))) 
         { 
          headers.Authorization = localStorage.getItem('user_token');
         }
       
//         var requestOBJ;
         const cancelTokenSource = this.axios.CancelToken.source();

    
           if (settings.method == 'get')
           {
              let actionGet = settings.action;
              actionGet = actionGet + (actionGet.indexOf('?') === -1 ? '?' : '&');
              actionGet = actionGet + 'ts='  + (new Date()).getHours() + '_' + ((new Date()).getMinutes() < 30 ? '0' : '30');

              if (!this.isNull(settings.data))
              { 
              for (let i in settings.data) actionGet += '&' + i + '=' + settings.data[i];
              }

               this.axios.get(window.api_url + actionGet, { headers: headers, cancelToken: cancelTokenSource.token } ).then(response => {
                if (response.data == 'error')
                {
                  this.set_user_token('');
                  document.location.reload();
                }

                func(response.data);
             }, response => { 
               if (!this.isNull(failFunc)) failFunc(response);
               else func(false);
             });
        

// Cancel request
//cancelTokenSource.cancel();

           }
           else
           {
            this.axios.post(window.api_url + settings.action, settings.data, { headers: headers, cancelToken: cancelTokenSource.token })
            .then(response => {
              if (response.data == 'error')
              {
                this.set_user_token('');
                document.location.reload();
              }
                 func(response.data);
                 //console.log(response.body);
             }, response => { 
               if (!this.isNull(failFunc)) failFunc(response);
               //else func(false);
                 //console.error(response.body);
             });
         }
         
        return cancelTokenSource;
    
       },
  
  
      isMobile: function(){ 
        const toMatch = [
          /Android/i,
          /webOS/i,
          /iPhone/i,
          /iPad/i,
          /iPod/i,
          /BlackBerry/i,
          /Windows Phone/i
      ];
  
      return toMatch.some((toMatchItem) => {
          return navigator.userAgent.match(toMatchItem);
      });
      
      },
  
     }
    }

    export default globalMixin