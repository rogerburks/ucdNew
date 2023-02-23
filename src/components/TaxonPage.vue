<template v-slot:taxonPage>
    <div class = "row">
      <div class="col-12">
        <h3 v-if="italicized"><i>{{ this.taxonViewed[0].cached }}</i> {{ this.taxonViewed[0].cached_author_year }}</h3>
        <h3 v-else>{{ this.taxonViewed[0].cached }} {{ this.taxonViewed[0].cached_author_year }}</h3>
      </div>
    </div>
    <br>
    <div class="row" ref="containerOfSynonyms" name="taxonPageSynonymsContainer">
      <div class="col-12 bd-highlight align-items-start" id="results-list-div" ref="resultsList">
        <button class="btn btn-link" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSynonyms" aria-expanded="false">
          Toggle synonyms and unavailable names
        </button>
        <div id="collapseSynonyms">
          <ul id="results-list-span">
            <li style="list-style-type:none" v-for="tag in finalArray" v-html="tag"></li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
<script>
  import axios from "axios"
  import { computed, ref, reactive } from '@vue/runtime-core'
  
  var synonymItem = ref("");
  var synonymHtml = ref("");
  var synonymTags = ref([]);
  var synonymUnsorted = ref([]);
  var synonymFinal = ref([]);
  
  export default {
    setup() {
      //variables are made reactive or ref here      
      const taxonPageApiResults = ref([{}]);
      const taxonViewed = ref([{}]);
      const relationshipsResponse = ref([{}]);
      const synonyms = ref([{}]);
      const sortedSynonyms = ref([{}]);
      const filteredSynonyms = ref([{}]);
      
      const synonymSort = (synonymUnsorted) => {
        return synonymUnsorted.value.sort((a, b) => {
        const yearA = a.match(/(\d{4})/);
        const yearB = b.match(/(\d{4})/);
        if (yearA && yearB) {
          return parseInt(yearA[1]) - parseInt(yearB[1]);
        }
        return a.localeCompare(b);
        });
      };

      return {
        taxonPageApiResults,
        taxonViewed,
        relationshipsResponse,
        synonyms,
        sortedSynonyms,
        filteredSynonyms,
        synonymItem,
        synonymHtml,
        synonymTags,
        synonymUnsorted,
        synonymSort,
        synonymFinal
      };
    },
    
    computed: {
        italicized: function(){
            if(this.taxonViewed[0].rank_string === 'NomenclaturalRank::Iczn::GenusGroup::Genus'){
              return true
            } else if (this.taxonViewed[0].rank_string === 'NomenclaturalRank::Iczn::SpeciesGroup::Species'){
              return true
            } else {
              return false
            }
        },
        
        finalArray: {
          get: function () {
            return [...synonymTags.value, ...synonymUnsorted.value]
          },
          set: function (synonymFinal) {
            this.synonymFinal.value = [...this.synonymUnsorted.value, ...this.synonymTags.value]
          }
        }
    },
    
    async mounted(taxonID) {
      taxonID = this.$route.query.taxonID
      const response = await axios.get('https://sfg.taxonworks.org/api/v1/taxon_names?taxon_name_id[]=' + taxonID + '&validity=true&per=250&exact=true&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ')
      //await axios.get('https://sfg.taxonworks.org/api/v1/taxon_names?validity=false&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ')
      //  .then(response => {
      //    const synonymsResponse = response.data;
      //    console.log(synonymsResponse);
      //    const synonymsFiltered = synonymsResponse.filter(synonyms => synonyms.cached_valid_taxon_name_id === taxonID);
      //    console.log(synonymsFiltered);
      //  })
      const relationshipsResponse = await axios.get('https://sfg.taxonworks.org/api/v1/taxon_name_relationships?object_taxon_name_id=' + taxonID + '&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ')
      //console.log(relationshipsResponse)
      this.taxonViewed = response.data
      this.synonyms = relationshipsResponse.data
      //this.sortSynonyms()
      //this.removeNonSynonyms()
      //this.italicizeSynonyms()
      //console.log('The taxon ID is: ' + taxonID);
      //console.log(this.taxonPageApiResults)
      //console.log(this.taxonViewed)
      //console.log('The rank string is: ' + this.taxonViewed[0].rank_string);
      this.sortedSynonyms = this.synonyms.sort((a, b) => {
        if (a.cached < b.cached) return -1
        if (a.cached > b.cached) return 1
      })
      //this.filteredSynonyms = this.sortedSynonyms.filter(x => x.inverse_assignment_method === "iczn_invalid" || x.inverse_assignment_method === "iczn_subjective_synonym" || x.inverse_assignment_method === "iczn_misspelling")
      this.filteredSynonyms = this.sortedSynonyms.filter(x => x.inverse_assignment_method === "iczn_subjective_synonym" || x.inverse_assignment_method === "iczn_misspelling" || x.inverse_assignment_method === "original_species" || x.inverse_assignment_method === "iczn_synonym" || x.inverse_assignment_method === "iczn_invalid")
      const synonymIDArray = this.filteredSynonyms.map(obj => obj.subject_taxon_name_id);
      //console.log("synonymIDArray is: " + synonymIDArray)
      synonymTags.value = [];
      synonymUnsorted.value = [];
      const originalCombinationHTML = axios.get('https://sfg.taxonworks.org/api/v1/taxon_names/' + taxonID + '?extend[]=taxon_name_relationships&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ')
        .then(function(originalCombinationHTML){
          synonymItem = originalCombinationHTML.data
          synonymHtml = synonymItem.original_combination.toString()
          synonymTags.value.push(synonymHtml)
        })    
      synonymIDArray.forEach(function(item) {
        //console.log("this item is: " + item)
        const synonymPromise = axios.get('https://sfg.taxonworks.org/api/v1/taxon_names/' + item + '/inventory/summary?id=' + item + '&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ')
        //console.log(synonymPromise)
        .then(function(synonymPromise) {
          if (synonymPromise.data){
            synonymItem = synonymPromise.data
            synonymHtml = synonymItem.full_name_tag.toString()
            //console.log("synonymHtml is: " + synonymHtml)
            if(synonymItem != null ){
              //synonymTags.value.push(synonymHtml)
              synonymUnsorted.value.push(synonymHtml)
              //console.log("this synonymTag iteration is: " + synonymTags.value) 
              //console.log("this synonymTag iteration is: " + synonymUnsorted.value) 
            }
          //synonymTags.value.push(synonymUnsorted.value)
          return synonymUnsorted
          //return synonymTags
          }
        })
      });
      console.log(synonymUnsorted.value);
      console.log(synonymTags.value);
      //synonymFinal.value = [...synonymUnsorted.value, ...synonymTags.value];
      console.log(synonymFinal.value);
    }
  }
</script>