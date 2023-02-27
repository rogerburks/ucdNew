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
            <li style="list-style-type:none" v-for="tag in sortedSynonyms" v-html="tag"></li>
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
  var synonymSorted = ref([]);
  
  export default {
    setup() {
      //variables are made reactive or ref here      
      const taxonPageApiResults = ref([{}]);
      const taxonViewed = ref([{}]);
      const relationshipsResponse = ref([{}]);
      const synonyms = ref([{}]);
      const sortedSynonyms = ref([{}]);
      const filteredSynonyms = ref([{}]);
      const newVal = ref([]);

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
        synonymSorted,
        synonymFinal,
        newVal
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
      },
      
      synonymSorting: {
        get() {
          return synonymUnsorted.value
        },
        set(synonymSorted) {
          this.synonymSorted = this.synonymUnsorted.sort((a, b) => {
            const yearA = a.match(/(\d{4})/);
            const yearB = b.match(/(\d{4})/);
            if (yearA && yearB) {
              return parseInt(yearA[1]) - parseInt(yearB[1]);
            }
            return a.localeCompare(b);
          });
        }
      }
    },

    
    async mounted() {
  const taxonID = this.$route.query.taxonID;
  const promises = [];
  
  const response = await axios.get(`https://sfg.taxonworks.org/api/v1/taxon_names?taxon_name_id[]=${taxonID}&validity=true&per=250&exact=true&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ`);
  const relationshipsResponse = await axios.get(`https://sfg.taxonworks.org/api/v1/taxon_name_relationships?object_taxon_name_id=${taxonID}&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ`);
  
  this.taxonViewed = response.data;
  this.synonyms = relationshipsResponse.data;

  this.sortedSynonyms = this.synonyms.sort((a, b) => {
    if (a.cached < b.cached) return -1;
    if (a.cached > b.cached) return 1;
    return 0;
  });

  this.filteredSynonyms = this.sortedSynonyms.filter(x => x.inverse_assignment_method === "iczn_subjective_synonym" || x.inverse_assignment_method === "iczn_misspelling" || x.inverse_assignment_method === "original_species" || x.inverse_assignment_method === "iczn_synonym" || x.inverse_assignment_method === "iczn_invalid");

  const synonymIDArray = this.filteredSynonyms.map(obj => obj.subject_taxon_name_id);
  const originalCombinationHTML = await axios.get(`https://sfg.taxonworks.org/api/v1/taxon_names/${taxonID}?extend[]=taxon_name_relationships&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ`);
  
  this.synonymItem = originalCombinationHTML.data;
  this.synonymHtml = this.synonymItem.original_combination.toString();
  synonymTags.value.push(this.synonymHtml);

  for (const item of synonymIDArray) {
    const synonymPromise = axios.get(`https://sfg.taxonworks.org/api/v1/taxon_names/${item}/inventory/summary?id=${item}&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ`);
    promises.push(synonymPromise);
  }

  const sortedSynonyms = await Promise.all(promises).then(responses => {
    const synonymUnsorted = responses.map(response => {
      const synonymItem = response.data;
      const synonymHtml = synonymItem.full_name_tag.toString();
      return synonymHtml;
    });

    const synonymSorted = synonymUnsorted.sort((a, b) => {
      const yearA = a.match(/(\d{4})/);
      const yearB = b.match(/(\d{4})/);
      if (yearA && yearB) {
        return parseInt(yearA[1]) - parseInt(yearB[1]);
      }
      return a.localeCompare(b);
    });

    return synonymSorted;
  });

  this.sortedSynonyms = sortedSynonyms;

  console.log(sortedSynonyms);
}

  }
</script>