<script setup lang="ts">
import { BOOKS } from "~/books.constant";

const getBookByShortName = (shortName: string | undefined) =>
  BOOKS.find((book) => book.ShortName === shortName);

const route = useRoute();

let bookParam = getBookByShortName(route.params.book as string | undefined);
const chapter = Number(route.params.chapter as string) || 1;

if (!bookParam) {
  bookParam = BOOKS[0]!;
}

if (route.path === "/") {
  await navigateTo(`/mamaky/${bookParam.ShortName}/${chapter}`);
}

let initialQuery = "";
if (route.path.startsWith("/mitady")) {
  if (Array.isArray(route.query.q)) {
    initialQuery = route.query.q[0] || "";
  } else {
    initialQuery = route.query.q || "";
  }
}

const query = ref(initialQuery);
const queryChange = (newQuery: string) => {
  query.value = newQuery;
};
const handleQuery = async () => {
  await navigateTo({
    path: `/mitady`,
    query: {
      q: query.value,
    },
  });
};

watchEffect(() => {
  if (!route.path.startsWith("/mitady")) {
    query.value = "";
  }
});
</script>

<template>
  <v-layout ref="app" class="rounded rounded-md">
    <v-app-bar color="primary" prominent>
      <v-toolbar-title>Baiboly Online</v-toolbar-title>
      <v-spacer />
      <form role="search" class="search-form" @submit.prevent="handleQuery">
        <v-text-field
          label="Teny hokarohina"
          variant="underlined"
          :model-value="query"
          @update:model-value="queryChange"
          @keyup.enter="handleQuery"
        />
      </form>
      <v-btn icon="mdi-magnify" variant="text" />
    </v-app-bar>

    <v-navigation-drawer :width="400" name="drawer" permanent>
      <v-list nav>
        <v-list-item
          v-for="book in BOOKS"
          :key="book.ShortName"
          :value="book.ShortName"
        >
          <v-list-item-title>
            <NuxtLink
              :to="'/mamaky/'.concat(book.ShortName).concat('/1')"
              class="text-decoration-none text-h6 book-link"
              >{{ book.FullName }}</NuxtLink
            >
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <slot />
    </v-main>

    <v-footer name="footer" app>
      {{ new Date().getFullYear() }} —
      <strong class="font-weight-regular"
        >Voninahitra ho an'Andriamanitra</strong
      >
    </v-footer>
  </v-layout>
</template>

<style lang="scss">
.book-link {
  color: inherit;
}
.search-form {
  margin-left: auto;
  margin-right: auto;
  max-width: 600px;
  min-width: 350px;
  margin-top: 18px;
  margin-right: 70px;
}
</style>
