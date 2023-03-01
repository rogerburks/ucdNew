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
        <button class="btn btn-link" type="button" @click="showSynonyms = !showSynonyms" aria-expanded="false">
          <span v-if="resultsExist">Toggle taxonomic history</span>
        </button>
        <div id="collapseSynonyms" v-show="showSynonyms">
          <div id = "showIfQuery" v-if="resultsExist">
            <ul id="results-list-span">
              <li style="list-style-type:none" v-for="tag in sortedSynonyms" v-html="tag"></li>
            </ul>
          </div>
          <div id="showIfNoQuery" v-else>
            No search has been made
          </div>
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
  var otuIDChain = ('');
  var taxonIDChain = ('');
  var taxonNamesWithOtusData = ref([]);
  
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
      
      const finalArray = computed(() => {
        return [...synonymTags.value, ...sortedSynonyms.value]
      });

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
        newVal,
        finalArray,
        taxonNamesWithOtusData
      };
    },
    
    data(){
      return {
        showSynonyms: true
      }
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
      },
      
      resultsExist() {
        return this.$route.query.taxonID !== undefined && this.$route.query.taxonID !== null;
      }
    },
    
    async mounted() {
      const taxonID = this.$route.query.taxonID;
      const promises = [];
      if(taxonID){
        const response = await axios.get(`https://sfg.taxonworks.org/api/v1/taxon_names?taxon_name_id[]=${taxonID}&validity=true&per=250&exact=true&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ`);
        const relationshipsResponse = await axios.get(`https://sfg.taxonworks.org/api/v1/taxon_name_relationships?object_taxon_name_id=${taxonID}&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ`);
        
        this.taxonViewed = await response.data
        taxonIDChain = "?taxon_name_id[]=" + await this.taxonViewed[0].id
        
        this.synonyms = relationshipsResponse.data

        this.filteredSynonyms = this.synonyms.filter(x => x.inverse_assignment_method === "iczn_subjective_synonym" || x.inverse_assignment_method === "iczn_misspelling" || x.inverse_assignment_method === "original_species" || x.inverse_assignment_method === "iczn_synonym" || x.inverse_assignment_method === "iczn_invalid");
        
        for (const taxonName of this.filteredSynonyms) {
          taxonIDChain = taxonIDChain + "&taxon_name_id[]=" + taxonName.subject_taxon_name_id.toString()
        }
        console.log('taxonIDChain is: ' + taxonIDChain);
        
        const taxonNamesWithOtus = await axios.get(`https://sfg.taxonworks.org/api/v1/taxon_names/${taxonIDChain}&extend[]=otus&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ`)
        this.taxonNamesWithOtusData = await taxonNamesWithOtus.data
        //console.log("tnwod test: " + this.taxonNamesWithOtusData[0].id.toString())

        const synonymIDArray = this.filteredSynonyms.map(obj => obj.subject_taxon_name_id);
        console.log("synonymIDArray is: " + synonymIDArray)
        const originalCombinationHTML = await axios.get(`https://sfg.taxonworks.org/api/v1/taxon_names/${taxonID}?extend[]=otus&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ`);
        
        this.synonymItem = originalCombinationHTML.data;
        this.synonymHtml = this.synonymItem.original_combination.toString();
        
        //This for...of loop concatenates OTU (Operational Taxonomic Unit) IDs and proper syntax to make queries using a chain otu_id[] parameters. This is being done to request information that is more convenient to access through OTUs instead of through taxon names
        for (const taxonName of this.taxonNamesWithOtusData) {
          //console.log("otuID is: " + otuID.toString())
          otuIDChain = otuIDChain + "&otu_id[]=" + taxonName.id.toString()
          //console.log("this otu.id is: " + otu.id.toString())
        }
        console.log('otuIDChain is: ' + otuIDChain);
        
        synonymTags.value.push(this.synonymHtml);

        for (const taxonNameID of synonymIDArray) {
          //console.log("synonymIDArray taxonNameID is: " + taxonNameID)
          const synonymPromise = axios.get(`https://sfg.taxonworks.org/api/v1/taxon_names/${taxonNameID}?extend[]=otus&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ`);
          promises.push(synonymPromise);
        }

        const sortedSynonyms = await Promise.all(promises).then(responses => {
          const synonymUnsorted = responses.map(response => {
            const synonymItem = response.data;
            const synonymHtml = synonymItem.original_combination.toString();
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

        //console.log(sortedSynonyms);
      }
    }
  }
</script>