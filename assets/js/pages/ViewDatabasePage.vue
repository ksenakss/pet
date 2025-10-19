<template>
    <v-container>
        <div class="database-schema">
            <span class="header">Схема базы данных</span>

            <!-- Loading state -->
            <div v-if="loading" class="loading">
                Loading schema...
            </div>

            <!-- Error state -->
            <div v-else-if="error" class="error">
                {{ error }}
            </div>

            <!-- Data -->
            <div v-else>
                <div v-for="table in schema" :key="table.name" class="block table-card">
                    <span class="header-1 d-flex justify-center" style="">Таблица '{{ table.name }}'</span>

                    <div class="columns-section">
                        <v-data-table
                            class="mt-4"
                            hide-default-footer
                            :headers="columnHeaders"
                            :items="table.columns"
                        >
                            <template v-slot:item="{ item }">
                                <tr>
                                    <td><strong>{{ item.name }}</strong></td>
                                    <td>{{ item.type }}{{ item.length ? `(${item.length})` : '' }}</td>
                                    <td>{{ item.notnull ? 'NO' : 'YES' }}</td>
                                    <td>{{ item.default || 'NULL' }}</td>
                                    <td>{{ item.autoincrement ? 'Yes' : 'No' }}</td>
                                </tr>
                            </template>
                        </v-data-table>
                    </div>

                    <div v-if="table.foreignKeys.length" class="foreign-keys-section">
                        <span class="header-1 d-flex justify-center">Внешние ключи</span>
                        <v-chip
                            v-for="fk in table.foreignKeys"
                            :key="fk.name"
                            variant="text"
                            class="ma-1"
                        >
                            • {{ table.name }}.{{ fk.localColumns.join(', ') }} → {{ fk.foreignTable }}.{{ fk.foreignColumns.join(', ') }}
                        </v-chip>
                    </div>
                </div>
            </div>
        </div>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'

const schema = ref([])
const loading = ref(false)
const error = ref(null)

const columnHeaders = [
    { title: 'Name', key: 'name', width: '25%', sortable: false },
    { title: 'Type', key: 'type', width: '20%', sortable: false },
    { title: 'Nullable', key: 'notnull', width: '15%', sortable: false },
    { title: 'Default', key: 'default', width: '25%', sortable: false },
    { title: 'Auto Increment', key: 'autoincrement', width: '15%', sortable: false },
]

const loadSchema = async () => {
    loading.value = true
    error.value = false

    try {
        const result = await api.get('/database/schema')
        if (result) {
            schema.value = result
        } else {
            error.value = result.error
        }
    } catch (err) {
        error.value = 'Failed to load database schema'
        console.error('Error loading schema:', err)
    } finally {
        loading.value = false
    }
}

// Lifecycle
onMounted(() => {
    loadSchema()
})
</script>

<style scoped>
.database-schema {
    padding: 20px;
}

.columns-table {
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0;
}

:deep(.v-table th) {
    background-color:var(--primary-color-yellow) !important;
}

.columns-table th,
.columns-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

.columns-table th {
    background-color: #f2f2f2;
}

.foreign-keys-section {
    margin-top: 15px;
}

.foreign-keys-section ul {
    list-style: none;
    padding: 0;
}

.foreign-keys-section li {
    padding: 5px;
    background: #e9f7fe;
    margin: 2px 0;
    border-radius: 4px;
}

.loading {
    text-align: center;
    padding: 20px;
    font-size: 18px;
}

.error {
    color: #d32f2f;
    text-align: center;
    padding: 20px;
    font-size: 18px;
    background: #ffebee;
    border-radius: 4px;
}
</style>
