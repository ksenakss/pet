<template>
    <router-view />
</template>

<script>
export default {
    name: 'App'
}
</script>

<style>
nav {
    padding: 20px;
    background: #f5f5f5;
}
nav a {
    margin: 0 10px;
    text-decoration: none;
    color: #2c3e50;
}
nav a.router-link-active {
    color: #42b983;
    font-weight: bold;
}
</style>
