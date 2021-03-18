<template>
  <v-container>
    <ais-instant-search :search-client="searchClient" index-name="products">
      <ais-search-box>
        <template v-slot:default="{ currentRefinement, isSearchStalled, refine }">
          <v-text-field
            outlined
            rounded
            flat
            type="search"
            prepend-inner-icon="mdi-magnify"
            placeholder="Search"
            :loading="isSearchStalled"
            :value="currentRefinement"
            @input="refine($event)"
          />
        </template>
      </ais-search-box>
      <ais-hits>
        <template v-slot:item="{ item }">
        <v-card outlined>
          <v-card-title v-html="item._highlightResult.name.value"></v-card-title>
          <v-card-text v-html="item._highlightResult.note.value"></v-card-text>
          <pre>{{ item }}</pre>
        </v-card>
        </template>
      </ais-hits>
    </ais-instant-search>
  </v-container>
</template>

<script>
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";

export default {
  data() {
    return {
      searchClient: instantMeiliSearch("http://127.0.0.1:7700", "masterKey"),
    };
  },
};
</script>
