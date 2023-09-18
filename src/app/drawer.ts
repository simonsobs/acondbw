import { ref, computed, watchEffect } from "vue";
import { useDisplay } from "vuetify";

export function useDrawer() {
  // https://vuetifyjs.com/en/features/display-and-platform/
  const { mobile } = useDisplay();

  /**
   * The navigation drawer is open if true and closed if false.
   */
  const drawer = ref<boolean>(false);

  watchEffect(() => {
    drawer.value = !mobile.value;
  });

  function toggleDrawer() {
    drawer.value = !drawer.value;
  }

  /**
   * The order of the navigation drawer and the app bar is reversed on mobile.
   * @see https://vuetifyjs.com/en/features/application-layout/#dynamic-layouts-and-order
   */
  const order = computed(() => (mobile.value ? 0 : -1));

  return { drawer, toggleDrawer, order, mobile };
}
