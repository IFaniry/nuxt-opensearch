<script setup lang="ts">
const route = useRoute();

// TODO: what if empty query
const { data: verses, status } = await useAsyncData("search", () =>
  $fetch(`/api/search`, { query: { q: route.query.q } })
);
</script>

<template>
  <div>
    <v-list
      v-if="status === 'success' && verses?.length"
      class="search-results-container"
    >
      <v-list-item
        v-for="verse in verses"
        :key="verse!.bookShortName.concat(verse!.chapter.toString()).concat(verse!.verse.toString())"
        class="mb-6"
        :title="
          verse!.bookFullName
            .concat(' ')
            .concat(verse!.chapter.toString())
            .concat(': ')
            .concat(verse!.verse.toString())
        "
        :subtitle="verse!.text"
        :to="'/mamaky/'.concat(verse!.bookShortName).concat('/').concat(verse!.chapter.toString()).concat('/').concat(verse!.verse.toString())"
      />
    </v-list>
  </div>
</template>

<style lang="scss">
.search-results-container {
  margin-top: 2rem;
  margin-left: auto;
  margin-right: auto;
  max-width: 80ch;
}
</style>
