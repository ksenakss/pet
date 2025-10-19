<template>
    <v-container max-width="500px" class="mt-16">
        <v-form ref="form" @submit.prevent="handleSubmit">
            <v-text-field
                label="Логин"
                variant="outlined"
                v-model="username"
                :rules="[requiredRule]"
                required
            >
            </v-text-field>
            <v-text-field
                label="Имя"
                variant="outlined"
                v-model="name"
                :rules="[requiredRule]"
                required
            >
            </v-text-field>
            <v-text-field
                label="Компания"
                variant="outlined"
                v-model="companyName"
                :rules="[requiredRule]"
                required
            >
            </v-text-field>
            <v-textarea
                label="Описание"
                rows="3"
                variant="outlined"
                v-model="description"
            >
            </v-textarea>
            <v-text-field
                label="Пароль"
                variant="outlined"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                :rules="[requiredRule, passwordRule]"
                required
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
            >
            </v-text-field>
            <v-text-field
                label="Повторите пароль"
                variant="outlined"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                :rules="[requiredRule, confirmPasswordRule]"
                required
                :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showConfirmPassword = !showConfirmPassword"
            >
            </v-text-field>
            <div class="d-flex justify-lg-space-between mt-4">
                <v-btn
                    color="primary"
                    density="comfortable"
                    variant="outlined"
                    size="large"
                    @click="handleLogin"
                    :loading="loading"
                >
                    Войти
                </v-btn>
                <v-btn
                    type="submit"
                    color="primary"
                    density="comfortable"
                    variant="elevated"
                    size="large"
                    :loading="loading"
                    :disabled="loading"
                    @click="handleSubmit"
                >
                    Зарегистрироваться
                </v-btn>
            </div>
        </v-form>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import api from '@/api';

const username = ref('');
const name = ref('');
const password = ref('');
const confirmPassword = ref('');
const companyName = ref('');
const description = ref('');
const loading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const form = ref();

const router = useRouter();

const requiredRule = (value: string) => !!value || 'Обязательное поле';
const passwordRule = (value: string) => value.length >= 6 || 'Пароль должен содержать минимум 6 символов';
const confirmPasswordRule = (value: string) => value === password.value || 'Пароли не совпадают';

const handleLogin = function() {
    router.push({name: 'login'});
};

const close = function() {
    router.push({name: 'login'});
};

const handleSubmit = async () => {
    const { valid } = await form.value.validate();

    if (!valid) {
        toast.error('Заполните все обязательные поля корректно');
        return;
    }

    try {
        loading.value = true;

        const registrationData = {
            user: {
                username: username.value,
                name: name.value,
                password: password.value,
                confirmPassword: confirmPassword.value,
            },
            company: {
                name: companyName.value,
                description: description.value,
            },
        };

        let formData = new FormData();
        formData.append(
            'data',
            JSON.stringify({
                registrationData: registrationData,
            }),
        );
        await api.post('/auth/registration', formData);
        toast.info('Вы успешно ввели данные!');

        setTimeout(() => {
            close();
        }, 2000);

    } catch (e) {
        toast.error(e.message);
    } finally {
        loading.value = false;
    }
};
</script>
