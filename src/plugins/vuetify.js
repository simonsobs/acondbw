import Vue from "vue";
import Vuetify from "vuetify/lib";

import colors from "vuetify/lib/util/colors";

import "material-design-icons-iconfont/dist/material-design-icons.css";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdi",
  },
  theme: {
    // dark: false,
    // options: { customProperties: true },
    // themes: {
    //   light: {
    //     primary: colors.teal.base,
    //     "on-primary": colors.shades.white,
    //     secondary: "#b0bec5",
    //     anchor: "#8c9eff",
    //   },
    // },
  },
});
