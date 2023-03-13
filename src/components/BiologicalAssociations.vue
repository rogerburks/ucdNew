<template v-slot:BiologicalAssociations>
  <div class="row" ref="containerOfBiologicalAssociations" name="biologicalAssociationsContainer">
    <div class="col-12 bd-highlight align-items-start" id="biologicalAssociations-list-div" ref="biologicalAssociationsList">
      <button class="btn btn-link" type="button" @click="showBiologicalAssociations = !showBiologicalAssociations" aria-expanded="false">
        <!-- <span  v-if="biologicalAssociationsResultsExist">Toggle biological associations</span> -->
      </button>
      <p> {{ baProp}} </p>
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
    
    async mounted() {
      console.log('baProp is: ', this.baProp)
    }
}
</script>