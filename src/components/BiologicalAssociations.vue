<template>
  <div v-if="sortedBiologicalAssociations[0]">
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
    <references :bar-Prop="baReferences"></references>
  </div>
  <div v-else><img src="/spinning-circles.svg" alt="Loading..." width="75"></div>
</template>

<script>
  import { computed, reactive, toRefs, onMounted, nextTick } from 'vue'
  import api from '/api.js'
  import References from './References.vue';

  export default {
    name: 'BiologicalAssociations',
    
    props: {
      baProp: Array
    },
    
    components: {
      References
    },
    
    setup(props) {
      const state = reactive({
        showBiologicalAssociations: true,
        biologicalAssociationsJson: [],
        baReferences: []
      });
      
      const sortedBiologicalAssociations = computed(() => {
        return state.biologicalAssociationsJson
          .filter(association => association.biological_relationship.name !== "compared with")
          .filter(association => association.object.object_tag)
          .map(association => {
            const citation = association.citations?.[0]?.citation_source_body || 'No citation';
            const objectTag = association.object.object_tag.replace(" &#10003;", "").replace(" &#10060;", "").replace(" [c]", "");
            const relationship = association.biological_relationship.object_label.toLowerCase();
            const subject = association.subject.object_tag.replace(" &#10003;", "").replace(" &#10060;", "").replace(" [c]", "");
            return `${objectTag} is a ${relationship} of ${subject}, (${citation})`.replace("a associate", "an associate");
          });
      });
      
      onMounted(async () => {   
        nextTick();     
        const baResponse = await api.get(`/biological_associations`,
          {params: {
            taxon_name_id: props.baProp,
            extend: ["object", "subject", "biological_relationship", "taxonomy", "biological_relationship_types", "citations", "source"],
            per: "10000",
            descendants: "true",
            token: import.meta.env.VITE_APP_API_TOKEN,
            project_token: import.meta.env.VITE_APP_PROJECT_TOKEN,
          }}
        );
        console.log("baProp at the time of the BiologicalAssociations api call is: " + props.baProp)
        let newData = await baResponse.data;
        state.biologicalAssociationsJson = await newData;
      });
      
      const baReferences = computed(() => {
        let references = state.biologicalAssociationsJson.flatMap(item => item.citations.map(citation => citation.source.object_tag));
        return references.sort();
      });
      
      return { 
        ...toRefs(state),
        sortedBiologicalAssociations,
        baReferences
      };
    }
  }
</script>