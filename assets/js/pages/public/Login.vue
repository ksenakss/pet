<template>
    <v-container>
        <v-text-field
            label="Логин"
            v-model="user.name"
        >

        </v-text-field>
        <v-text-field
            label="Пароль"
            v-model="user.password"
        >

        </v-text-field>
        <v-btn
            color="primary"
            density="comfortable"
            variant="outlined"
            @click="handleRegister"
            :loading="loading"
        >
            Регистрация
        </v-btn>
        <v-btn
            color="primary"
            density="comfortable"
            variant="elevated"
            @click="handleSubmit"
            :loading="loading"
        >
            Войти
        </v-btn>
    </v-container>
</template>

<script setup lang="ts">

interface user {
    name: string;
    password: string;
}

</script>
