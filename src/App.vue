<script setup>
  import HomePage from './components/HomePage.vue';
  import BinomialSearch from './components/BinomialSearch.vue';
  import TaxonPage from './components/TaxonPage.vue';
  import LinkRow from './components/LinkRow.vue';
  import BiologicalAssociations from './components/BiologicalAssociations.vue';
  import TaxonDistribution from './components/TaxonDistribution.vue';
</script>

<template>
  <div class="row">
    <img class="banner" src="./components/images/chalcidBanner.jpg">
    <div class="col-12" name="linkRowContainer">
      <slot name="linkRow"></slot>
      <LinkRow />
    </div>
    <div class="col-12" name="contentContainer">
      <!--Need to put page position here-->
      <!--visit history needs to be a column on the left-->
      <slot name="search"></slot>
      <keep-alive>
        <slot name="taxonPage"></slot>
      </keep-alive>
    </div>
  </div>
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
  
  .banner {
    width: 100%;
    height: auto;
  }
  
  .nav-item {
    display: inline-block;
  }
}
</style>
