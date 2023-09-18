import { computed, ref } from "vue";
import { storeToRefs } from "pinia";

import { useConfigStore } from "@/plugins/pinia/stores/config";
import { useDynamicColors } from "@/utils/dynamic-color";
import { useDynamicColorsOnVuetify, useDarkModeOnVuetify } from "./vuetify";

function useSourceColor() {
  const { config } = storeToRefs(useConfigStore());
  const sourceColor = computed(() => config.value.materialDynamicColorSource);

  // const sourceColor = ref("#607D8B"); // blue grey
  // const sourceColor = ref("#E91E63"); // pink
  return { sourceColor };
}

export function useColorTheme() {
  const { sourceColor: sourceColorHex } = useSourceColor();

  const optionsLight = { sourceColorHex, dark: false };
  const optionsDark = { sourceColorHex, dark: true };

  const { colors: lightColors } = useDynamicColors(optionsLight);
  const { colors: darkColors } = useDynamicColors(optionsDark);

  useDynamicColorsOnVuetify(lightColors, false);
  useDynamicColorsOnVuetify(darkColors, true);

  useDarkModeOnVuetify();
}
