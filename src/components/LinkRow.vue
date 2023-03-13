<!-- This is a row of links that should be positioned below the banner and above any other interactive items-->
<!-- I have chosen to use the Bootstrap base nav in this component. Other nav options exist-->

<template  v-slot:linkRow>
    <div class="row" name="linkRowContainer">
        <ul class = "nav">
            <li class="nav-item">
              <router-link :to ="{name: 'BinomialSearch'} " class="nav-link">Search names</router-link>
            </li>
            <li class="nav-item">
              <router-link :to ="{name: 'TaxonPage'} " class="nav-link">Taxon page</router-link>
            </li>
        </ul>
        <router-view></router-view>
    </div>
</template>