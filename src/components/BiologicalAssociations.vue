<template v-slot:BiologicalAssociations>
  <div class="row" ref="containerOfBiologicalAssociations" name="biologicalAssociationsContainer">
    <div class="col-12 bd-highlight align-items-start" id="biologicalAssociations-list-div" ref="biologicalAssociationsList">
      <button class="btn btn-link" type="button" @click="showBiologicalAssociations = !showBiologicalAssociations" aria-expanded="false">
        <font-awesome-icon :icon="showBiologicalAssociations ? 'angle-down' : 'angle-right'" />
        <span v-if="!showBiologicalAssociations"> Show biological associations</span>
        <span v-else> Biological associations</span>
      </button>
      <div id="collapseBiologicalAssociations" v-show="showBiologicalAssociations">
        <div id = "showIfQuery" v-if="sortedBiologicalAssociations">
          <ul id="results-list-span">
            <li style="list-style-type:none" v-for="object_tag in sortedBiologicalAssociations" :key="object_tag" v-html="object_tag"></li>
          </ul>
        </div>
        <div id="showIfNoQuery" v-else>
          No biological associations have been retrieved.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { watch, computed, reactive, toRefs } from 'vue'
  import api from '/api.js'

  export default {
    name: 'BiologicalAssociations',
    
    props: {
      baProp: String
    },
    
    setup(props) {
      const state = reactive({
        showBiologicalAssociations: true,
        biologicalAssociationsJson: []
      });
      
      const sortedBiologicalAssociations = computed(() => {
        return state.biologicalAssociationsJson
        .filter(association => association.biological_relationship.name !== "compared with")
        .filter(association => association.object.object_tag)
        .map(association => ((association.object.object_tag.replace(" &#10003;", "").replace(" &#10060;", "").replace(" [c]", "") + " is a " + association.biological_relationship.object_label.toLowerCase() + " of " + association.subject.object_tag).toString().replace(" &#10003;", "").replace(" &#10060;", "").replace(" [c]", "") + ", (" + association.citations[0].citation_source_body + ")").replace("a associate", "an associate"));
      });
      
      watch(() => props.baProp, async (newVal, oldVal) => {
        if (newVal) {
          const baResponse = await api.get(`/biological_associations?${newVal}`,
            {params: {
              extend: ["object", "subject", "biological_relationship", "taxonomy", "biological_relationship_types", "citations"],
              per: "1000",
              token: import.meta.env.VITE_APP_API_TOKEN,
              project_token: import.meta.env.VITE_APP_PROJECT_TOKEN,
            }}
          );
          let newData = await baResponse.data;
          console.log(baResponse.headers['pagination-total-pages']);
          state.biologicalAssociationsJson = newData;
        }
      }, { immediate: true });
      
      return { 
        ...toRefs(state),
        sortedBiologicalAssociations
      };
    }
  }
</script>