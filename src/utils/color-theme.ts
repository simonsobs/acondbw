import { watch } from "vue";
import { storeToRefs } from "pinia";
import { useTheme } from "vuetify";

import { useConfigStore } from "@/plugins/pinia/stores/config";
import { generateLightAndDarkThemesFromSourceColor } from "@/utils/material-color";
import { useDarkMode } from "@/utils/dark-mode";

export function useColorTheme() {
  useDarkMode();
  const theme = useTheme();
  const { config } = storeToRefs(useConfigStore());
  watch(
    () => config.value.materialDynamicColorSource,
    (val) => {
      const [dynamicLight, dynamicDark] =
        generateLightAndDarkThemesFromSourceColor(val);
      // @ts-ignore
      theme.themes.value.light.colors = dynamicLight.colors;
      // @ts-ignore
      theme.themes.value.dark.colors = dynamicDark.colors;
    },
    { immediate: true }
  );
}
