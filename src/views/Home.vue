<template>
    <div class="home-wrapper">
        <div class="container">
            <div class="row align-left">
                <div class="col-md-3">
                    <Tabs :options="currencies" type="currency"/>
                </div>
                <div class="col-md-6">
                    <Tabs :options="years" type="year"/>
                </div>
                <div class="col-md-3">
                    <Tabs :options="displays"  type="display"/>
                </div>
            </div>

            <div class="row align-left">
                <div class="col-md-12">
                    <form action="">
                        <input class="form-control" type="text" placeholder="Filter by company name..." v-model="search">
                    </form>
            </div>

            </div>
            <div class="row">
                <table class="table">
                    <thead>
                        <tr>
                        <th scope="col" @click="sortList('DateSent')" class="sortable-column">DATE SENT</th>
                        <th scope="col" @click="sortList('Company')" class="sortable-column">COMPANY</th>
                        <th scope="col" v-for="year in years" :key="year">
                            <td class="year-cell">
                                {{ year }} YRS
                            </td>
                            <td><span v-for="couponType in couponTypes" :key="couponType">{{ couponType }} &nbsp;</span></td>
                        </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="data in filteredData" :key="data.Id">
                            <td><img @click="showMoreData(data.Id)" src="../assets/down-arrow.png" alt="Bottom Arrow" class="arrow-icon" v-if="data.Quote">{{ data.DateSent | formatDate }}</td>
                            <td>{{ data.Company }}</td>
                            <td v-for="year in years" :key="year" class="v-year">
                                <div class="year-wrapper">
                                    <span v-for="quote, index in data.Quote" :key="index" class="v-quote">
                                    <div v-for="couponType, index in couponTypes" :key="index" class="v-coupon">
                                        <span v-if="year == quote.Years && couponType == quote.CouponType && (defaultDisplay == 'Spread' || (showRow && idToShow == data.Id) && defaultDisplay != 'Spread')" class="spread">{{ quote.Spread | formatSpread}} &nbsp;</span>
                                        <span v-if="year == quote.Years && couponType == quote.CouponType && (defaultDisplay == 'Yield' || (showRow && idToShow == data.Id) && defaultDisplay != 'Yield')">{{ quote.Yield | formatYield }} &nbsp;</span>
                                        <span v-if="year == quote.Years && couponType == quote.CouponType && (defaultDisplay == '3MLSpread' || (showRow && idToShow == data.Id) && defaultDisplay != '3MLSpread')">{{ quote['3MLSpread'] | formatSpread }} &nbsp;</span>
                                    </div>
                                    
                                </span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                            <td>Average by {{ defaultDisplay }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>


<script>
import { GET_TABLE_DATA } from '@/store/actions.type';
import Tabs from '@/components/Tabs';
import { SET_FILTERED_DATA, SET_ID, SET_SHOW_ROW } from "../store/mutations.type";

export default {
    name: 'HomeComponent',
    components: {
        Tabs
    },
    data() {
     return {
        search: '',
        sortedbyASC: true,
     }
    },
    computed: {
        tableData(){
            return this.$store.getters.tableData
        },
        filteredData(){
            return this.$store.getters.filteredData
        },
        years(){
            return this.$store.getters.years
        },
        currencies(){
            return this.$store.getters.currencies
        },
        displays(){
            return this.$store.getters.displays
        },
        couponTypes(){
            return this.$store.getters.couponTypes
        },
        defaultDisplay(){
            return this.$store.getters.defaultDisplay
        },
        showRow(){
            return this.$store.getters.showRow
        },
        idToShow(){
            return this.$store.getters.idToShow
        },
    },
    watch: {
    // whenever search changes, this function will run
    search() {
        if(this.search != '' && this.search.length > 2){
            let filteredItems = this.filteredData.filter(item => {
                return item.Company.toLowerCase().indexOf(this.search.toLowerCase()) > -1
            })
            this.$store.commit(SET_FILTERED_DATA, filteredItems)
        }else{
            this.$store.dispatch(GET_TABLE_DATA)
        }
        
    }
  },
    mounted: function (){
        this.$store.dispatch(GET_TABLE_DATA)
    },
    methods: {
        sortList(sortBy) {
            if (this.sortedbyASC) {
                this.filteredData.sort((x, y) => (x[sortBy] > y[sortBy] ? -1 : 1));
                this.sortedbyASC = false;
            } else {
                this.filteredData.sort((x, y) => (x[sortBy] < y[sortBy] ? -1 : 1));
                this.sortedbyASC = true;
            }
        },
        showMoreData(companyId){
            if(this.idToShow != companyId){
                this.$store.commit(SET_ID, companyId)
                this.$store.commit(SET_SHOW_ROW, true)
            }else{
                this.$store.commit(SET_SHOW_ROW, !this.showRow)
            } 
        }
    }
}




</script>

<style scoped lang="scss">
.align-left{
    text-align: left;
}

input[type=text]{
    margin: 10px;
    max-width: 400px;
}

.sortable-column{
    cursor: pointer;
}

.year-cell{
    display: table-row;
}

.v-year{
    text-align: left;
    padding-left: 20px;
    /*display: flex;*/
}

.year-wrapper{
    display: flex;
}

.v-coupon {
    display: flex;
    flex-direction: column;
}

.arrow-icon{
    margin-right: 5px;
    cursor: pointer;
}

// .spread{
//     display: table-row;
// }
</style>