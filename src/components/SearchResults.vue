<template v-slot:searchResults>
  <div class="row" ref="containerOfResults" name="associatesSearchResultsContainer">
    <div class="col-12 bd-highlight align-items-start" id="results-list-div" ref="resultsList">
    <span id="results-list-span"><br>
      <li style="list-style-type:none" v-if="srProp" v-for="(taxonNameItem, index) in srProp" :key="taxonNameItem.id"><a style="text-decoration:underline; color: var(--bs-link-color);" @click="displayTaxonPage(srProp[index]), show=!show"><i>{{ srProp[index].cached }}</i> {{ srProp[index].cached_author_year }}</a></li>
      <span v-else>No search results have been returned yet.</span>
    </span>
    </div>
    <div class="col-xs-12 bd-highlight" id="taxon-page-div" ref="taxonPage">
    <div>
        <span id="taxon-page-italicized-name" style="font-size:large; font-style: italic; font-weight: 600;"><strong></strong> </span>
        <span id="taxon-page-author-year" style="font-size:large; font-style: normal; font-weight: 600;"></span>
    </div>
    </div>
  </div>
</template>

<script>
  import { reactive } from '@vue/runtime-core'
  import { useRouter } from 'vue-router'
  
  export default {
    name: 'SearchResults',
    
    props: {
      srProp: Array
    },
    
    setup() {
      const state = reactive({
        show: true,
        taxonClicked: []
      });
      
      const router = useRouter();
        
      const displayTaxonPage = (taxonClicked) => {
        state.taxonClicked = taxonClicked;
        router.push({ name: 'TaxonPage', query: { taxonID: taxonClicked.id }});
        state.show = !state.show;
      };
      
      return {
        displayTaxonPage
      };
    }
  }
</script>