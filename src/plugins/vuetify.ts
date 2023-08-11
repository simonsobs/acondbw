import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import "@/styles/variables.scss";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { md3 } from "vuetify/blueprints";
import { aliases, mdi } from "vuetify/iconsets/mdi";

import * as labsComponents from "vuetify/labs/components";

const vuetify = createVuetify({
  components: { ...components, ...labsComponents },
  directives,
  blueprint: md3,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: { mdi },
  },
  defaults: {
    VAppBar: {
      // color: "surface-container",
    },
    VNavigationDrawer: {
      // color: "surface-container",
    },
    // VListItem: {
    //   "color": "primary",
    // },
    // VCard: {
    //   color: "primary",
    // }
  },
});

export default vuetify;
