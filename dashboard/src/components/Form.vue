<script>
    import { defineComponent, computed } from 'vue'
    import Datepicker from 'vue3-date-time-picker';
    import 'vue3-date-time-picker/dist/main.css'
    import { useCookies } from "vue3-cookies";

    export default defineComponent({
        name: "Form",
        components: {Datepicker},
        props: {
            col : '',
            modelValue: {
                type: Object,
                default: () => {}
            },
        },

        emits: ['update:modelValue'],

        setup(props, { emit }) {
            const { cookies } = useCookies();
            const form = computed({
                get: () => props.modelValue,
                set: (value) => emit('update:modelValue', value),
            });

            return {
            form, cookies
            };
        },
        mounted () {
            // Generate random ID
            if (col !== 'rental') {
                const randID = Date.now()
                this.$refs.recordsList.setAttribute('id', randID)
                this.$refs.recordsList.previousElementSibling.setAttribute('list', randID)
            }
        },
        data() {
            return {
                form: {
                    selected: '',
                    record: '',
                    date: null,
                    id: null
                }
            }
        },
        methods: {
            handleChange(e) {
                // `event` implicitly has `any` type
                const coll = this.col
                var field = coll === "clients" ? "username" : "name"
                if (coll === 'inventory/category') console.log(coll)
                var q = {[field] : e.target.value};
                console.log(q)
                this.axios.get("../api/" + coll + "/", {params: q, headers: {'auth': this.cookies.get('auth')}})
                    .then((res) => {    
                        // Conversion from String to JSON object
                        console.log(this.$refs.recordsList)
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
        <!-- <select v-model="form.selected" class="form-select" @change="selectChange">
            <option disabled value="">Please select one</option>
            <option value="clients">Client</option>
            <option value="inventory">Product</option>
            <option value="rental">Rental</option>
        </select> -->
        <select v-if="this.col === 'inventory/category'" class="form-select" aria-label=".form-select-lg example" v-model="form.category">
            <!-- <option selected>Open this select menu</option> -->
            <option value="Household">Household</option>
            <option value="Professional">Professional</option>
        </select>
        <select v-if="this.col === 'inventory/category'" class="form-select" aria-label=".form-select-lg example" v-model="form.choice">
            <!-- <option selected>Open this select menu</option> -->
            <option value="Incoming">Incoming</option>
            <option value="rental">N° of Rental</option>
            <option value="products">N° of Products</option>
        </select>
        <select v-if="this.col === 'clients'" class="form-select form-select" aria-label=".form-select-lg example" v-model="form.choice">
            <!-- <option disabled selected>Open this select menu</option> -->
            <option value="Incoming">Incoming</option>
            <option value="rental">N° of Rental</option>
        </select>
        <input v-if="this.col !== 'inventory/category' && this.col !== 'rental'" class="form-control" list="recordList" type="text" v-model="form.record" placeholder="Single Record" @keyup="handleChange" />
        <datalist ref="recordsList" id="recordList"></datalist>
        <select v-if="this.col === 'rental' || this.col === 'inventory'" class="form-select" aria-label=".form-select-lg example" v-model="form.choice">
            <option selected value="Incoming">Incoming</option>
            <option value="Deals">Deals</option>
            <option v-if="this.col === 'inventory'" value="Conditions">Conditions</option>
        </select>
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