<!-- This component handles searches and displays search results -->
<!-- Stop italicizing family-group names in returned results  -->
<!-- Add new box for searching higher taxa, instead of making people use the genus box  -->
<!-- I have decided for the moment to include search results with the component. This may change later if I want to have a catch-all search results component for all searching components -->
<template v-slot:search>
  <div class="row" ref="containerOfComponent" v-show="show" name="binomialSearchContainer">
    <fieldset>
      <legend>Search Mode</legend>
      <div>
        <input type="radio" id="regular-search" value="regular" v-model="searchMode">
        <label style="padding-left: 2px; padding-right: 15px;" for="regular-search">Regular search</label>
        <input type="radio" id="autocomplete-search" value="autocomplete" v-model="searchMode">
        <label style="padding-left: 2px;" for="autocomplete-search">Autocomplete (wait for results to appear under search field)</label>
      </div>
    </fieldset>
    <div v-if="searchMode === 'regular'" class="col-12" ref="containerOfInputGroup">
      <div class="input-group mb-3 align-items-start" id="binomial-search-group">
        <span class="input-group-text" id="genus-input-label">genus</span>
        <input type="text" class="form-control" aria-describedby="genus-input" v-model="genus" @keyup.enter="useInputTerms($event)">
        <span class="input-group-text" id="species-input-label">species</span>
        <input type="text" class="form-control" aria-describedby="species-input" v-model="species" @keyup.enter="useInputTerms($event)">
        <button class="btn btn-outline-secondary" type="button" id="binomial-search-button" @click="useInputTerms($event)">search</button>
      </div>
    </div>
    <div v-if="searchMode === 'autocomplete'" class="col-12" ref="containerOfInputGroup">
      <div>
        <v-autocomplete v-model="searchTerm" :items="autocompleteResults" @input="fetchAutocompleteResults" @select="handleSelection">
          <template #item="{ item }">
            <a click="handleSelection(item)">{{ item }}</a>
          </template>
        </v-autocomplete>
      </div>
        
    </div>
  </div>
  <br>
  <div class="row" ref="containerOfResults" name="binomialSearchResultsContainer">
    <div class="col-12 bd-highlight align-items-start" id="results-list-div" ref="resultsList">
      <span id="results-list-span"><br>
      <li style="list-style-type:none" v-for="(item, index) in apiResults" :key="item.id"><a style="text-decoration:underline; color: var(--bs-link-color);" @click="displayTaxonPage(apiResults[index]), show=!show"><i>{{ apiResults[index].cached }}</i> {{ apiResults[index].cached_author_year }}</a></li>
      </span>
    </div>
    <div class="col-xs-12 bd-highlight" id="taxon-page-div" ref="taxonPage">
      <div>
        <span id="taxon-page-italicized-name" style="font-size:large; font-style: italic; font-weight: 600;" ref="taxonPageNameItalicized"><strong></strong> </span>
        <span id="taxon-page-author-year" style="font-size:large; font-style: normal; font-weight: 600;" ref="taxonPageNameAuthorYear"></span>
      </div>
    </div>
  </div>
</template>

<script>
  import axios, { all, spread} from 'axios'
  import { computed, ref, reactive } from '@vue/runtime-core'

  export default {
    setup() {
      return {
        genus: ref(''),
        species: ref(''),
        apiResults: ref([{}]),
        listClickedText: ref(''),
        taxonClicked: ref([{}]),
        taxonIDClicked: ref(''),
        sortedResponse: ref([{}])
      }
    },
    
    data() {
      return {
        show: true,
        searchMode: "regular",
        searchTerm: '',
        autocompleteResults: []
      }
    },
    
    methods: {
      async useInputTerms(e) {
        if(this.searchMode === "regular") {
          if(this.genus && this.species){
            this.genus = this.genus.replace(/^./, this.genus[0].toUpperCase());
            this.species = this.species.replace(/./, this.species[0].toLowerCase());
            const response = await axios.get(`https://sfg.taxonworks.org/api/v1/taxon_names?name=${this.genus}%20${this.species}&rank=NomenclaturalRank::Iczn::SpeciesGroup::Species&validity=true&per=250&exact=true&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ`)
            this.apiResults = response.data
          }
          else if(this.genus && this.species===''){
            this.genus = this.genus.replace(/^./, this.genus[0].toUpperCase());
            this.apiResults = axios
            const response = await all([
              axios.get(`https://sfg.taxonworks.org/api/v1/taxon_names?name=${this.genus}&rank=NomenclaturalRank::Iczn::GenusGroup::Genus&validity=true&per=250&nomenclature_code[]=ICZN&nomenclature_group[]=Genus&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ`),
              axios.get(`https://sfg.taxonworks.org/api/v1/taxon_names?name=${this.genus}&rank=NomenclaturalRank::Iczn::SpeciesGroup::Species&validity=true&per=250&nomenclature_code[]=ICZN&nomenclature_group[]=Genus&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ`)
            ]);
            const [genusResponse, speciesResponse] = response;
            this.apiResults = genusResponse.data.concat(speciesResponse.data);
            this.sortResponse()
          }
          else if(this.species){
            this.species = this.species.replace(/^./, this.species[0].toLowerCase());
            this.genus = " ";
            this.apiResults = axios
            const response = await axios.get(`https://sfg.taxonworks.org/api/v1/taxon_names?name=${this.species}&rank=NomenclaturalRank::Iczn::SpeciesGroup::Species&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ`)
            response => {
              this.apiResults = response.data
              this.sortResponse()
            }
          }
        }
        else if(this.searchMode === "autocomplete") {

        }
        this.$refs['taxonPageNameItalicized'].textContent = ''
        this.$refs['taxonPageNameAuthorYear'].textContent = ''
      },
      
      displayTaxonPage(taxonClicked, show) {
        this.taxonClicked = taxonClicked
        this.$router.push({ name: 'TaxonPage', query: { taxonID: taxonClicked.id }});
        show = !show
      },
      
      sortResponse() {
        this.sortedResponse = this.apiResults.sort((a, b) =>{
          if (a.cached < b.cached) return -1
          if (a.cached > b.cached) return 1
          return 0
        })
      },
      
      async fetchAutocompleteResults () {
        this.apiResults = axios
        const response = await axios.get(`https://sfg.taxonworks.org/api/v1/otus/autocomplete?token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ&having_taxon_name_only=true&term=${item}`)
        this.autocompleteResults = response.data
      },
      handleSelection(item) {
        this.displayTaxonPage(item, show)
      }
    }
  }
</script>