<template v-slot:taxonPage>
  <div>
    <span 
      v-for="(breadcrumb, index) in reversedBreadcrumbs"
        :key="breadcrumb.id"
        :class="{ italicizeBreadcrumb: breadcrumb.rank_string === 'NomenclaturalRank::Iczn::GenusGroup::Genus' || breadcrumb.rank_string === 'NomenclaturalRank::Iczn::SpeciesGroup::Species' || breadcrumb.rank_string === 'NomenclaturalRank::Icn::GenusGroup::Genus' || breadcrumb.rank_string === 'NomenclaturalRank::Icn::SpeciesAndInfraspeciesGroup::Species' }">
        <router-link :to="{ name: 'TaxonPage', query: { taxonID: breadcrumb.id }}" v-if="breadcrumb.rank_string === 'NomenclaturalRank::Iczn::GenusGroup::Genus' || breadcrumb.rank_string === 'NomenclaturalRank::Iczn::SpeciesGroup::Species' || breadcrumb.rank_string === 'NomenclaturalRank::Iczn::FamilyGroup::Family' || breadcrumb.rank_string === 'NomenclaturalRank::Iczn::FamilyGroup::Subfamily' || breadcrumb.rank_string === 'NomenclaturalRank::Iczn::FamilyGroup::Tribe' || breadcrumb.rank_string === 'NomenclaturalRank::Iczn::FamilyGroup::Subtribe' || breadcrumb.rank_string === 'NomenclaturalRank::Icn::SpeciesAndInfraspeciesGroup::Species' || breadcrumb.rank_string === 'NomenclaturalRank::Icn::GenusGroup::Genus'">
          {{ breadcrumb.name }}
        </router-link>
        <span v-else>
          {{ breadcrumb.name }}
        </span>
      <span v-if="index < reversedBreadcrumbs.length - 1"> > </span>
    </span>
  </div>
  <div class="row">
    <div class="col-12">
      <h3 v-if="italicized && taxonViewed[0]"><i>{{ taxonViewed[0].cached }}</i> {{ taxonViewed[0].cached_author_year }}</h3>
      <h3 v-else-if="taxonViewed[0]">{{ taxonViewed[0].cached }} {{ taxonViewed[0].cached_author_year }}</h3>
    </div>
  </div>
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
              <ul v-if="synonymCatalog" id="results-list-span">
                <li style="list-style-type:none" v-for="tag in synonymCatalog.timeline" :key="tag" v-html="tag.label"></li>
              </ul>
              <div class="typeInfo" v-show="rankString==='NomenclaturalRank::Iczn::SpeciesGroup::Species' && concatenatedTypeInfo != 'Type information: '">{{ concatenatedTypeInfo }}</div>
              <div class="typeInfo" v-show="rankString==='NomenclaturalRank::Iczn::GenusGroup::Genus' || rankString==='NomenclaturalRank::Iczn::GenusGroup::Subgenus'">Type species: <router-link :to="{ name: 'TaxonPage', query: { taxonID: typeID }}" v-if="typeID"> <span v-html="concatenatedTypeInfo"></span></router-link></div>
              <div class="typeInfo" v-show="rankString==='NomenclaturalRank::Iczn::FamilyGroup::Family' || rankString==='NomenclaturalRank::Iczn::FamilyGroup::Subfamily' || rankString==='NomenclaturalRank::Iczn::FamilyGroup::Tribe' || rankString==='NomenclaturalRank::Iczn::FamilyGroup::Subtribe'">Type genus: <router-link :to="{ name: 'TaxonPage', query: { taxonID: typeID }}" v-if="typeID"> <span v-html="concatenatedTypeInfo"></span></router-link></div>
            </div>
            <div id="showIfNoQuery" v-else>
              No search has been made
            </div>
          </div>
        </div>
    </div>
    <references v-if="nomenclaturalReferencesResults" :nr-Prop="nomenclaturalReferencesResults"></references>
    <div v-if="isTaxonIDChainPopulated"><biological-associations :ba-Prop="taxonIDChain"></biological-associations></div>
      <div v-else><img src="/spinning-circles.svg" alt="Loading..." width="75"></div>
    </div>
    <div class="col-md-4" id="movingDiv" v-if="taxonViewed[0] && (taxonViewed[0].rank_string === 'NomenclaturalRank::Iczn::GenusGroup::Genus' || taxonViewed[0].rank_string === 'NomenclaturalRank::Iczn::SpeciesGroup::Species')">
      <div v-if="isTaxonIDChainPopulated"><taxon-distribution v-if="isTaxonIDChainPopulated" :ba-Prop="taxonIDChain"></taxon-distribution></div>
      <div v-else><img src="/spinning-circles.svg" alt="Loading..." width="75"></div>
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 1537px) {
  #stationaryDiv {
    flex: 0 0 64%;
    max-width: 64%;
    padding-left: 0;
    padding-right: 0;
  }

  #movingDiv {
    flex: 0 0 33.33333%;
    max-width: 33.33333%;
    padding-left: 0;
    padding-right: 0;
  }
}

@media (max-width: 1536px) {
  #movingDiv {
    flex: max-content;
    max-width: 100%;
  }
}

.italicizeBreadcrumb {
  font-style: italic;
}

.typeInfo {
  margin-left: calc(var(--bs-gutter-x));
}
</style>
  
<script>
  import { reactive, ref, computed } from 'vue'
  import api from '/api.js'
  import BiologicalAssociations from './BiologicalAssociations.vue'
  import References from "./References.vue"
  import TaxonDistribution from "./TaxonDistribution.vue"
  import { useRoute } from 'vue-router';
  import { toRefs } from '@vue/reactivity';
  
  export default {
    name: 'TaxonPage',
    
    components: {
      BiologicalAssociations,
      References,
      TaxonDistribution
    },
    
    setup() {
      const state = reactive({
        showSynonyms: true
      })
      
      const route = useRoute();
      const taxonID = route.query.taxonID;
      const typeID = ref('');
      const rankString = ref('');
      const taxonViewed = ref([]);
      const concatenatedTypeInfo = ref('');
      const synonymCatalog = ref([]);
      const reversedBreadcrumbs = ref([]);
      const taxonIDChain = ref([]);
      const isTaxonIDChainPopulated = ref(false);
      
      const getTaxon = async (taxonIDNumber) => {
        const response = await api.get(`/taxon_names`,
            {params: {
              taxon_name_id: taxonIDNumber,
              token: import.meta.env.VITE_APP_API_TOKEN,
              project_token: import.meta.env.VITE_APP_PROJECT_TOKEN
        }})
        if(taxonViewed.value.length === 0) {
          taxonViewed.value = response.data
          rankString.value = taxonViewed.value[0].rank_string;
          
          const combinedTaxonPromise = Promise.all ([
              api.get(`/taxon_names`,
                {params: {
                  combination_taxon_name_id: [taxonIDNumber],
                  token: import.meta.env.VITE_APP_API_TOKEN,
                  project_token: import.meta.env.VITE_APP_PROJECT_TOKEN
              }}),
              api.get(`/taxon_name_relationships`,
                {params: {
                  object_taxon_name_id: taxonIDNumber,
                  token: import.meta.env.VITE_APP_API_TOKEN,
                  project_token: import.meta.env.VITE_APP_PROJECT_TOKEN
              }}),
              api.get(`/taxon_names/${taxonID}`,
                {params: {
                  extend: ['ancestor_ids'],
                  token: import.meta.env.VITE_APP_API_TOKEN,
                  project_token: import.meta.env.VITE_APP_PROJECT_TOKEN
              }})
            ]);
            const [combinationsResponse, relationshipsResponse, breadcrumbs] = await combinedTaxonPromise;
            const combinationsResponseSynonyms = combinationsResponse.data;
            const synonyms = relationshipsResponse.data;
            const breadcrumbsData = breadcrumbs.data;
            makeSynonyms(synonyms, combinationsResponseSynonyms);
            breadcrumbsNamer(breadcrumbsData);
            typeInfo();
        }
        else{
          return await response.data;
        }
      };
      getTaxon(taxonID);
      
      const makeSynonyms = async (synonyms, combinationsResponseSynonyms) => {                  
        for (const taxonName of synonyms) {
          taxonIDChain.value.push(taxonName.subject_taxon_name_id.toString());
        };
          
        if(combinationsResponseSynonyms[0]){
          for (const taxonName of combinationsResponseSynonyms){
            taxonIDChain.value.push(taxonName.id.toString());
          }
        };
        
        if(taxonIDChain.length === 0){
          taxonIDChain.value.push(taxonID);
        };

        if(taxonIDChain.value.length > 0){
          isTaxonIDChainPopulated.value = !isTaxonIDChainPopulated.value; 
          synonyms = synonyms.filter(x => x.inverse_assignment_method === "iczn_subjective_synonym" || x.inverse_assignment_method === "iczn_misspelling" || x.inverse_assignment_method === "original_species" || x.inverse_assignment_method === "iczn_synonym" || x.inverse_assignment_method === "iczn_invalid");

          const originalCombinationHTML = api.get(`/taxon_names/${taxonID}`,
            {params: {
              extend: ['otus'],
              token: import.meta.env.VITE_APP_API_TOKEN,
              project_token: import.meta.env.VITE_APP_PROJECT_TOKEN
          }});
          
          const synonymItem = originalCombinationHTML.data;

          const synonymResponse = await api.get(`/taxon_names/${taxonID}/inventory/catalog`,
            {params: {
              token: import.meta.env.VITE_APP_API_TOKEN,
              project_token: import.meta.env.VITE_APP_PROJECT_TOKEN
          }});

          synonymCatalog.value = synonymResponse.data
          
          if(synonymItem) {
            synonymHtml = synonymItem.original_combination.toString();
          };
        };
      };
            
      const nomenclaturalReferencesResults = computed(() => synonymCatalog.value.sources);
      
      const italicized = computed(() => {
        if(taxonViewed.value && taxonViewed.value[0]) {
          return ['NomenclaturalRank::Iczn::GenusGroup::Genus', 'NomenclaturalRank::Iczn::SpeciesGroup::Species', 'NomenclaturalRank::Icn::GenusGroup::Genus', 'NomenclaturalRank::Icn::SpeciesAndInfraspeciesGroup::Species'].includes(taxonViewed.value[0].rank_string);
        };
        return false;
      });
      
      const breadcrumbsNamer = async (breadcrumbsData) => {
        const breadcrumbsIDs = [];
        for (const crumb in breadcrumbsData.ancestor_ids) {
            breadcrumbsIDs.push(breadcrumbsData.ancestor_ids[crumb][0])
        };
        const ancestorIDs = breadcrumbsIDs.filter(id => id !== undefined);
        const promises = ancestorIDs.map(id => api.get(`/taxon_names/${id}`,
          {params: {
            token: import.meta.env.VITE_APP_API_TOKEN,
            project_token: import.meta.env.VITE_APP_PROJECT_TOKEN
        }}));
        const breadcrumbsResponse = await Promise.all(promises);
        const breadcrumbsNamerData = breadcrumbsResponse.map(breadcrumbsResponse => breadcrumbsResponse.data);
        reversedBreadcrumbs.value = [...breadcrumbsNamerData].reverse().slice(1);
      };
      
      const typeInfo = async () => {
        if(rankString.value === "NomenclaturalRank::Iczn::SpeciesGroup::Species"){
          const response = await api.get(`/data_attributes`,
            {params: {
              attribute_subject_id: taxonID,
              token: import.meta.env.VITE_APP_API_TOKEN,
              project_token: import.meta.env.VITE_APP_PROJECT_TOKEN
          }});
          const dataAttributesResults = response.data;
          
          const extractedValues = dataAttributesResults
            .filter(item => ['Species:PrimType', 'Species:TypeSex', 'Coll:Depository'].includes(item.predicate_name))
            .map(item => item.value === 'LT' ? 'Lectotype' : item.value === 'HT' ? 'Holotype' : item.value === 'ST' ? 'Syntypes' : item.value === 'NT' ? 'Neotype' : item.value === 'F' ? 'Female' : item.value === 'M' ? 'Male' : item.value, controlled_vocabulary_term_id => controlled_vocabulary_term_id);
          concatenatedTypeInfo.value = "Type information: " + extractedValues.join(", ");
        }
        else if(rankString.value === "NomenclaturalRank::Iczn::GenusGroup::Genus" || rankString.value === "NomenclaturalRank::Iczn::GenusGroup::Subgenus"){
          const response = await api.get(`/taxon_name_relationships`,
            {params: {
              object_taxon_name_id: taxonID,
              token: import.meta.env.VITE_APP_API_TOKEN,
              project_token: import.meta.env.VITE_APP_PROJECT_TOKEN
          }});
          const dataAttributesResults = response.data;
          
          const extractedValues = dataAttributesResults
            .find(item => item.assignment_method.includes('type_of_genus'));
          if (extractedValues) {
            const subjectTaxonNameId = extractedValues.subject_taxon_name_id.toString();
            const typeSpecies = await getTaxon(subjectTaxonNameId);
            typeID.value = typeSpecies[0].id;
            concatenatedTypeInfo.value = typeSpecies[0].cached_original_combination_html + " " + typeSpecies[0].cached_author_year;
          };
        }
        else if(rankString.value === "NomenclaturalRank::Iczn::FamilyGroup::Family" || rankString.value === "NomenclaturalRank::Iczn::FamilyGroup::Subfamily" || rankString.value === "NomenclaturalRank::Iczn::FamilyGroup::Tribe" || rankString.value === "NomenclaturalRank::Iczn::FamilyGroup::Subtribe"){
          const response = await api.get(`/taxon_name_relationships`,
            {params: {
              object_taxon_name_id: taxonID,
              token: import.meta.env.VITE_APP_API_TOKEN,
              project_token: import.meta.env.VITE_APP_PROJECT_TOKEN
          }});
          const dataAttributesResults = response.data;
          
          const extractedValues = dataAttributesResults
            .find(item => item.assignment_method.includes('type_of_family'));
          if (extractedValues) {
            const subjectTaxonNameId = extractedValues.subject_taxon_name_id.toString();
            const typeGenus = await getTaxon(subjectTaxonNameId);
            typeID.value = typeGenus[0].id;
            concatenatedTypeInfo.value = typeGenus[0].cached_original_combination_html + " " + typeGenus[0].cached_author_year;;
          };
        }
      };
      
      const resultsExist = computed(() => taxonID !== undefined && taxonID !== null);
        
      return {
        ...toRefs(state),
        nomenclaturalReferencesResults, 
        italicized, 
        resultsExist,
        breadcrumbsNamer,
        route,
        taxonID,
        makeSynonyms,
        getTaxon,
        typeID,
        rankString,
        taxonViewed,
        concatenatedTypeInfo,
        synonymCatalog,
        reversedBreadcrumbs,
        taxonIDChain,
        isTaxonIDChainPopulated
      };
    }
  }
</script>