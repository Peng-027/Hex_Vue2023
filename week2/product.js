import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js';

const app = {
  data(){
    return{
      api:"https://vue3-course-api.hexschool.io/v2",
      path:"peng-hex",
      products:[],
      temp:{}
    }
  },
  methods:{
    checkLogin(){
      axios.post(`${this.api}/api/user/check`)
      .then(() => {
        this.getProducts();
      })
      .catch(err => {
        console.log(err);
      })
    },
    getProducts(){
      axios.get(`${this.api}/api/${this.path}/admin/products`)
      .then(res => {
        this.products = res.data.products;
      })
      .catch(err => {
        console.log(err);
      })
    }
  },
  mounted(){
    let token = document.cookie.replace(/(?:(?:^|.*;\s*)hex_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common['Authorization'] = token;

    this.checkLogin();
  }
}

createApp(app).mount('#app');