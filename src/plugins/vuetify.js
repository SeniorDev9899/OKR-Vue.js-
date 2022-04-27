import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import '@mdi/font/css/materialdesignicons.css'
Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#1565C0',
        secondary: '#b0bec5',
        accent: '#8c9eff',
        dark: '#483D8B',
        slateBlue: "#414766",
        white: "#FFFFFF",
        lightBlue: "#2879ff",
      },
    },
  },
  icons: {
    iconfont: 'mdi', // default - only for display purposes
  },
});
