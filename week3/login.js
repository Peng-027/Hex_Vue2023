import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js";

const app = {
  data(){
    return{
      user:{
        "username": "",
        "password": ""
      }
    }
  },
  methods:{
    login(){
      axios.post('https://vue3-course-api.hexschool.io/v2/admin/signin', this.user)
      .then(res => {
        const {expired, token} = res.data;
        document.cookie = `hex_token=${token}; expires=${new Date(expired)}`;
        window.location = "product.html";
      })
      .catch(err => {
        console.log(err);
      })
    }
  }
}

createApp(app).mount('#app');

//帳號密碼
//存cookie
// post