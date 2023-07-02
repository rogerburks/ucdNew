<template v-slot:NomenclaturalReferences>
  <div class="row" ref="containerOfBiologicalAssociations" name="biologicalAssociationsContainer">
    <div class="col-12 bd-highlight align-items-start" id="biologicalAssociations-list-div" ref="biologicalAssociationsList">
      <button class="btn btn-link" type="button" @click="showNomenclaturalReferences = !showNomenclaturalReferences" aria-expanded="false">
        <font-awesome-icon :icon="showNomenclaturalReferences ? 'angle-down' : 'angle-right'" />
        <span v-if="!showNomenclaturalReferences"> Show nomenclatural references</span>
        <span v-else> Nomenclatural references</span>
      </button>
      <div id="collapseBiologicalAssociations" v-show="showNomenclaturalReferences">
        <div id = "showIfQuery" v-if="nrProp.length">
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

<style scoped>
  #results-list-span {
      padding-left: 3em;
      text-indent: -1.5em;
  }
</style>

<script>
  import { reactive, toRefs } from 'vue';
  
  export default {
    name: 'NomenclaturalReferences',
    
    props: {
      nrProp: Array
    },
    
    setup(props) {
      const state = reactive({
        showNomenclaturalReferences: true
      });
      
      return { 
        ...toRefs(state)
      };
    }
  }
</script>
