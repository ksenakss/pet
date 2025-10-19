<template>
    <v-container max-width="500px">
        <v-form ref="form" @submit.prevent="handleSubmit">
            <v-text-field
                label="Логин"
                variant="outlined"
                v-model="username"
            >
            </v-text-field>
            <v-text-field
                label="Пароль"
                variant="outlined"
                v-model="password"
            >

            </v-text-field>
            <div class="d-flex justify-lg-space-between">
                <v-btn
                    color="primary"
                    density="comfortable"
                    variant="outlined"
                    size="large"
                    @click="handleRegister"
                    :loading="loading"
                >
                    Регистрация
                </v-btn>
                <v-btn
                    color="primary"
                    density="comfortable"
                    variant="elevated"
                    size="large"
                    :loading="loading"
                    :disabled="loading"
                    @click="handleSubmit"
                >
                    Войти
                </v-btn>
            </div>
        </v-form>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, inject, computed } from 'vue';
import { useRouter } from 'vue-router';
import {toast} from "vue3-toastify";
import api from "@/api";

const username = ref('');
const password = ref('');
const loading = ref(false);
const form = ref();
const router = useRouter();

const handleRegister = function() {
    router.push({name: 'register'});
};

const handleSubmit = async () => {
    const { valid } = await form.value.validate();

    if (!valid) {
        toast.error('Заполните все обязательные поля');
        return;
    }

    try {
        loading.value = true;

        await api.post('/auth/login', {
            username: username.value,
            password: password.value,
        });
        window.location.reload();

    } catch (e) {
        toast.error(e.message);
    } finally {
        loading.value = false;
    }
};
</script>
