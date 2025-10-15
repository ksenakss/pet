<template>
  <span class="app-bar">
    <v-btn
      class="ma-5"
      color="primary"
      @click="goToMain"
    >
      Главная
    </v-btn>
    <v-btn
        class="ml-auto ma-5"
        color="primary"
        @click="goToLogin"
    >
      Войти
    </v-btn>
  </span>
</template>

<script>
import api from '@/api';
import Config from "@/config";

export default {
    name: 'AppBar',

    data() {

    },
    created() {

    },
    methods: {
        goToMain() {
            alert('Button works!')
            this.$router.push({name:'home'})
        },
        goToLogin(){
            this.$router.push({name:'login'})
        }
    },
    computed: {

    },
    watch: {

    },
    mounted() {

    },
};
</script>

<style scoped>
.app-bar {
    display: flex;
    height: 100px;
    width: 100%;
    align-items: center;
    background-color: var(--primary-color-yellow);
    border-bottom: 1px solid var(--primary-color-light-green);
}
:deep(.v-btn) {
    cursor: pointer !important;
}
.v-btn {
    cursor: pointer !important;
}
</style>
