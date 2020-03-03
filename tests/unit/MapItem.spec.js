import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import moxios from "moxios";

import MapItem from "@/views/MapItem.vue";
import MapItemCard from "@/components/MapItemCard.vue";

import router from "@/router";

Vue.use(Vuetify);
Vue.use(VueRouter);

const localVue = createLocalVue();

describe("MapItem.vue", () => {
  function createWrapper() {
    return mount(MapItem, {
      localVue,
      router,
      mocks: {},
      stubs: {
        MapItemCard: true
      }
    });
  }

  beforeEach(function() {
    moxios.install();
  });

  afterEach(function() {
    moxios.uninstall();
  });

  it("match snapshot", done => {
    const wrapper = createWrapper();

    moxios.wait(async () => {
      let request = moxios.requests.mostRecent();
      expect(request.config.url).toBe(process.env.VUE_APP_ACONDBS_URL);
      expect(request.config.method).toBe("post");
      expect(request.config.data).toContain("query Map($name: String) {");

      await request.respondWith({
        status: 200,
        response: {
          data: {
            map: {
              mapId: "1013",
              name: "lat20200201",
              datePosted: "2020-02-01",
              mapper: "pwg-pmn",
              mapFilePaths: {
                edges: [
                  {
                    node: {
                      path: "nersc:/go/to/my/maps_v3",
                      note: "lat only"
                    }
                  }
                ]
              },
              note:
                "- This is a dummy test with a lat map                         \n- A beam depends on this map",
              beams: {
                edges: [
                  {
                    node: {
                      beamId: "1150",
                      name: "20200207"
                    }
                  }
                ]
              }
            }
          }
        }
      });
      expect(wrapper.find(MapItemCard).props().map.name).toBe("lat20200201");
      expect(wrapper.html()).toMatchSnapshot();
      done();
    });
  });
});
