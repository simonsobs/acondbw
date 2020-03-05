import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";

import Maps from "@/views/Maps.vue";
import MapItemCard from "@/components/MapItemCard.vue";

import router from "@/router";

Vue.use(Vuetify);
Vue.use(VueRouter);

describe("Maps.vue", () => {
  let localVue;

  function createWrapper() {
    return mount(Maps, {
      localVue,
      router,
      mocks: {},
      stubs: {
        MapItemCard: true,
        MapSubmitFormDialog: true
      }
    });
  }

  const edges = [
    {
      node: {
        id: "TWFwOjEwMTM=",
        name: "lat20200201",
        datePosted: "2020-02-01",
        mapper: "pwg-pmn",
        note:
          "- This is a dummy test with a lat map                         \n- A beam depends on this map",
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
        beams: {
          edges: [
            {
              node: {
                name: "20200207"
              }
            }
          ]
        }
      }
    },
    {
      node: {
        id: "TWFwOjEwMTI=",
        name: "lat20200120",
        datePosted: "2020-01-20",
        mapper: "pwg-pmn",
        note:
          "- This is a dummy test with a lat map                                             \n- A beam depends on this map",
        mapFilePaths: {
          edges: [
            {
              node: {
                path: "nersc:/go/to/my/maps_v2",
                note: "lat only"
              }
            },
            {
              node: {
                path: "abcde:/path/to/the/maps_v2",
                note: "lat only"
              }
            }
          ]
        },
        beams: {
          edges: [
            {
              node: {
                name: "20200123"
              }
            }
          ]
        }
      }
    },
    {
      node: {
        id: "TWFwOjEwMDE=",
        name: "lat20190213",
        datePosted: "2019-02-13",
        mapper: "pwg-pmn",
        note:
          "- This is a dummy test with a lat map\n- This should not depend on any beam",
        mapFilePaths: {
          edges: [
            {
              node: {
                path: "nersc:/go/to/my/maps",
                note: ""
              }
            }
          ]
        },
        beams: {
          edges: []
        }
      }
    }
  ];

  beforeEach(function() {
    localVue = createLocalVue();
  });

  it("match snapshot", async () => {
    const wrapper = createWrapper();

    wrapper.setData({
      edges: edges,
      isCardCollapsed: {
        "TWFwOjEwMDE=": true,
        "TWFwOjEwMTI=": true,
        "TWFwOjEwMTM=": true
      }
    });
    await Vue.nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });
});
