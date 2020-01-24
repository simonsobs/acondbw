<template>
  <div class="maps">
    <v-container class>
      <h2>Maps</h2>
      <div class="d-flex justify-end ma-2">
        <v-tooltip bottom open-delay="800">
          <template v-slot:activator="{ on }">
            <v-btn icon @click="showsAny = !showsAny" v-on="on">
              <v-icon>{{ showsAny ? 'mdi-unfold-less-horizontal' : 'mdi-unfold-more-horizontal' }}</v-icon>
            </v-btn>
          </template>
          <span>{{ showsAny ? 'Collapse all' : 'Expand all' }}</span>
        </v-tooltip>
      </div>
      <v-card outlined hover v-for="item in items" :key="item.id">
        <div @click="shows[item.id] = !shows[item.id]">
          <v-layout row wrap class="ma-0 px-3">
            <v-flex xs12 md4>
              <div class="caption grey--text">Name</div>
              <div class="font-weight-medium indigo--text" v-text="item.name"></div>
            </v-flex>
            <v-flex xs6 md4>
              <div class="caption grey--text">Date posted</div>
              <div v-text="item.date_posted"></div>
            </v-flex>
            <v-flex xs5 md3>
              <div class="caption grey--text">Mapper</div>
              <div v-text="item.mapper"></div>
            </v-flex>
            <v-flex xs1 md1 align-self-end>
              <v-btn icon>
                <v-icon>{{ shows[item.id] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-expand-transition>
            <v-layout row wrap class="mx-0 my-3 px-3" v-show="shows[item.id]">
              <v-flex xs12 md8 offset-md-4>
                <div class="caption grey--text">Note</div>
                <div>
                  <ul>
                    <li
                      v-for="(line, index) in item.note.split('\n')"
                      :key="index"
                    >{{ line.replace(/^- */, "") }}</li>
                  </ul>
                </div>
              </v-flex>
            </v-layout>
          </v-expand-transition>
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "maps",
  data() {
    return {
      headers: [],
      items: [],
      shows: {}
    };
  },
  created: function() {
    const path = "http://localhost:5000/maps";
    axios.get(path).then(response => {
      this.headers = response.data.schema.fields.map(f => ({
        text: f.name,
        value: f.name
      }));
      this.items = response.data.data;
      this.sortItems();
      this.shows = response.data.data.reduce(
        (obj, x) => ({ ...obj, [x.id]: false }),
        {}
      );
      console.log(this.shows);
    });
  },
  computed: {
    showsAny: {
      get: function() {
        return Object.keys(this.shows).some(i => this.shows[i]);
      },
      set: function(v) {
        for (const k in this.shows) {
          this.shows[k] = v;
        }
      }
    }
  },
  methods: {
    sortItems() {
      this.items.sort((a, b) => (a.date_posted > b.date_posted ? -1 : 1));
    }
  }
};
</script>
