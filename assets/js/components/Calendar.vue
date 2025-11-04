<template>
    <div class="calendar">
        <div class="header">
            <button @click="prev">
                <v-icon>mdi-menu-left</v-icon>
            </button>
            <span>{{ month }} {{ year }}</span>
            <button @click="next">
                <v-icon>mdi-menu-right</v-icon>
            </button>
        </div>

        <div class="weekdays">
            <div v-for="d in days" :key="d" class="day-name">{{ d }}</div>
        </div>

        <div class="days">
            <div
                v-for="(d, i) in allDays"
                :key="i"
                :class="[
          'day',
          {
            other: d && d.getMonth() !== currentMonth,
            today: isToday(d),
            selected: isSelected(d)
          }
        ]"
                @click="select(d)"
            >
                {{ d ? d.getDate() : '' }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Calendar',

    props: {
        date: String,
        language: {
            type: String,
            default: 'ru'
        },
    },

    data() {
        return {
            current: new Date(),
            picked: null,
            texts: {
                ru: {
                    months: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июнь','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
                    days: ['Пн','Вт','Ср','Чт','Пт','Сб','Вс']
                },
                en: {
                    months: ['January','Februrary','March','April','May','June','July','August','September','October','November','December'],
                    days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
                }
            }
        }
    },

    computed: {
        year() {
            return this.current.getFullYear()
        },
        currentMonth() {
            return this.current.getMonth()
        },
        month() {
            return this.texts[this.language].months[this.currentMonth]
        },
        days() {
            return this.texts[this.language].days
        },
        allDays() {
            const first = new Date(this.year, this.currentMonth, 1)
            const last = new Date(this.year, this.currentMonth + 1, 0)

            const startDay = (first.getDay() + 6) % 7
            const daysInMonth = last.getDate()

            const result = []

            const prevMonth = new Date(this.year, this.currentMonth, 0)
            const prevDays = prevMonth.getDate()
            for (let i = startDay - 1; i >= 0; i--) {
                result.push(new Date(this.year, this.currentMonth - 1, prevDays - i))
            }

            for (let i = 1; i <= daysInMonth; i++) {
                result.push(new Date(this.year, this.currentMonth, i))
            }

            const needed = 42 - result.length
            for (let i = 1; i <= needed; i++) {
                result.push(new Date(this.year, this.currentMonth + 1, i))
            }

            return result
        }
    },

    mounted() {
        if (this.date) {
            const [y, m, d] = this.date.split('-')
            this.current = new Date(y, m - 1, 1)
            this.picked = new Date(y, m - 1, d)
        } else {
            const today = new Date()
            this.current = new Date(today.getFullYear(), today.getMonth(), 1)
            this.picked = today
        }
    },

    methods: {
        prev() {
            this.current = new Date(this.year, this.currentMonth - 1, 1)
        },

        next() {
            this.current = new Date(this.year, this.currentMonth + 1, 1)
        },

        select(d) {
            if (!d) return
            this.picked = d

            if (d.getMonth() !== this.currentMonth) {
                this.current = new Date(d.getFullYear(), d.getMonth(), 1)
            }

            const dateStr = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`
            this.$emit('select', dateStr)
        },

        isToday(d) {
            if (!d) return false
            const today = new Date()
            return d.getDate() === today.getDate() &&
                d.getMonth() === today.getMonth() &&
                d.getFullYear() === today.getFullYear()
        },

        isSelected(d) {
            if (!d || !this.picked) return false
            return d.getDate() === this.picked.getDate() &&
                d.getMonth() === this.picked.getMonth() &&
                d.getFullYear() === this.picked.getFullYear()
        }
    }
}
</script>

<style>
.calendar {
    width: 300px;
    border: 1px solid grey;
    padding: 10px;
}

.header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.header button {
    cursor: pointer;
}

.weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin-bottom: 5px;
}

.day-name {
    text-align: center;
    font-weight: bold;
    font-size: 12px;
}

.days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
}

.day {
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}


.day.selected {
    border: 2px solid cadetblue;
}
</style>
