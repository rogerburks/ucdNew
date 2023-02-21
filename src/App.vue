<script setup>
import HomePage from './components/HomePage.vue';
import BinomialSearch from './components/BinomialSearch.vue';
import TaxonPage from './components/TaxonPage.vue';
import LinkRow from './components/LinkRow.vue';
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
  <body>
    <!--Need to put banner here-->
    <LinkRow />
    <!--Need to put page position here-->
    <!--visit history needs to be a column on the left-->
    <BinomialSearch />
  </body>
</template>

<style scoped>
header {
  line-height: 1.5;
}

body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
