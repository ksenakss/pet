<template>
    <v-container>
        <v-main>
            <div class="home">
                <div class="header">Главная страница</div>
                <div class="block">
                    <v-card-title class="subtitle text-h6 mb-4">
                        Этот сайт работает на современном стеке:
                    </v-card-title>

                    <v-list class="tech-list" bg-color="transparent">
                        <v-list-item class="list-item">
                            <template v-slot:prepend>
                                <v-icon color="primary">mdi-vuejs</v-icon>
                            </template>
                            <v-list-item-title class="text-h6">
                                Frontend: Vue 3 с Composition API и TypeScript
                            </v-list-item-title>
                        </v-list-item>

                        <v-divider class="my-2 border-color-0"></v-divider>

                        <v-list-item class="list-item">
                            <template v-slot:prepend>
                                <v-icon color="primary">mdi-symfony</v-icon>
                            </template>
                            <v-list-item-title class="text-h6">
                                Backend: Symfony 6 с API Platform
                            </v-list-item-title>
                        </v-list-item>

                        <v-divider class="my-2 border-color-1"></v-divider>

                        <v-list-item class="list-item">
                            <template v-slot:prepend>
                                <v-icon color="primary">mdi-database</v-icon>
                            </template>
                            <v-list-item-title class="text-h6">
                                Database: PostgreSQL для надежного хранения данных
                            </v-list-item-title>
                        </v-list-item>

                        <v-divider class="my-2 border-color-2"></v-divider>

                        <v-list-item class="list-item">
                            <template v-slot:prepend>
                                <v-icon color="primary">mdi-palette</v-icon>
                            </template>
                            <v-list-item-title class="text-h6">
                                UI: Vuetify 3 для красивого интерфейса
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </div>
                <MainActionsGrid/>
            </div>
        </v-main>
    </v-container>
</template>

<script setup lang="ts">
import MainActionsGrid from "@/components/MainActionsGrid.vue"

const test = () => {
    alert('Button works!')
}
</script>

<style scoped>
</style>
