<template template v-slot:TaxonDistribution>
  <div v-if="isLoading">
  </div>
  <div v-else>
    <span style="width: 600px; display:inline-block;">Distribution: {{ sortedTaxonDistributions.join(', ') }}</span>
    <div id="map" class="leaflet-container leaflet-touch leaflet-fade-anim leaflet-grab leaflet-touch-drag leaflet-touch-zoom" :class="{'hidden': isLoading}" style="width: 600px; height: 400px; position: relative; outline-style: none;"></div>
  </div>
</template>

<script>
  import axios from "axios"
  import { computed, ref, reactive, watchEffect, nextTick } from '@vue/runtime-core'
  import L from 'leaflet';
  import 'leaflet-providers';

  export default {
    name: 'TaxonDistributions',
    
    props: {
      baProp: {
        type: String,
        required: true
      }
    },

    data(){
      return {
        showTaxonDistributions: true,
        TaxonDistributionsJson: [],
        isLoading: true,
        map: null
      }
    },
    
    computed: {
      sortedTaxonDistributions() {
        const uniqueCountries = new Set(
          this.TaxonDistributionsJson.map(item => item.geographic_area.name)
        );

        return Array.from(uniqueCountries).sort();
      },
      taxonDistributionsResultsExist() {
        return this.sortedTaxonDistributions && this.sortedTaxonDistributions.length > 0;
      }
    },
    
    async mounted() {
      setTimeout(() => {
        this.isLoading = false;
        setTimeout(() => {
          this.initializeMap();
        }, 0);
      }, 2000);
    },

    methods: {
      async initializeMap() {
        this.map = L.map('map').setView([50, 0], 1);
        
        const map = this.map; // Assign to a local variable for scoping

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>', subdomains: 'abcd',
        }).addTo(map);
      
        const geoJsonLayer = L.geoJSON(null, {
          style: {
            fillColor: 'orange', // Fill color for highlighted countries
            fillOpacity: 0.5, // Fill opacity
            color: 'black', // Border color
            weight: 1, // Border weight
          },
        }).addTo(map);
        
        watchEffect(() => {
          const geojsonArray = this.TaxonDistributionsJson.map((item) => {
            if (item.geographic_area.shape?.geometry) {
              return item.geographic_area.shape.geometry;
            }
            return null;
          });

          geoJsonLayer.clearLayers();

          geojsonArray.forEach((item) => {
            if (item) {
              geoJsonLayer.addData(item);
            }
          });
        });

        this.fetchTaxonDistributions();
      },
      async fetchTaxonDistributions() {
        if (this.baProp){
          const tdResponse = await axios.get(`https://sfg.taxonworks.org/api/v1/asserted_distributions?${this.baProp}&embed[]=shape&extend[]=geographic_area&geo_json=true&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ`);
          let newData = await tdResponse.data;

          // Make sure Vue's reactivity system acknowledges the change
          this.TaxonDistributionsJson = [];
          this.TaxonDistributionsJson = newData;
        }
      },
    },
    
    watch: {
      async baProp() {
        await this.fetchTaxonDistributions();
      }
    }
  }
</script>
