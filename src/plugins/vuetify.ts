import '@mdi/font/css/materialdesignicons.css';
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";

import * as labsComponents from 'vuetify/labs/components';

const vuetify = createVuetify({
  components: { ...components, ...labsComponents },
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: { mdi },
  },
});

export default vuetify;

// import Vue from "vue";
// import Vuetify from "vuetify/lib/framework";

// import colors from "vuetify/lib/util/colors";

// import "material-design-icons-iconfont/dist/material-design-icons.css";

// Vue.use(Vuetify);

// export default new Vuetify({
//   icons: {
//     iconfont: "mdi",
//   },
//   theme: {
//     // dark: false,
//     // options: { customProperties: true },
//     // themes: {
//     //   light: {
//     //     primary: colors.teal.base,
//     //     "on-primary": colors.shades.white,
//     //     secondary: "#b0bec5",
//     //     anchor: "#8c9eff",
//     //   },
//     // },
//   },
// });
