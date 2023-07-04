import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import HomePage from './components/HomePage.vue';
import BinomialSearch from './components/BinomialSearch.vue';
import TaxonPage from './components/TaxonPage.vue';
import SearchResults from './components/SearchResults.vue';
import BiologicalAssociations from './components/BiologicalAssociations.vue';
import NomenclaturalReferences from './components/NomenclaturalReferences.vue';
import TaxonDistribution from './components/TaxonDistribution.vue';
import AssociatesSearch from './components/AssociatesSearch.vue';
import DistributionSearch from './components/DistributionSearch.vue';
import KeywordSearch from './components/KeywordSearch.vue';
import './assets/main.css';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleDown, faAngleRight, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faAngleDown, faAngleRight);

const routes = [{
        path: '/',
        name: 'Home',
        component: HomePage
    },
    {
        path: '/binomialSearch',
        name: 'BinomialSearch',
        component: BinomialSearch
    },
    {
        path: '/taxon/:taxonID',
        component: TaxonPage,
        props: true
    },
    {
        path: '/taxon',
        name: 'TaxonPage',
        component: TaxonPage
    },
    {
        path: '/searchResults',
        name: 'SearchResults',
        component: SearchResults,
        props: true
    },
    {
        path: '/biologicalAssociations',
        name: 'BiologicalAssociations',
        component: BiologicalAssociations
    },
    {
        path: '/taxonDistribution',
        name: 'TaxonDistribution',
        component: TaxonDistribution
    },
    {
        path: '/nomenclaturalReferences',
        name: 'NomenclaturalReferences',
        component: NomenclaturalReferences
    },
    {
        path: '/associatesSearch',
        name: 'AssociatesSearch',
        component: AssociatesSearch
    },
    {
        path: '/distributionSearch',
        name: 'DistributionSearch',
        component: DistributionSearch
    },
    {
        path: '/keywordSearch',
        name: 'KeywordSearch',
        component: KeywordSearch
    }
];
const router = createRouter({
    history: createWebHashHistory(),
    routes
});
const app = createApp(App);
app.use(router);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');