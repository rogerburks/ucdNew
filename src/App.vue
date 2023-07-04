<script>
  import Everything from './components/Everything.vue';
  import LinkRow from './components/LinkRow.vue';
  
  export default {
    components: {
      Everything,
      LinkRow
    }
  }
</script>

<template>
  <div class="banner" src="./components/images/chalcidBanner.jpg" alt="Banner Image"></div>
  <div id="app">
    <LinkRow></LinkRow>
    <router-view :key="$route.fullPath"></router-view>
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
  
  #app {
    padding: 0%
  }
}
</style>