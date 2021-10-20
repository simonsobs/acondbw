<template>
  <div>
    <div class="display-1">Versions</div>
    <div>
      <span class="font-weight-medium">Server version:</span
      >{{ versions.version }}
    </div>
    <div>
      <span class="font-weight-medium">Alembic migration version:</span
      >{{ versions.alembicVersion }}
    </div>
  </div>
</template>

<script>
import VERSIONS from "@/graphql/queries/Versions.gql";

export default {
  data() {
    return {
      versions: null,
    };
  },
  apollo: {
    versions: {
      query: VERSIONS,
      update: (data) => data,
      result(result) {
        console.log(result);
      },
    },
  },
};
</script>

