import { describe, expect, beforeEach, afterEach, it } from "vitest";
import Vue, { ref, Ref } from "vue";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";
import { Client as UrqlClient } from "@urql/vue";
import { fromValue } from "wonka";

import About from "@/views/framework/About.vue";

import { useVersionQuery, VersionQuery } from "@/generated/graphql";
// vi.mock("@/generated/graphql");

Vue.use(Vuetify);

describe("About.vue", () => {
  let localVue: ReturnType<typeof createLocalVue>;
  let vuetify: Vuetify;
  let wrapper: ReturnType<typeof mount<About>>;
  let mockUrqlClient: Ref<UrqlClient>;

  beforeEach(() => {
    localVue = createLocalVue();
    vuetify = new Vuetify();
    const response = { data: { version: "0.0.1.test" } };
    mockUrqlClient = ref({
      // @ts-ignore
      executeQuery: ({ query }) => fromValue(response),
    });
    wrapper = mount(About, {
      localVue,
      vuetify,
      provide: { $urql: mockUrqlClient },
    });
  });

  afterEach(() => {});

  it("test text", () => {
    const text = wrapper
      .text()
      .trim()
      .replace(/[\n\r]+/g, " ") // remove line breaks
      .replace(/ +/g, " "); // remove multiple consecutive spaces
    expect(text).toBe("This is an about pageServer version: 0.0.1.test");
  });

  it("match snapshot", () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
