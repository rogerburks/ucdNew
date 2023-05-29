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
        .filter(assocation => assocation.biological_relationship.name !== "compared with")
        .filter(association => association.object.object_tag)
        .map(association => ((association.object.object_tag.replace(" &#10003;", "").replace(" &#10060;", "").replace(" [c]", "") + " is a " + association.biological_relationship.object_label.toLowerCase() + " of " + association.subject.object_tag).toString().replace(" &#10003;", "").replace(" &#10060;", "").replace(" [c]", "") + ", (" + association.citations[0].citation_source_body + ")").replace("a associate", "an associate"));
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
        const baResponse = await axios.get(`https://sfg.taxonworks.org/api/v1/biological_associations?${this.baProp}&extend[]=object&extend[]=subject&extend[]=biological_relationship&extend[]=taxonomy&extend[]=biological_relationship_types&extend[]=citations&page=1&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ`);
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