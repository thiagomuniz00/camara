import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import router from './router'
import App from './App.vue'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1B5E20',
          secondary: '#F9A825',
          accent: '#0D47A1',
          error: '#B71C1C',
        },
      },
    },
  },
  icons: { defaultSet: 'mdi' },
})

createApp(App).use(router).use(vuetify).mount('#app')
