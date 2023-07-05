<template>
  <ul>
    <li><i>Note: be prepared to wait a few seconds if you choose a taxon with many descendants.</i></li>
    <li id="superfamily"><b><a>Chalcidoidea</a></b></li>
    <li v-for="taxon in (trList[0] && trList[0].children ? trList[0].children : [])" :key="taxon.id">
      <button @click="toggleTaxon(taxon)" id="treeButton">
        <span v-if="openTaxa[taxon.id] === true">-</span>
        <span v-else-if="openTaxa[taxon.id] === false">+</span>
        <span v-else>+</span>
      </button>
      <a @click="displayTaxonPage(taxon.id)" id="higherTaxon">
        {{ taxon.name }}
      </a>
      <ul v-if="openTaxa[taxon.id] === true && taxon.children">
        <li v-for="subfamily in taxon.children" :key="subfamily.id">
          <button @click="toggleTaxon(subfamily)" id="treeButton">
            <span v-if="openTaxa[subfamily.id] === true">-</span>
            <span v-else-if="openTaxa[subfamily.id] === false">+</span>
            <span v-else>+</span>
          </button>
          <a @click="displayTaxonPage(subfamily.id), nothingClicked = !nothingClicked" style="text-decoration:underline; color: var(--bs-link-color);" id="higherTaxon">
            {{ subfamily.name }}
          </a>
          <ul v-if="openTaxa[subfamily.id] === true && subfamily.children">
            <li v-for="genus in subfamily.children" :key="genus.id">
              <a @click="displayTaxonPage(genus.id), nothingClicked = !nothingClicked" style="text-decoration:underline; color: var(--bs-link-color);" id="higherTaxon">
                <i> {{ genus.name }} </i>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</template>

  
    
  <style scoped>
    ul {
      list-style-type: none;
    }
  
    ul ul {
      padding-left: 20px;
    }
    
    #treeButton {
      background-color: #ffffff;
      width: 19px;
      height: 19px;
      line-height: 5px;
      text-align: center;
      border: 1px solid black;
      font-size: small;
    }
    
    #treeButton:hover {
      background-color: rgb(134, 134, 134);
    }
    
    #species {
      padding-left: 5px;
    }
    
    #higherTaxon {
      padding-left: 5px;
      text-decoration:underline; 
      color: var(--bs-link-color)
    }
    
    #itemDescendant {
      padding-left: 20px;
    }
    
    #superfamily {
      font-size: larger;
    }
  </style>
    
  <script>
    import { onMounted, reactive, toRefs, ref } from 'vue';
    import api from '/api.js'
    import { useRouter } from 'vue-router'
    
    export default {
      name: 'TaxonomicTree',
      
      setup(props) {
        const state = reactive({
          descendants: [],
          taxonID: '',
          trList: [],
          treeResult: [],
          taxon: [],
          openTaxa: {}
        });
        
        const router = useRouter();      
        const treeData = ref(null);
        
        onMounted(async () => {
          const taxonID = 455458;
          state.trList.push({id: taxonID, children: []});
          await getDescendants(taxonID);
        });
        
        const getDescendants = async (taxonID) => {
          const response = await api.get(`/taxon_names`, {
            params: {
            taxon_name_id: taxonID,
            descendants: true,
            descendants_max_depth: 1,
            validity: true,
            validify: true,
            per: 1000,
            token: import.meta.env.VITE_APP_API_TOKEN,
            project_token: import.meta.env.VITE_APP_PROJECT_TOKEN
            },
          });
          const descendants = await response.data;
          
          const filteredDescendants = await descendants
            .filter(item => item.id !== taxonID)
            .sort((a, b) => a.name.localeCompare(b.name));
          
          const taxon = findTaxon(taxonID, state.trList);
          
          if(taxon) {
            taxon.children = filteredDescendants;
          }      
          
          state.openTaxa[taxonID] = true;
        };
        
        const findTaxon = (id, taxons) => {
          for (let i = 0; i < taxons.length; i++) {
            if (taxons[i].id === id) {
              return taxons[i];
            }
            if (taxons[i].children) {
              const found = findTaxon(id, taxons[i].children);
              if (found) {
                return found;
              }
            }
          }
          return null;
        }
        
        const toggleTaxon = async (taxon) => {
    if (state.openTaxa[taxon.id] === undefined) {
        await getDescendants(taxon.id);
    } else {
        state.openTaxa[taxon.id] = !state.openTaxa[taxon.id];
    }
};

        
        const taxonClick = (clickedTaxon) => {
          state.taxonID = state.descendants.find(c => c.id === clickedTaxon);
        };
                                
        const splitText = (formatted) => {
          formatted = formatted.replace(/<\/?i>/g, '');
          const parts = formatted.split(/(\s|\[sic\])/).filter(part => part !== "");
          return parts.map(part => {
            if (part === "[sic]") {
              return {
                formatted: part,
                shouldItalicize: false
              }
            }
            const characters = part.split('');
            return characters.map(char => {
              return {
                formatted: char,
                shouldItalicize: char !== "(" && char !== ")"
              }
            });
          }).flat();
        };
              
        const displayTaxonPage = (taxonClicked) => {
          state.taxonClicked = taxonClicked;
          router.push({ name: 'TaxonPage', query: { taxonID: taxonClicked }});
          state.show = !state.show;
        };
    
        return { 
          ...toRefs(state),
          getDescendants,
          treeData,
          toggleTaxon,
          taxonClick,
          splitText,
          displayTaxonPage
        };
      }
    };
    </script>  