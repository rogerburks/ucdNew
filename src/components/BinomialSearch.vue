<!-- in vue.js, ideally displayed information should be reactive and a single page should wrap components that display as needed-->
<!-- This component handles searches and displays search results -->
<!-- //To do: add checkbox switch for including or excluding OTUs from the nomenclature search -->
<!-- Why is there a maximum of 25 results returned by the api?  -->
<!-- Stop italicizing family-group names in returned results  -->
<template>
    <div class="row" ref="containerOfInputGroup">
      <div class="input-group col-auto mb-3 align-items-start" id="binomial-search-group">
        <span class="input-group-text" id="genus-input-label">genus</span>
        <input type="text" class="form-control" aria-describedby="genus-input" v-model="genus" @keyup.enter="useInputTerms($event)">
        <span class="input-group-text" id="species-input-label">species</span>
        <input type="text" class="form-control" aria-describedby="species-input" v-model="species" @keyup.enter="useInputTerms($event)">
        <button class="btn btn-outline-secondary" type="button" id="binomial-search-button" @click="useInputTerms($event)">search</button>
      </div>
    </div>
    <br>
    
    <div class="row" ref="containerOfResults">
      <div class="col-xs-12 bd-highlight align-items-start" id="results-list-div" ref="resultsList">
        <span id="results-list-span"><br>
        <li style="list-style-type:none" v-for="(item, index) in apiResults" :key="item.id"><a style="text-decoration:underline; color: var(--bs-link-color);" @click="displayTaxonPage(apiResults[index])"><i>{{ apiResults[index].cached }}</i> {{ apiResults[index].cached_author_year }}</a></li>
        </span>
      </div>
      <div class="col-xs-12 bd-highlight" id="taxon-page-div" ref="taxonPage">
        <div>
          <span id="taxon-page-italicized-name" style="font-size:large; font-style: italic; font-weight: 600;" ref="taxonPageNameItalicized"><strong></strong> </span><span id="taxon-page-author-year" style="font-size:large; font-style: normal; font-weight: 600;" ref="taxonPageNameAuthorYear"></span>
        </div>
      </div>
    </div>
</template>

<script>
import axios from "axios"
import { computed, ref, reactive } from '@vue/runtime-core'

export default {
  setup() {
    //variables are made reactive or ref here
    return {genus: ref(''),
            species: ref(''),
            apiResults: ref([{}]),
            listClickedText: ref(''),
            taxonClicked: ref([{}]),
            taxonIDClicked: ref(''),
            sortedResponse: ref([{}]),
            }
    
  },
  
  methods: {
    //this handles button presses for nomenclature searches
    useInputTerms(e) {
      //console.log(this.genus);
      //console.log(this.species);
      //If a genus and a species are entered, this functions as an exact search. If only a genus or a species is entered, it returns whatever matches
      if(this.genus && this.species){
        this.genus = this.genus.replace(/^./, this.genus[0].toUpperCase());
        this.species = this.species.replace(/./, this.species[0].toLowerCase());
        this.apiResults = axios
      .get('https://sfg.taxonworks.org/api/v1/taxon_names?name=' + this.genus + '%20' + this.species + '&validity=true&per=250&exact=true&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ')
      .then(response => {(this.apiResults = response.data)})
      .catch(error => console.log(error))
      }
      else if(this.genus){
        this.genus = this.genus.replace(/^./, this.genus[0].toUpperCase());
        this.apiResults = axios
        .get('https://sfg.taxonworks.org/api/v1/taxon_names?name=' + this.genus + '&validity=true&per=250&exact=false&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ')
        .then(response => {
          this.apiResults = response.data
          this.sortResponse()
          }
        )
        .catch(error => console.log(error))
      }
      else if(this.species){
        this.species = this.species.replace(/^./, this.species[0].toLowerCase());
        this.apiResults = axios
      .get('https://sfg.taxonworks.org/api/v1/taxon_names?name=' + this.species + '&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ')
      .then(response => {
          this.apiResults = response.data
          this.sortResponse()
          }
        )
      .catch(error => console.log(error))
      }
      this.$refs['taxonPageNameItalicized'].textContent = ''
      this.$refs['taxonPageNameAuthorYear'].textContent = ''
    },
    
    displayTaxonPage(taxonClicked) {
      //this.$refs['resultsList'].style.fontsize = "10px"
      //this.taxonIDClicked = taxonClicked.id
      //this.listClickedText = this.$refs['resultsList'].text
      this.taxonClicked = taxonClicked
      //console.log(taxonClicked)
      //this.$refs['taxonPageNameItalicized'].textContent = taxonClicked.cached + " "
      //this.$refs['taxonPageNameAuthorYear'].textContent = taxonClicked.cached_author_year
      this.$router.push({ name: 'TaxonPage', query: { taxonID: taxonClicked.id }});
    },
    
    sortResponse() {
      //this.apiResults = this.apiResults.sort(function(a, b){return a.cached - b.cached})
      this.sortedResponse = this.apiResults.sort((a, b) =>{
        if (a.cached < b.cached) return -1
        if (a.cached > b.cached) return 1
        return 0
      })
    }
  }
}
</script>