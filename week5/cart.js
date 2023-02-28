Object.keys(VeeValidateRules).forEach((rule) => {
  if (rule !== "default") {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

VeeValidateI18n.loadLocaleFromURL("./zh_TW.json");

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize("zh_TW"),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});


const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "peng-hex";

const productModal = {
  props:['id', 'addToCart', 'openModal'],
  data(){
    return {
      modal: {},
      tempProduct: {},
      qty: 1,
    }
  },
  template: `#userProductModal`,
  watch: {
    id(){
      if(this.id){
        axios.get(`${apiUrl}/api/${apiPath}/product/${this.id}`)
        .then(res => {
          // console.log('單一產品', res.data.product);
          this.tempProduct = res.data.product;
          this.modal.show();
        })
      }
    }
  },
  methods: {
    hide(){
      this.modal.hide();
    },
  },
  mounted(){
    this.modal = new bootstrap.Modal(this.$refs.modal);
    // 監聽 DOM ， 當 Modal 關閉時要將 id 清空
    this.$refs.modal.addEventListener('hidden.bs.modal', (e)=>{
      this.openModal('');
    })
  }
}

let app = Vue.createApp({
  data(){
    return {
      products: [],
      productId: '',
      cart: {},
      loadingItem: '',
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      }

    }
  },
  methods: {
    getProducts(){
      axios.get(`${apiUrl}/api/${apiPath}/products/all`)
      .then(res => {
        // console.log('產品列表', res.data.products);
        this.products = res.data.products;
      })
    },
    openModal(id){
      this.productId = id;
      this.loadingItem = id;
    },
    addToCart(product_id, qty = 1){
      const data = {
        product_id,
        qty
      }
      this.loadingItem = product_id;
      axios.post(`${apiUrl}/api/${apiPath}/cart`, { data })
      .then(res => {
        // console.log('加入購物車', res.data);
        this.$refs.productModal.hide();
        this.getCarts();
        this.loadingItem = '';
      })
      .catch(err => {
        console.log(err)
      })
    },
    getCarts(){
      axios.get(`${apiUrl}/api/${apiPath}/cart`)
      .then(res => {
        // console.log('購物車', res.data);
        this.cart = res.data.data;
      })
    },
    updateCartItem(item){
      let data = {
        data: {
          product_id: item.id,
          qty: item.qty
        }
      }
      this.loadingItem = item.id;
      axios.put(`${apiUrl}/api/${apiPath}/cart/${item.id}`, data)
      .then(res => {
        // console.log('更新購物車', res.data);
        this.getCarts();
        this.loadingItem = '';
      })
      .catch(err => {
        console.log(err)
      })
    },
    deleteItem(item){
      this.loadingItem = item.id;
      axios.delete(`${apiUrl}/api/${apiPath}/cart/${item.id}`)
      .then(res => {
        // console.log('刪除購物車', res.data);
        this.getCarts();
        this.loadingItem = '';
      })
    },
    deleteAll(item){
      this.loadingItem = item.id;
      axios.delete(`${apiUrl}/api/${apiPath}/carts`)
      .then(res => {
        this.getCarts();
        this.loadingItem = '';
      })
    },
    onSubmit() {
      const order = this.form;
      axios.post(`${apiUrl}/api/${apiPath}/order`, { data: order })
      .then((res) => {
        alert(res.data.message);

        this.getCarts();
        this.$refs.form.resetForm();
      })
      .catch(err => {
        alert(err.data.message);
      });
    },
  },
  components: {
    productModal,
  },
  mounted(){
    this.getProducts();
    this.getCarts();
  }
})

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
app.component('loading', VueLoading.Component);

app.mount('#app');


// 1.取得產品列表
// 2.按按鈕，顯示產品單一細節 - 使用 props 傳入 id 監聽，當 id 變動時得遠端資料，並呈現 modal
// 3.加入購物車(可選擇數量)
// 4.購物車列表
// 5.調整數量
// 6.刪除品項
// 7.修正(讀取效果、watch)
