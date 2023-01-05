import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js';

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
    checkLogin(){
      axios.post('https://vue3-course-api.hexschool.io/v2/admin/signin',this.user)
      .then(res => {
        let { token,expired } = res.data;
        document.cookie = `hex_token=${token}; expires=${new Date(expired)}; path=/`;
        console.log(new Date(expired));
        window.location = "products.html";
      })
      .catch(err => {
        alert(err.data.message);
      })
    }
  }
}

createApp(app).mount('#app');