<template template v-slot:TaxonDistribution>
  <div v-if="isLoading">
  </div>
  <div v-else>
    <span style="width: 600px; display:inline-block;">Distribution: {{ sortedTaxonDistributions.join(', ') }}</span>
    <div id="map" class="leaflet-container leaflet-touch leaflet-fade-anim leaflet-grab leaflet-touch-drag leaflet-touch-zoom" :class="{'hidden': isLoading}" style="width: 600px; height: 400px; position: relative; outline-style: none;"></div>
  </div>
</template>

<script>
  import { computed, ref, reactive, watchEffect, onMounted } from 'vue';
  import L from 'leaflet';
  import 'leaflet-providers';
  import api from '/api.js'

  export default {
    name: 'TaxonDistributions',

    props: {
      baProp: {
        type: String,
        required: true
      }
    },

    setup(props) {
      const showTaxonDistributions = ref(true);
      const TaxonDistributionsJson = reactive([]);
      const isLoading = ref(true);
      const map = ref(null);

      const sortedTaxonDistributions = computed(() => {
        const uniqueCountries = new Set(
          TaxonDistributionsJson.map(item => item.geographic_area.name)
        );

        return Array.from(uniqueCountries).sort();
      });

      const initializeMap = async () => {
        map.value = L.map('map').setView([50, 0], 1);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>', subdomains: 'abcd',
        }).addTo(map.value);

        const geoJsonLayer = L.geoJSON(null, {
          style: {
            fillColor: 'orange', // Fill color for highlighted countries
            fillOpacity: 0.5, // Fill opacity
            color: 'black', // Border color
            weight: 1, // Border weight
          },
        }).addTo(map.value);

        watchEffect(() => {
          const geojsonArray = TaxonDistributionsJson.map((item) => {
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

        await fetchTaxonDistributions();
      };

      const fetchTaxonDistributions = async () => {
        if (props.baProp) {
          const tdResponse = await api.get(`/asserted_distributions?${props.baProp}`,
            {params: {
              embed: ["shape"],
              extend: ["eographic_area"],
              geo_json: "true",
              token: import.meta.env.VITE_APP_API_TOKEN,
              project_token: import.meta.env.VITE_APP_PROJECT_TOKEN,
            }}                                 
          );
          const newData = tdResponse.data;

          // Make sure Vue's reactivity system acknowledges the change
          TaxonDistributionsJson.length = 0;
          TaxonDistributionsJson.push(...newData);
        }
      };

      onMounted(async () => {
        setTimeout(() => {
          isLoading.value = false;
          setTimeout(() => {
            initializeMap();
          }, 0);
        }, 2000);
      });

      watchEffect(() => {
        fetchTaxonDistributions();
      });

      return {
        showTaxonDistributions,
        TaxonDistributionsJson,
        isLoading,
        sortedTaxonDistributions,
        map,
        initializeMap
      };
    }
  };
</script>