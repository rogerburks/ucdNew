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
      }
    },
    
    computed: {
        biologicalAssociationsResultsExist() {
          return this.$route.query.taxonID !== undefined && this.$route.query.taxonID !== null;
      }
    },
    
    setup() {
      const biologicalAssociationsJson = ref([{}]);
      
      //const finalBiologicalAssociationsArray = computed(() => {
      //  return [...biologicalAssociationsJson.object_tag.value]
      //});
      
      return {
        biologicalAssociationsJson
        //finalBiologicalAssociationsArray
      };
    },
    
    async mounted() {
      //if(taxonID){
      //  const response = await axios.get(`https://sfg.taxonworks.org/api/v1/taxon_names?taxon_name_id[]=${taxonID}&validity=true&per=250&exact=true&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ`);
      //  https://sfg.taxonworks.org/tasks/biological_associations/filter?otu_id[]=118743&otu_id[]=129683&otu_id[]=129684&otu_id[]=129726&extend%5B%5D=object&extend%5B%5D=subject&extend%5B%5D=biological_relationship&extend%5B%5D=taxonomy&extend%5B%5D=biological_relationship_types&page=1
      //  const relationshipsResponse = await axios.get(`https://sfg.taxonworks.org/api/v1/taxon_name_relationships?object_taxon_name_id=${taxonID}&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ`);
        
      //  this.taxonViewed = await response.data
     // }
      const promises = [];
      if (this.baProp){
        console.log("this.baprop is: " + this.baProp)
        const baResponse = await axios.get(`https://sfg.taxonworks.org/api/v1/biological_associations?${this.baProp}&extend[]=object&extend[]=subject&extend[]=biological_relationship&extend[]=taxonomy&extend[]=biological_relationship_types&page=1&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ`);
        this.biologicalAssociationsJson = await baResponse.data
        console.log("biological associations are: " + this.biologicalAssociationsJson)
        
        this.sortedBiologicalAssociations = []
        for (const association in this.biologicalAssociationsJson){
          if(this.biologicalAssociationsJson[association].object_tag){
            this.sortedBiologicalAssociations.push(this.biologicalAssociationsJson[association].object_tag.toString())
          }
        }
      }
    }
}
</script>