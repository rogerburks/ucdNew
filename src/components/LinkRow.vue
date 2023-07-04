<!-- This is a row of links that should be positioned below the banner and above any other interactive items-->
<!-- I have chosen to use the Bootstrap base nav in this component. Other nav options exist-->

<template>
    <div class="row" name="linkRowContainer">
        <ul class = "nav">
          <li class="nav-item">
              <router-link :to ="{name: 'Home'} " class="nav-link">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link :to ="{name: 'BinomialSearch'} " class="nav-link">Search names</router-link>
            </li>
            <li class="nav-item">
              <router-link :to ="{name: 'AssociatesSearch'} " class="nav-link">Search non-animal associates</router-link>
            </li>
            <li class="nav-item">
              <router-link :to ="{name: 'DistributionSearch'} " class="nav-link">Browse by country</router-link>
            </li>
            <li class="nav-item">
              <router-link :to ="{name: 'KeywordSearch'} " class="nav-link">Search keywords</router-link>
            </li>
        </ul>
    </div>
</template>

<style scoped>
  .nav-link.router-link-active {
    background-color: #ccc;
    color: #000;
  }
</style>