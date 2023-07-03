<template  v-slot:distributionSearch>     
  <ul v-if="nothingClicked">
    <li v-for="country in countryData" :key="country.id">
      <button v-show="country.regions" @click="toggleCountry(country.id)" id="treeButton">
        <span v-if="openCountries[country.id]">-</span>
        <span v-else>+</span>
      </button>
      <a v-if="country.regions" id="countryWithRegions" :to="{ name: 'SearchResults', state: { dsList } }">
        {{ country.name }}
      </a>
      <a v-else id="countryWithoutRegions" :to="{ name: 'SearchResults', state: { dsList } }">
        {{ country.name }}
      </a>
      <ul v-if="openCountries[country.id]">
        <li @click="fetchDistributions(region.id, region.name), nothingClicked = !nothingClicked" v-for="region in country.regions" :key="region.id" >
          <a style="text-decoration:underline; color: var(--bs-link-color);"  id="itemRegion">
            {{ region.name }}
          </a>
        </li>
      </ul>
    </li>
  </ul>
  <ul v-else>
    <li><b><a style="text-decoration:underline; color: var(--bs-link-color);" @click="nothingClicked = !nothingClicked">Return to country list</a></b></li>
    <li><b>Chalcidoid taxa present in: {{ headerName }} </b></li>
    <li v-for="(item, index) in dsList" :key="index">
      <span v-for="char, subIndex in splitText(item.otu.taxon_name)" :key="subIndex" :style="{fontStyle: char.shouldItalicize ? 'italic' : 'normal'}">
        <a style="text-decoration:underline; color: var(--bs-link-color);" @click="displayTaxonPage(item.otu.taxon_name_id)">
          {{ char.formatted }}
        </a>
      </span>
    </li>
  </ul>
</template>
  
<style scoped>
  ul {
    list-style-type: none;
  }

  ul ul {
    padding-left: 20px;
  }
  
  #treeButton {
    background-color: #ffffff;
    width: 19px;
    height: 19px;
    line-height: 5px;
    text-align: center;
    border: 1px solid black;
    font-size: small;
  }
  
  #treeButton:hover {
    background-color: rgb(134, 134, 134);
  }
  
  #countryWithRegions {
    padding-left: 5px;
  }
  
  #countryWithoutRegions {
    padding-left: 24px;
  }
  
  #itemRegion {
    padding-left: 20px;
  }
</style>
  
<script>
  import { onMounted, reactive, toRefs, ref } from 'vue';
  import api from '/api.js'
  import { useRouter } from 'vue-router'
  
  export default {
    name: 'DistributionSearch',
    
    setup(props) {
      const state = reactive({
        distributions: [],
        geographic_area_id: '',
        dsList: [],
        countryResult: [],
        nothingClicked: true,
        region: [],
        headerName: ''
      });
      
      const router = useRouter();      
      const countryData = ref(null);
      const openCountries = ref({});
      
      onMounted(async () => {
        const response = await fetch('/countryList.json')
        countryData.value = await response.json();
        countryData.value.forEach(country => {
          openCountries.value[country.id] = false;
        });
      });
      
      function toggleCountry(id) {
        openCountries.value[id] = !openCountries.value[id];
      };
      
      const areaClick = (clickedCountry) => {
        state.geographic_area_id = state.countries.find(c => c.id === clickedCountry);
      };
      
      const fetchDistributions = async (geographic_area_id, headerName) => {
        const response = await api.get(`/asserted_distributions`, {
          params: {
            geographic_area_id: geographic_area_id,
            per: 1000,
            token: import.meta.env.VITE_APP_API_TOKEN,
            project_token: import.meta.env.VITE_APP_PROJECT_TOKEN
          },
        });
        state.countryResult = await response.data;
        state.dsList = state.countryResult;
        state.headerName = headerName;
      };
                              
      const splitText = (formatted) => {
        formatted = formatted.replace(/<\/?i>/g, '');
        const characters = formatted.split('');
        return characters.map(char => {
          return {
          formatted: char,
          shouldItalicize: char !== "(" && char !== ")"
          }
        });
      };
      
      const displayTaxonPage = (taxonClicked) => {
        state.taxonClicked = taxonClicked;
        router.push({ name: 'TaxonPage', query: { taxonID: taxonClicked }});
        state.show = !state.show;
      };
  
      return { 
        ...toRefs(state),
        fetchDistributions,
        countryData,
        openCountries,
        toggleCountry,
        areaClick,
        splitText,
        displayTaxonPage
      };
    }
  };
  </script>  