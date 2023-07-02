<script setup>
  import LinkRow from './components/LinkRow.vue';
</script>

<template>
  <div class="banner" src="./components/images/chalcidBanner.jpg" alt="Banner Image"></div>
  <div class="row">
    <div class="col-12" name="linkRowContainer">
      <slot name="linkRow"></slot>
      <LinkRow />
    </div>
    <div class="col-12" name="contentContainer">
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
    height: 200px;
    overflow: hidden;
    background-image: url('./components/images/chalcidBanner.jpg');
    background-repeat: repeat-x;
    background-position: left;
  }
  
  .nav-item {
    display: inline-block;
  }
}
</style>