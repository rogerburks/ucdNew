<template v-slot:BiologicalAssociations>
  <div class="row" ref="containerOfBiologicalAssociations" name="biologicalAssociationsContainer">
    <div class="col-12 bd-highlight align-items-start" id="biologicalAssociations-list-div" ref="biologicalAssociationsList">
      <button class="btn btn-link" type="button" @click="showBiologicalAssociations = !showBiologicalAssociations" aria-expanded="false">
        <span  v-if="biologicalAssociationsResultsExist">Toggle biological associations</span>
      </button>
      <!-- <p> Test otu list from Biological Associations: {{ baProp}} </p> -->
      <div id="collapseBiologicalAssociations" v-show="showBiologicalAssociations">
        <div id = "showIfQuery" v-if="biologicalAssociationsResultsExist">
          <ul id="results-list-span">
            <li style="list-style-type:none" v-for="object_tag in sortedBiologicalAssociations" v-html="object_tag"></li>
          </ul>
        </div>
        <div id="showIfNoQuery" v-else>
          No search has been made
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios"
  import { computed, ref, reactive } from '@vue/runtime-core'

  export default {
    name: 'BiologicalAssociations',
    
    props: {
      baProp: {
        type: String,
        required: true
      }
    },
    
    data(){
      return {
        showBiologicalAssociations: true,
        biologicalAssociationsJson: []
      }
    },
    
    computed: {
      sortedBiologicalAssociations() {
        return this.biologicalAssociationsJson
        .filter(association => association.object_tag)
        .map(association => association.object_tag.toString());
      },
      biologicalAssociationsResultsExist() {
        return this.sortedBiologicalAssociations && this.sortedBiologicalAssociations.length > 0;
      }
    },
    
  async mounted() {
    await this.fetchBiologicalAssociations();
  },
  
  methods: {
    async fetchBiologicalAssociations() {
      if (this.baProp){
        const baResponse = await axios.get(`https://sfg.taxonworks.org/api/v1/biological_associations?${this.baProp}&extend[]=object&extend[]=subject&extend[]=biological_relationship&extend[]=taxonomy&extend[]=biological_relationship_types&page=1&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ`);
        let newData = await baResponse.data;

        // Make sure Vue's reactivity system acknowledges the change
        this.biologicalAssociationsJson = [];
        this.biologicalAssociationsJson = newData;
      }
    },
  },
  
  watch: {
    async baProp() {
      await this.fetchBiologicalAssociations();
    }
  },
}
</script>