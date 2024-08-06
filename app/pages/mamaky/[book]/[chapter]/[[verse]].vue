<script setup lang="ts">
import { BOOKS } from "~/books.constant";

const getBookByShortName = (shortName: string | undefined) =>
  BOOKS.find((book) => book.ShortName === shortName);
const chapterRange = (chapterQty: number) =>
  Array.from({ length: chapterQty }, (_, i) => i + 1);

const route = useRoute();

// TODO: what if empty params
const bookParam = getBookByShortName(route.params.book as string | undefined);
const chapterParam = Number(route.params.chapter as string);

// TODO: if !bookParam go to 404
const chapter = ref(chapterParam);
const setChapter = async (newChapter: number) => {
  chapter.value = newChapter;
  await navigateTo(`/mamaky/${bookParam!.ShortName}/${newChapter}`);
};

const { data: verses, status } = await useAsyncData(
  "verses",
  () => $fetch(`/api/verses/${bookParam!.ShortName}/${chapterParam}`),
  {
    watch: [chapter],
  }
);

const verseId = (verse: number | string) =>
  bookParam?.ShortName.concat(chapter.value.toString()).concat(
    verse.toString()
  );
</script>

<template>
  <div>
    <div class="d-flex align-center ga-3 pt-9 px-3">
      <h1 class="text-h4">{{ bookParam!.FullName }}</h1>
      <v-select
        :items="chapterRange(bookParam!.ChapterQty)"
        :model-value="chapter"
        label="Toko"
        variant="solo"
        :max-width="200"
        @update:model-value="setChapter"
      />
    </div>
    <div
      v-if="status === 'pending'"
      class="d-flex justify-space-around mt-16 mb-3"
    >
      <v-progress-circular
        :size="70"
        :width="7"
        color="primary"
        indeterminate
      />
    </div>
    <template v-if="status !== 'pending' && verses?.length">
      <p
        v-for="verse in verses"
        :id="verseId(verse!.verse)"
        :key="verseId(verse!.verse)"
        class="text-body-1 px-3"
      >
        <span>{{ verse!.verse }}</span>
        {{ verse!.text }}
      </p>
    </template>
  </div>
</template>
