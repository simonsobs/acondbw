<template>
  <div class="pt-5 px-5 pb-16" style="max-width: 960px; margin: auto">
    <div class="text-h4 text-primary">Users</div>
    <div class="mt-6 mb-2">
      <div class="text-h5 text-primary">Tokens with org access</div>
      <git-hub-token-table></git-hub-token-table>
    </div>
    <div class="mt-16 mb-2">
      <div class="text-h5 text-primary">Organizations</div>
      <git-hub-org-table></git-hub-org-table>
    </div>
    <div class="mt-16 mb-2">
      <div class="text-h5 text-primary">Organization members</div>
      <git-hub-user-table></git-hub-user-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import GitHubTokenTable from "@/components/admin/GitHubTokenTable.vue";
import GitHubOrgTable from "@/components/admin/GitHubOrgTable.vue";
import GitHubUserTable from "@/components/admin/GitHubUserTable.vue";
</script>
