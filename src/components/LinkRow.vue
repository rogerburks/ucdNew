<!-- This is a row of links that should be positioned below the banner and above any other interactive items-->
<!-- I have chosen to use the Bootstrap base nav in this component. Other nav options exist-->

<template>
    <ul class = "nav">
        <li class="nav-item">
            <router-link :to ="{name: 'Home'}" class="nav-link">Search names</router-link>
        </li>
        <router-view></router-view>
    </ul>
</template>