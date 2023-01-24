import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js";

const path = 'peng-hex';
const url = 'https://vue3-course-api.hexschool.io/v2';
let productModal = {};
let deleteModal = {};

const app = createApp({
  data(){
    return{
      products:[],
      tempProduct:{
        imagesUrl: []
      },
      isNew:false
    }
  },
  methods:{
    checkLogin(){
      axios.post(`${url}/api/user/check`)
      .then(() => {
        this.getProduct();
      })
      .catch(err => {
        alert(err.data.message);
        window.location = "/login.html";
      })
    },
    getProduct(){
      axios.get(`${url}/api/${path}/admin/products`)
      .then(res => {
        this.products = res.data.products
      })
      .catch(err => {
        console.log(err.data);
      })
    },
    updateProduct(){
      let site = `${url}/api/${path}/admin/product`;
      let methods = 'post';

      if(!this.isNew){
        site = `${url}/api/${path}/admin/product/${this.tempProduct.id}`;
        methods = 'put';
      }
      
      axios[methods](site, {data: this.tempProduct})
      .then(() => {
        this.getProduct();
        productModal.hide();
      })
      .catch(err => {
        console.log(err.data.message);
      })
    },
    deleteProduct(){

      axios.delete(`${url}/api/${path}/admin/product/${this.tempProduct.id}`)
      .then(() => {
        this.getProduct();
        deleteModal.hide();
      })
      .catch(err => {
        console.log(err.data.message);
      })
    },
    openModal(status, product){
      if(status === 'create'){
        productModal.show();
        this.tempProduct = {
          imagesUrl: []
        }

        this.isNew = true;
      }else if(status === 'edit'){
        productModal.show();
        
        this.tempProduct = {...product};
        this.isNew = false;
      }else if(status === 'delete'){
        deleteModal.show();
        this.tempProduct = {...product};
      }
    }
  },
  mounted(){
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hex_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common['Authorization'] = token;
    this.checkLogin();

    productModal = new bootstrap.Modal('#productModal');
    deleteModal = new bootstrap.Modal('#delProductModal');

  }
})

app.mount('#app');