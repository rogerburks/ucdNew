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
    <taxon-distribution :baProp="otuIDS"></taxon-distribution>
  </template>
  
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
  var otuIDChain = ('');
  var nomenclaturalReferencesResults = ref([]);
  var taxonIDChain = ('');
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
      const synonymResponse = ref([{}]);
      const synonyms = ref([{}]);
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
      
      synonymSorting: {
        get() {
          return this.synonymUnsorted.value
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
      },
      
      //need to fix this to check for bio associations
      biologicalAssociationsResultsExist() {
        return this.$route.query.taxonID !== undefined && this.$route.query.taxonID !== null;
      }
    },
    
    async mounted() {
      otuIDChain = ''
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
        
        this.synonymItem = await originalCombinationHTML.data;
        this.synonymHtml = this.synonymItem.original_combination.toString();
        
        //This for...of loop concatenates OTU (Operational Taxonomic Unit) IDs and proper syntax to make queries using a chain otu_id[] parameters. 
        //This is being done to request information that is more convenient to access through OTUs instead of through taxon names.
        //It should gather the otus for each taxon name.
        for (const taxonName of this.taxonNamesWithOtusData) {
          //console.log("otuID is: " + otuID.toString())
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
        
        //synonymTags.value.push(this.synonymHtml);

        const synonymResponse = await axios.get(`https://sfg.taxonworks.org/api/v1/taxon_names/${taxonID}/inventory/catalog?token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ`);
        //console.log("synonymResponseZero id = " + synonymResponse.data[0].id)

        this.synonymUnsorted = await synonymResponse.data
        this.nomenclaturalReferencesResults = await this.synonymUnsorted.sources
        synonymHtml = await this.synonymItem.original_combination.toString();
        
        this.sortedSynonyms = []
        
        //for (const taxonName in this.synonymUnsorted){
        //  if(this.synonymUnsorted[taxonName].cached_original_combination_html != null && this.synonymUnsorted[taxonName].cached_author_year != null){
            //console.log("taxonName cached_original_combination_html is: " + this.synonymUnsorted[taxonName].cached_original_combination_html)
        //    this.sortedSynonyms.push(this.synonymUnsorted[taxonName].cached_original_combination_html.toString() + " " + this.synonymUnsorted[taxonName].cached_author_year.toString())
        //  }
        //}
        
        //for (const string in this.sortedSynonyms){
        //  console.log("the taxon string is: " + this.sortedSynonyms[string])
        //}

        //synonymSorted = this.sortedSynonyms.sort((a, b) => {
        //  const yearA = a.match(/(\d{4})/);
        //  const yearB = b.match(/(\d{4})/);
        //  if (yearA && yearB) {
        //    return parseInt(yearA[1]) - parseInt(yearB[1]);
        //  }
        //  return a.localeCompare(b);
        //});
      }
    }
  }
</script>