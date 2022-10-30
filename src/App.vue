<script setup>
import HomePage from './components/HomePage.vue';
import BinomialSearch from './components/BinomialSearch.vue';
</script>

<template>
  <header>
    <!-- <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125
  components: { search }," />
  /-->

    <div class="wrapper">
      <HomePage msg="Universal Chalcidoidea Database" />
    </div>
  </header>
<br>
  <main>
    <BinomialSearch />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: nowrap;
  }
}
</style>
