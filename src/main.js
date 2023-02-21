import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import HomePage from './components/HomePage.vue'
import BinomialSearch from './components/BinomialSearch.vue'
import TaxonPage from './components/TaxonPage.vue'

import './assets/main.css'

//import bootstrap for responsive visual controls
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

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
        path: '/taxon',
        name: 'TaxonPage',
        component: TaxonPage,
        props: true
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

//Vue.use(VueRouter)

//createApp(App).mount('#app')

const app = createApp(App)
app.use(router)
app.mount('#app')

//new Vue({
//    router,
//    render: h => h(App)
//}).$mount('#app')