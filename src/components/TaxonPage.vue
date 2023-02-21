<template v-slot:taxonPage>
    <div class = "row">
      <div class="col-12">
        <h3 v-if="italicized"><i>{{ this.taxonViewed[0].cached }}</i> {{ this.taxonViewed[0].cached_author_year }}</h3>
        <h3 v-else>{{ this.taxonViewed[0].cached }} {{ this.taxonViewed[0].cached_author_year }}</h3>
      </div>
    </div>
  </template>
  
<script>
  import axios from "axios"
  import { computed, ref, reactive } from '@vue/runtime-core'
  
  export default {
    setup() {
    //variables are made reactive or ref here
      return {
        taxonPageApiResults: ref([{}]),
        taxonViewed: ref([{}])
      }
    },
    
    computed: {
        italicized: function(){
            if(this.taxonViewed[0].rank_string === 'NomenclaturalRank::Iczn::GenusGroup::Genus'){
              return true
            } else if (this.taxonViewed[0].rank_string === 'NomenclaturalRank::Iczn::SpeciesGroup::Species'){
              return true
            } else {
              return false
            }
        }
    },
    
    async created(taxonID) {
      taxonID = this.$route.query.taxonID
      const response = await axios.get('https://sfg.taxonworks.org/api/v1/taxon_names?taxon_name_id[]=' + taxonID + '&validity=true&per=250&exact=true&token=e1KivaZS6fvxFYVaqLXmCA&project_token=adhBi59dc13U7RxbgNE5HQ')
      this.taxonViewed = response.data
      console.log('The taxon ID is: ' + taxonID);
      //console.log(this.taxonPageApiResults)
      console.log(this.taxonViewed)
      console.log('The rank string is: ' + this.taxonViewed[0].rank_string);
    }
  }
</script>