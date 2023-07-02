<template v-slot:taxonPage>
  <div class="row">
    <div class="col-12">
      <h3 v-if="italicized && taxonViewed"><i>{{ taxonViewed[0].cached }}</i> {{ taxonViewed[0].cached_author_year }}</h3>
      <h3 v-else-if="taxonViewed">{{ taxonViewed[0].cached }} {{ taxonViewed[0].cached_author_year }}</h3>
    </div>
  </div>
  <br>
  <div class="row">
    <div class="col-md-8" id="stationaryDiv">
      <div ref="containerOfSynonyms" name="taxonPageSynonymsContainer">
        <div class="col-12 bd-highlight align-items-start" id="results-list-div" ref="resultsList">
          <button class="btn btn-link" type="button" @click="showSynonyms = !showSynonyms" aria-expanded="false">
            <font-awesome-icon :icon="showSynonyms ? 'angle-down' : 'angle-right'" />
            <span v-if="!showSynonyms"> Show taxonomic history</span>
            <span v-else> Taxonomic history</span>
          </button>
          <div id="collapseSynonyms" v-show="showSynonyms">
            <div id="showIfQuery" v-if="resultsExist">
              <ul v-if="synonymUnsorted" id="results-list-span">
                <li style="list-style-type:none" v-for="tag in synonymUnsorted.timeline" :key="tag" v-html="tag.label"></li>
              </ul>
            </div>
            <div id="showIfNoQuery" v-else>
              No search has been made
            </div>
          </div>
        </div>
      </div>
      <nomenclaturalReferences v-if="nomenclaturalReferencesResults" :nrProp="nomenclaturalReferencesResults"></nomenclaturalReferences>
      <biological-associations :baProp="otuIDChain"></biological-associations>
    </div>
    <div class="col-md-4" id="movingDiv">
      <taxon-distribution :baProp="otuIDChain"></taxon-distribution>
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
  #movingDiv {
    flex: max-content;
    max-width: 100%;
  }
}
</style>
  
<script>
  import { onMounted, ref, reactive, computed } from 'vue'
  import api from '/api.js'
  import BiologicalAssociations from './BiologicalAssociations.vue'
  import NomenclaturalReferences from "./NomenclaturalReferences.vue"
  import TaxonDistribution from "./TaxonDistribution.vue"
  import { useRoute } from 'vue-router';
  import { toRefs } from '@vue/reactivity';
  
  export default {
    name: 'TaxonPage',
    
    components: {
      BiologicalAssociations,
      NomenclaturalReferences,
      TaxonDistribution
    },
    
    setup() {
      const state = reactive({
        taxonPageApiResults: [],
        synonymResponse: [],
        synonyms: [],
        combinationsResponseSynonyms: [],
        sortedSynonyms: [],
        filteredSynonyms: [],
        newVal: [],
        synonymItem: "",
        synonymHtml: "",
        synonymTags: [],
        synonymFinal: [],
        synonymSorted: [],
        nomenclaturalReferencesResults: [],
        taxonIDChain: '',
        taxonNamesWithOtusData: [],
        taxonNameIDForOTULoop: '',
        otusRetrieved: [],
        showSynonyms: true,
        otuIDChain: '',
        taxonViewed: '',
        synonymUnsorted: [],
      })
      
      onMounted(async () => {
        const taxonID = route.query.taxonID;
        if(taxonID){
          console.log('taxonID is: ' + taxonID)
          const response = await api.get(`/taxon_names`,
            {params: {
              taxon_name_id: [taxonID],
              validity: 'true',
              exact: 'true',
              token: import.meta.env.VITE_APP_API_TOKEN,
              project_token: import.meta.env.VITE_APP_PROJECT_TOKEN
          }});
          const combinationsResponse = await api.get(`/taxon_names`,
            {params: {
              combination_taxon_name_id: [taxonID],
              token: import.meta.env.VITE_APP_API_TOKEN,
              project_token: import.meta.env.VITE_APP_PROJECT_TOKEN
          }});
          const relationshipsResponse = await api.get(`/taxon_name_relationships`,
            {params: {
              object_taxon_name_id: taxonID,
              token: import.meta.env.VITE_APP_API_TOKEN,
              project_token: import.meta.env.VITE_APP_PROJECT_TOKEN
          }});
          
          state.taxonViewed = response.data
          state.synonyms = relationshipsResponse.data
          state.combinationsResponseSynonyms = combinationsResponse.data

          state.synonyms = state.synonyms.filter(x => x.inverse_assignment_method === "iczn_subjective_synonym" || x.inverse_assignment_method === "iczn_misspelling" || x.inverse_assignment_method === "original_species" || x.inverse_assignment_method === "iczn_synonym" || x.inverse_assignment_method === "iczn_invalid");
          
          state.taxonIDChain = []
          for (const taxonName of state.synonyms) {
            state.taxonIDChain.push(taxonName.subject_taxon_name_id.toString());
          };
          console.log('taxonIDChain from relationshipResponse is: ' + state.taxonIDChain);
          
          for (const taxonName of state.combinationsResponseSynonyms){
            state.taxonIDChain.push(taxonName.id.toString());
          }
          
          console.log('taxonIDChain after combinationResponse is: ' + state.taxonIDChain);
          
          const taxonNamesWithOtus = await api.get(`/taxon_names`,
          {params: {
            taxon_name_id: state.taxonIDChain,
            extend: ['otus'],
            token: import.meta.env.VITE_APP_API_TOKEN,
            project_token: import.meta.env.VITE_APP_PROJECT_TOKEN
          }});
          
          state.taxonNamesWithOtusData = taxonNamesWithOtus.data

          const synonymIDArray = state.synonyms.map(obj => obj.subject_taxon_name_id);
          console.log("synonymIDArray is: " + synonymIDArray)
          const originalCombinationHTML = api.get(`/taxon_names/${taxonID}`,
            {params: {
              extend: ['otus'],
              token: import.meta.env.VITE_APP_API_TOKEN,
              project_token: import.meta.env.VITE_APP_PROJECT_TOKEN
          }});
          
          state.synonymItem = originalCombinationHTML.data;
          if(state.synonymItem){
            state.synonymHtml = synonymItem.original_combination.toString();
          };
          
          for (const taxonName of state.taxonNamesWithOtusData) {
            state.taxonNameIDForOTULoop = taxonName.id.toString();
            const findOTUResponse = await api.get(`/taxon_names/${state.taxonNameIDForOTULoop}`,
              {params: {
                extend: ['otus'],
                token: import.meta.env.VITE_APP_API_TOKEN,
                project_token: import.meta.env.VITE_APP_PROJECT_TOKEN
            }});
            state.otusRetrieved = findOTUResponse.data;
            if(state.otusRetrieved) {
              console.log("the taxonID for this otu loop iteration is: " + state.otusRetrieved.id);
              for (const otu of state.otusRetrieved.otus) {
                state.otuIDChain += "&otu_id[]=" + otu.id.toString();
                console.log("this otu.id is: " + otu.id.toString());
              }
            }
          }
          if(state.otuIDChain){
            state.otuIDChain = state.otuIDChain.substring(1);
          };
          
          console.log('otuIDChain is: ' + state.otuIDChain);
          
          state.otuIDS = state.otuIDChain;

          const synonymResponse = await api.get(`/taxon_names/${taxonID}/inventory/catalog`,
            {params: {
              token: import.meta.env.VITE_APP_API_TOKEN,
              project_token: import.meta.env.VITE_APP_PROJECT_TOKEN
          }});

          state.synonymUnsorted = synonymResponse.data
          state.nomenclaturalReferencesResults = state.synonymUnsorted.sources
          
          if(state.synonymItem) {
            state.synonymHtml = synonymItem.original_combination.toString();
          };
        };
      });
      
      const otuIDS = computed(() => {
        if(state.otuIDChain) {
          return state.otuIDChain.split("&otu_id[]=")
        };
      });
      
      const nomenclaturalReferencesResults = computed(() => state.synonymUnsorted.sources);
      
      const italicized = computed(() => {
        if(state.taxonViewed && state.taxonViewed[0]) {
          return ['NomenclaturalRank::Iczn::GenusGroup::Genus', 'NomenclaturalRank::Iczn::SpeciesGroup::Species'].includes(state.taxonViewed[0].rank_string);
        };
        return false;
      });
      
      const route = useRoute();
      
      const resultsExist = computed(() => route.query.taxonID !== undefined && route.query.taxonID !== null);
      
      return {
        ...toRefs(state),
        otuIDS, 
        nomenclaturalReferencesResults, 
        italicized, 
        resultsExist 
      };
    }
  };
</script>