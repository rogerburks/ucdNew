<template>
    <div class="input-group mb-3" id="binomial-search-group">
        <span class="input-group-text" id="genus-input-label">genus</span>
        <input type="text" class="form-control" aria-describedby="genus-input" v-model="genus">
        <span class="input-group-text" id="species-input-label">species</span>
        <input type="text" class="form-control" aria-describedby="species-input" v-model="species">
        <button class="btn btn-outline-secondary" type="button" id="binomial-search-button" @click="useInputTerms($event)">search</button>
    </div>
    
    <div id = "search-terms-display">
      <span id = "search-string-preface">Search terms: </span> <span v-show="genus"> genus = <i>{{ genus }}</i></span> <span v-show="species">and species = <i>{{ species }}</i></span>
    </div>
    
    <div>
      <span id = "api-results">The results are: {{ taxonName }}</span>
    </div>
</template>

<script>
import axios from "axios"
import { computed, ref, reactive } from '@vue/runtime-core'

export default {
  mounted() {
  },
  
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
    //variables are made reactive here
    let genus = ref('')
    let species = ref('')
    let apiResults = ref([])
    let taxonName = ref('')
    //let id = ref('')
    //let name = ref('')
    
    return { genus, species, apiResults, taxonName }
    
  },
  
  methods: {
    useInputTerms(e) {      
      //console.log(this.genus);
      //console.log(this.species);
      
      if(this.genus && this.species){
        this.genus = this.genus.replace(/^./, this.genus[0].toUpperCase());
        this.species = this.species.replace(/^./, this.species[0].toLowerCase());
        this.apiResults = axios
      .get('https://sfg.taxonworks.org/api/v1/taxon_names?name=' + this.genus + '%20' + this.species + '&validity=true&exact=true&token=ygjruflw1wvXStL4DboIYg&project_token=adhBi59dc13U7RxbgNE5HQ')
      .then((response) => {
        console.log(response.data[0].cached)
        })
      .catch(error => console.log(error))
      }
      else if(this.genus){
        this.genus = this.genus.replace(/^./, this.genus[0].toUpperCase());
        this.apiResults = axios
      .get('https://sfg.taxonworks.org/api/v1/taxon_names?name=' + this.genus + '&validity=true&exact=true&token=ygjruflw1wvXStL4DboIYg&project_token=adhBi59dc13U7RxbgNE5HQ')
      .then(response => {
        (this.taxonName = response.data[0].cached)
        console.log(response.data[0].name)
        })
      .catch(error => console.log(error))
      }
      else if(this.species){
        this.species = this.species.replace(/^./, this.species[0].toLowerCase());
        this.apiResults = axios
      .get('https://sfg.taxonworks.org/api/v1/taxon_names?name=' + this.species + '&token=ygjruflw1wvXStL4DboIYg&project_token=adhBi59dc13U7RxbgNE5HQ')
      .then((response) => {
        console.log(response.data[0].cached)
        })
      .catch(error => console.log(error))
      }
    }
  }
}


</script>