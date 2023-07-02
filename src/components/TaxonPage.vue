<template v-slot:taxonPage>
  <div class="row">
    <div class="col-12">
      <h3 v-if="italicized"><i>{{ this.taxonViewed[0].cached }}</i> {{ this.taxonViewed[0].cached_author_year }}</h3>
      <h3 v-else>{{ this.taxonViewed[0].cached }} {{ this.taxonViewed[0].cached_author_year }}</h3>
    </div>
  </div>
  <br>
  <div class="row">
    <div class="col-md-8 stationaryDiv">
      <div ref="containerOfSynonyms" name="taxonPageSynonymsContainer">
        <div class="col-12 bd-highlight align-items-start" id="results-list-div" ref="resultsList">
          <button class="btn btn-link" type="button" @click="showSynonyms = !showSynonyms" aria-expanded="false">
            <font-awesome-icon :icon="showSynonyms ? 'angle-down' : 'angle-right'" />
            <span v-if="!showSynonyms"> Show taxonomic history</span>
            <span v-else> Taxonomic history</span>
          </button>
          <div id="collapseSynonyms" v-show="showSynonyms">
            <div id="showIfQuery" v-if="resultsExist">
              <ul id="results-list-span">
                <li style="list-style-type:none" v-for="tag in synonymUnsorted.timeline" :key="tag" v-html="tag.label"></li>
              </ul>
            </div>
            <div id="showIfNoQuery" v-else>
              No search has been made
            </div>
          </div>
        </div>
      </div>
      <nomenclaturalReferences :nrProp="nomenclaturalReferencesResults"></nomenclaturalReferences>
      <biological-associations :baProp="otuIDS"></biological-associations>
    </div>
    <div class="col-md-4 movingDiv">
      <taxon-distribution :baProp="otuIDS"></taxon-distribution>
    </div>
  </div>
</template>

<style>
@media (min-width: 1537px) {
  .stationaryDiv {
    flex: 0 0 66.66667%;
    max-width: 66.66667%;
    padding-right: 15px;
  }

  .movingDiv {
    flex: 0 0 33.33333%;
    max-width: 33.33333%;
    padding-left: 15px;
  }
}

@media (max-width: 1536px) {
  .movingDiv {
    flex: max-content !important;
    max-width: 100%;
  }
}
</style>
  
<script>
  import axios from "axios"
  import { onMounted, ref, reactive, computed } from 'vue'
  import BiologicalAssociations from './BiologicalAssociations.vue'
  import NomenclaturalReferences from "./NomenclaturalReferences.vue"
  import TaxonDistribution from "./TaxonDistribution.vue"
  
  var synonymItem = ref("");
  var synonymHtml = ref("");
  var synonymTags = ref([]);
  var synonymFinal = ref([]);
  var synonymSorted = ref([]);
  var otuIDChain = ref('');
  var nomenclaturalReferencesResults = ref([]);
  var taxonIDChain = ref('');
  var taxonNamesWithOtusData = ref([]);
  var taxonNameIDForOTULoop = ('');
  var otusRetrieved = ref([{}]);
  
  export default {
    name: 'TaxonPage',
    
    setup() {
      //variables are made reactive or ref here      
      const taxonPageApiResults = ref([{}]);
      const taxonViewed = ref([{}]);
      const relationshipsResponse = ref([{}]);
      const combinationsResponse = ref([{}]);
      const synonymResponse = ref([{}]);
      const synonyms = ref([{}]);
      const combinationsResponseSynonyms = ref([{}]);
      const sortedSynonyms = ref([{}]);
      const filteredSynonyms = ref([{}]);
      const newVal = ref([]);
      const synonymUnsorted = ref([]);
      
      const finalArray = computed(() => {
        return [...synonymTags.value, ...sortedSynonyms.value]
      });

      return {
        taxonPageApiResults,
        taxonViewed,
        relationshipsResponse,
        combinationsResponse,
        synonyms,
        combinationsResponseSynonyms,
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
        taxonNamesWithOtusData,
        synonymResponse,
        taxonNameIDForOTULoop,
        otusRetrieved
      };
    },
    
    components: {
      BiologicalAssociations,
      NomenclaturalReferences,
      TaxonDistribution
    },
    
    data(){
      return {
        showSynonyms: true,
        otuIDS: ref(otuIDChain),
        nomenclaturalReferencesResults: ref(this.synonymUnsorted.sources)
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
      
      resultsExist() {
        return this.$route.query.taxonID !== undefined && this.$route.query.taxonID !== null;
      },
      
      biologicalAssociationsResultsExist() {
        return this.$route.query.taxonID !== undefined && this.$route.query.taxonID !== null;
      }
    },
    
    async mounted() {
      otuIDChain = ''
      const taxonID = this.$route.query.taxonID;
      const promises = [];
      if(taxonID){
        console.log('taxonID is: ' + taxonID)
        const response = await axios.get(`https://sfg.taxonworks.org/api/v1/taxon_names?taxon_name_id[]=${taxonID}&validity=true&per=250&exact=true&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ`);
        const combinationsResponse = await axios.get(`https://sfg.taxonworks.org/api/v1/taxon_names?combination_taxon_name_id[]=${taxonID}&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ`);
        const relationshipsResponse = await axios.get(`https://sfg.taxonworks.org/api/v1/taxon_name_relationships?object_taxon_name_id=${taxonID}&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ`);
        
        this.taxonViewed = await response.data
        this.synonyms = await relationshipsResponse.data
        this.combinationsResponseSynonyms = await combinationsResponse.data

        this.synonyms = this.synonyms.filter(x => x.inverse_assignment_method === "iczn_subjective_synonym" || x.inverse_assignment_method === "iczn_misspelling" || x.inverse_assignment_method === "original_species" || x.inverse_assignment_method === "iczn_synonym" || x.inverse_assignment_method === "iczn_invalid");
        
        taxonIDChain.value = []
        for (const taxonName of this.synonyms) {
          if (taxonIDChain.value.length === 0){
            console.log("it was blank in this step")
            taxonIDChain.value = taxonIDChain.value + "?taxon_name_id[]=" + taxonName.subject_taxon_name_id.toString()
          }
          else {
            taxonIDChain.value = taxonIDChain.value + "&taxon_name_id[]=" + taxonName.subject_taxon_name_id.toString()
          }
        }
        console.log('taxonIDChain from relationshipResponse is: ' + taxonIDChain.value);
        
        for (const taxonName of this.combinationsResponseSynonyms){
          taxonIDChain.value = taxonIDChain.value + "&taxon_name_id[]=" + taxonName.id.toString()
        }
        
        console.log('taxonIDChain after combinationResponse is: ' + taxonIDChain.value);
        
        const taxonNamesWithOtus = await axios.get(`https://sfg.taxonworks.org/api/v1/taxon_names/${taxonIDChain.value}&extend[]=otus&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ`)
        this.taxonNamesWithOtusData = await taxonNamesWithOtus.data

        const synonymIDArray = this.synonyms.map(obj => obj.subject_taxon_name_id);
        console.log("synonymIDArray is: " + synonymIDArray)
        const originalCombinationHTML = await axios.get(`https://sfg.taxonworks.org/api/v1/taxon_names/${taxonID}?extend[]=otus&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ`);
        
        this.synonymItem = await originalCombinationHTML.data;
        this.synonymHtml = this.synonymItem.original_combination.toString();
        
        for (const taxonName of this.taxonNamesWithOtusData) {
          taxonNameIDForOTULoop = taxonName.id.toString()
          const findOTUResponse = await axios.get(`https://sfg.taxonworks.org/api/v1/taxon_names/${taxonNameIDForOTULoop}?extend[]=otus&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ`);
          otusRetrieved = await findOTUResponse.data
          console.log("the taxonID for this otu loop iteration is: " + otusRetrieved.id)
          for (const otu of otusRetrieved.otus)
          {
            otuIDChain = otuIDChain + "&otu_id[]=" + otu.id.toString()
            console.log("this otu.id is: " + otu.id.toString())
          }
        }
        if(otuIDChain){
          otuIDChain = otuIDChain.substring(1)
        }
        console.log('otuIDChain is: ' + otuIDChain);
        this.otuIDS = otuIDChain

        const synonymResponse = await axios.get(`https://sfg.taxonworks.org/api/v1/taxon_names/${taxonID}/inventory/catalog?token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ`);

        this.synonymUnsorted = await synonymResponse.data
        this.nomenclaturalReferencesResults = await this.synonymUnsorted.sources
        synonymHtml = await this.synonymItem.original_combination.toString();
      }
    }
  }
</script>