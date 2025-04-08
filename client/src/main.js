import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import './assets/main.css';
import { useAuthStore } from './stores/auth';

const app = createApp(App);
const pinia = createPinia();

const toastOptions = {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
};

app.use(pinia);
app.use(router);
app.use(Toast, toastOptions);

// Initialize auth store before mounting the app
const authStore = useAuthStore(pinia);
authStore.initialize().then(() => {
  app.mount('#app');
}); 