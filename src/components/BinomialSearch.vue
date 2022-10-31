<!-- in vue.js, ideally displayed information should be reactive and a single page should handle as much as possible-->
<!-- This component handles searches and displays search results -->
<template>
    <div class="input-group mb-3" id="binomial-search-group">
        <span class="input-group-text" id="genus-input-label">genus</span>
        <input type="text" class="form-control" aria-describedby="genus-input" v-model="genus">
        <span class="input-group-text" id="species-input-label">species</span>
        <input type="text" class="form-control" aria-describedby="species-input" v-model="species">
        <button class="btn btn-outline-secondary" type="button" id="binomial-search-button" @click="useInputTerms($event)">search</button>
    </div>
    <br>
    
    <!-- <div id = "search-terms-display">
      <span id = "search-string-preface">Search terms: </span> <span v-show="genus"> genus = <i>{{ genus }}</i></span> <span v-show="species">and species = <i>{{ species }}</i></span>
    </div>
    -->
    
    <!--
    <div>
      <span id = "api-results">The results are: <i>{{ cached }}</i>  {{ cached_author_year }}</span>
    </div>
    -->
    <div class="row align-items-start">
      <div class="col p-2 bd-highlight" id="results-list-div" ref="resultsList">
        <span id="results-list-span"><br>
        <li style="list-style-type:none" v-for="(item, index) in apiResults" :key="item.id"><a style="text-decoration:underline; color: var(--bs-link-color);" @click="displayTaxonPage(apiResults[index])"><i>{{ apiResults[index].cached }}</i> {{ apiResults[index].cached_author_year }}</a></li>
        </span>
      </div>
      
      <div class="col p-2 bd-highlight" id="taxon-page-div" ref="taxonPage">
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
  computed: {
    scientificNameSearch: function() {
      //if(genus){
        //var searchName = genus & " " & species 
      //}
      //else if (species){
      //  var searchName = species
      //}
      //
      //if(!searchName){
      //  return "";
      //}
      //
      //apiResult = apiResult.filter(function(item){
      //  if(item.apiPayload.indexOf(searchName) !== -1){
      //    return item; 
      //  }
      //})
      
      //return apiResult;
    }
  },
  
  setup() {
    //variables are made reactive or ref here
    return {genus: ref(''),
            species: ref(''),
            apiResults: ref([{}]),
            listClickedText: ref(''),
            taxonClicked: ref([{}]),
            taxonIDClicked: ref('')
            }
    
  },
  
  methods: {
    //this handles button presses
    useInputTerms(e) {
      //console.log(this.genus);
      //console.log(this.species);
      
      if(this.genus && this.species){
        this.genus = this.genus.replace(/^./, this.genus[0].toUpperCase());
        this.species = this.species.replace(/./, this.species[0].toLowerCase());
        this.apiResults = axios
      .get('https://sfg.taxonworks.org/api/v1/taxon_names?name=' + this.genus + '%20' + this.species + '&validity=true&exact=true&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ')
      .then(response => {(this.apiResults = response.data)})
      .catch(error => console.log(error))
      }
      else if(this.genus){
        this.genus = this.genus.replace(/^./, this.genus[0].toUpperCase());
        this.apiResults = axios
        .get('https://sfg.taxonworks.org/api/v1/taxon_names?name=' + this.genus + '&validity=true&exact=true&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ')
        .then(response => {(this.apiResults = response.data)})
        .catch(error => console.log(error))
      }
      else if(this.species){
        this.species = this.species.replace(/^./, this.species[0].toLowerCase());
        this.apiResults = axios
      .get('https://sfg.taxonworks.org/api/v1/taxon_names?name=' + this.species + '&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ')
      .then(response => {(this.apiResults = response.data)})
      .catch(error => console.log(error))
      }
      //if (this.apiResults){
      //  this.genus = ""
      //}
      this.$refs['taxonPageNameItalicized'].textContent = ''
      this.$refs['taxonPageNameAuthorYear'].textContent = ''
    },
    
    displayTaxonPage(taxonClicked) {
      //console.log('someone has clicked a link that triggers displayTaxonPage')
      //this.$refs['resultsList'].style.fontsize = "10px"
      this.taxonIDClicked = taxonClicked.id
      this.listClickedText = this.$refs['resultsList'].text
      console.log(taxonClicked)
      this.$refs['taxonPageNameItalicized'].textContent = taxonClicked.cached + " "
      this.$refs['taxonPageNameAuthorYear'].textContent = taxonClicked.cached_author_year
    }
  }
}
</script>