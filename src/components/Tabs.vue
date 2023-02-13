<template>
    <div class="tabs-wrapper">
            <button @click="changeFilterParameter(option, type)" :class="[(type == 'currency' && option == defaultCurrency) || ((filterYears.length === 0 && type == 'year') || (filterYears.includes(option) && type == 'year')) || (type == 'display' && option == defaultDisplay) ? 'btn btn-light active' : 'btn btn-light']" type="button" v-for="option, index  in options" :key="index">
                <span v-if="type == 'year'">{{ option }} YRS</span>
                <span v-else>{{ option }}</span>
            </button>
    </div>
</template>


<script>
import { SET_DEFAULT_CURRENCY, SET_DEFAULT_DISPLAY, SET_FILTER_YEARS } from "../store/mutations.type";
import { FILTER_DATA } from "../store/actions.type";

export default {
    name: 'TabsComponent',
    computed: {
        defaultCurrency(){
            return this.$store.getters.defaultCurrency
        },
        defaultDisplay(){
            return this.$store.getters.defaultDisplay
        },
        filterYears(){
            return this.$store.getters.filterYears
        },
        years(){
            return this.$store.getters.years
        },
    },
    mounted: function (){
        
    },
    props: {
        options: {
            default: []
        },
        type: {
            default: ''
        }
    },
    methods: {
        changeFilterParameter(value, type){
            if(type == 'currency'){
                this.$store.commit(SET_DEFAULT_CURRENCY, value)
            }else if(type == 'display'){
                this.$store.commit(SET_DEFAULT_DISPLAY, value)
            }else if(type == 'year'){
                let newYears = [...this.filterYears]
                
                if(!newYears.includes(value)){
                    newYears.push(value)
                }else{
                    newYears = newYears.filter(year => {
                        return year != value
                    })
                }
                
                this.$store.commit(SET_FILTER_YEARS, newYears)
            }

            this.$store.dispatch(FILTER_DATA)
        }
    }
}




</script>

<style scoped lang="scss">
.tabs-wrapper{
    button{
        margin: 10px;

        span{
            font-size: 13px;
        }
    }
    .active{
        color: #fff;
        background-color: #3B5F9C;
    }
}
</style>