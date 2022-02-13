<script>
    import { defineComponent, computed } from 'vue'
    import Datepicker from 'vue3-date-time-picker';
    import 'vue3-date-time-picker/dist/main.css'

    export default defineComponent({
        name: "Form",
        components: {Datepicker},
          props: {
                modelValue: {
                type: Object,
                default: () => {}
                },
            },

            emits: ['update:modelValue'],

            setup(props, { emit }) {
                const form = computed({
                get: () => props.modelValue,
                set: (value) => emit('update:modelValue', value),
                });

                return {
                form,
                };
            },

        data() {
            return {
                form: {
                    selected: '',
                    record: '',
                    date: null 
                }
            }
        },
        //expose: ['publicData'],
        methods: {
            handleChange(e) {
                // `event` implicitly has `any` type
                const col = this.form.selected
                const field = col === "clients" ? "username" : "name"
                var q = {[field] : e.target.value};
                this.axios.get("api/" + col + "/", {params: q})
                    .then((res) => {    
                        // Conversion from String to JSON object
                        this.$refs.recordsList.innerHTML = ""
                        var option
                        res.data[Object.keys(res.data)[0]].forEach(el => {
                            option = document.createElement("option")
                            option.setAttribute('value', el[field] + " id=" + el["_id"])
                            this.$refs.recordsList.append(option); // Matching title Object from the inventory, displayed with title and ID
                        })   
                    })    
                    .catch((errors) => {
                        console.log(errors);
                    })    
            },
            selectChange(e) {
                this.$refs.recordsList.innerHTML = ""
            }
        }
    })
</script>

<template>
    <form>
        <select v-model="form.selected" class="form-select" @change="selectChange">
            <option disabled value="">Please select one</option>
            <option value="clients">Client</option>
            <option value="inventory">Product</option>
            <option value="rental">Rental</option>
        </select>
        <input class="form-control" list="recordList" type="text" v-model="form.record" placeholder="Single Record" @keyup="handleChange" />
        <datalist ref="recordsList" id="recordList"></datalist>
        <!-- <input class="form-control" type="number" v-model="form.date" placeholder="Months" /> -->
        <Datepicker v-model="form.date" range :enableTimePicker="false" />
    </form>
</template>

<style lang="scss" scoped>
    form {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
        input, select {
            display: block;
        }
    }
    .dp__main {
        width: 100%;
    } 
    .dp__month_year_row {
        position: unset; // CSS fix for vue3-date-time-picker overlay
    }
</style>