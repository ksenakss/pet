<template>
    <v-row>
        <v-col cols="12" sm="6" v-for="(action, index) in actions" :key="index">
            <v-card
                class="pa-4 action-card block"
                height="120"
                :class="`bg-color-${index % 3}`"
                @click="handleAction(action.action)"
            >
                <v-card-title class="text-h6 text-center">
                    {{ action.title }}
                </v-card-title>
                <v-card-text class="text-center text--secondary">
                    {{ action.description }}
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from 'vue-router'

defineOptions({
    name: 'MainActionsGrid'
})

interface ActionItem {
    title: string
    description: string
    action: string
}

const actions = ref<ActionItem[]>([
    {
        title: 'Посмотреть БД',
        description: 'Просмотр состояния базы данных',
        action: 'viewDatabase'
    },
    {
        title: 'Протестировать БД',
        description: 'Запуск тестов базы данных',
        action: 'test_database'
    },
    {
        title: 'Посмотреть настройки Kafka',
        description: 'Просмотр конфигурации Kafka',
        action: 'view_kafka'
    },
    {
        title: 'Протестировать Kafka',
        description: 'Тестирование подключения к Kafka',
        action: 'test_kafka'
    },
    {
        title: 'Мониторинг системы',
        description: 'Просмотр метрик системы',
        action: 'system_monitoring'
    },
    {
        title: 'Логи приложения',
        description: 'Просмотр логов приложения',
        action: 'view_logs'
    }
])

const router = useRouter();

const handleAction = (action: string) => {
    router.push({name: action})
}
</script>

<style scoped>
.action-card {
    cursor: pointer;
    transition: all 0.3s ease;
}

.action-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}
</style>
