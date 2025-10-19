<template>
    <v-container class="elevation-2 pa-4 containerCards" :loading="processing">
        <div class="cardTitle">Профиль пользователя</div>
        <v-form ref="form" :readonly="!editing">
            <v-text-field
                label="Логин"
                placeholder="Введите логин"
                v-model="user.username"
                :error-messages="errors['username']"
                :disabled="processing"
                :class="{ 'disabled': !editing }"
                @input="errors['username'] = null"
                :required="editing"
            />
            <v-text-field
                label="Имя"
                placeholder="Введите имя"
                v-model="user.name"
                :disabled="processing"
                :class="{ 'disabled': !editing }"
                :required="editing"
            />
        </v-form>
        <v-card-actions>
            <div>
                <v-btn
                    v-if="!editing"
                    color="primary"
                    density="comfortable"
                    variant="outlined"
                    :disabled="processing"
                    @click="toPreviosPage()"
                >
                    Назад
                </v-btn>
                <v-btn
                    v-if="editing"
                    color="primary"
                    density="comfortable"
                    variant="outlined"
                    :disabled="processing"
                    @click="cancelAction()"
                >
                    Отмена
                </v-btn>
            </div>
            <div class="ml-auto" style="display: flex; gap: 10px;">
                <v-btn
                    v-if="!editing"
                    color="primary"
                    density="comfortable"
                    variant="elevated"
                    :disabled="processing"
                    @click="editAction()"
                >
                    Редактировать
                </v-btn>
                <v-btn
                    v-if="editing"
                    color="primary"
                    density="comfortable"
                    variant="elevated"
                    :disabled="processing"
                    @click="saveAction()"
                >
                    Сохранить
                </v-btn>
            </div>
        </v-card-actions>
    </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {toast} from "vue3-toastify";
import api from "@/api";
import Config from "@/config";

const router = useRouter()

// Reactive state
const editing = ref(false)
const processing = ref(false)
const userMemory = ref({})

const errors = reactive({
    username: null,
    email: null
})

const user = reactive({
    id: null,
    name: null,
    companyName: null,
    description: null,
})

// Methods
const load = async () => {
    processing.value = true
    try {
        const userData = await api.get('/profile/load')
        Object.assign(user, userData)
    } catch (e) {
        toast.error(e.message)
    }
    processing.value = false
}

const saveAction = async () => {
    processing.value = true

    const hasErrors = Object.values(errors).some(value => value !== null)

    // Тут нужно будет переделать валидацию под composition API
    const formValid = true // временно

    if (formValid && !hasErrors) {
        try {
            let formData = new FormData()
            formData.append('data', JSON.stringify(user))
            await api.post('/profile/save', formData)
            await Config.reload()
            editing.value = false
        } catch (e) {
            toast.error(e.message)
        }
    } else {
        toast.error('Проверьте правильность заполнения формы')
    }
    processing.value = false
}

const editAction = () => {
    editing.value = true
    userMemory.value = { ...user }
}

const cancelAction = () => {
    editing.value = false
    Object.assign(user, userMemory.value)
}

const toPreviosPage = () => {
    router.back()
}

// Lifecycle
onMounted(() => {
    load()
})
</script>
