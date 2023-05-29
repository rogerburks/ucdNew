<template v-slot:NomenclaturalReferences>
  <div class="row" ref="containerOfBiologicalAssociations" name="biologicalAssociationsContainer">
    <div class="col-12 bd-highlight align-items-start" id="biologicalAssociations-list-div" ref="biologicalAssociationsList">
      <button class="btn btn-link" type="button" @click="showNomenclaturalReferences = !showNomenclaturalReferences" aria-expanded="false">
         <span  v-if="nomenclaturalReferencesExist">Toggle nomenclatural references</span>
      </button>
        <div id="collapseBiologicalAssociations" v-show="showNomenclaturalReferences">
          <div id = "showIfQuery" v-if="nomenclaturalReferencesExist">
            <ul id="results-list-span">
              <li style="list-style-type:none" v-for="object_tag in nrProp" :key="object_tag" v-html="object_tag"></li>
            </ul>
          </div>
            <div id="showIfNoQuery" v-else>
                No nomenclatural references have been retrieved.
            </div>
        </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'NomenclaturalReferences',
    
    props: {
      nrProp: {
        type: String,
        required: true
      }
    },
    
    data(){
      return {
        showNomenclaturalReferences: true,
        showNomenclaturalReferencesJson: []
      }
    },
    
    computed: {
        nomenclaturalReferencesExist() {
        return this.nrProp && this.nrProp.length > 0;
      }
    }
   
  }
</script>