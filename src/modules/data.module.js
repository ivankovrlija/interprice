import { GET_TABLE_DATA, GET_TABS, FILTER_DATA, CALCULATE_AVERAGE } from "../store/actions.type";
import { SET_TABLE_DATA, SET_YEARS, SET_CURRENCIES, SET_DEFAULT_CURRENCY, SET_DEFAULT_DISPLAY, SET_FILTER_YEARS, SET_FILTERED_DATA, SET_ID, SET_SHOW_ROW, SET_AVERAGE_DATA } from "../store/mutations.type";

export const state = {
    tableData: [],
    years: [5, 10, 12],
    currencies: ['USD', 'EUR', 'CAD'],
    displays: ['Spread', 'Yield', '3MLSpread'],
    couponTypes: ['FIX', 'FRN'],
    defaultCurrency: 'USD',
    defaultDisplay: 'Spread',
    filterYears: [],
    filteredData: null,
    showRow: false,
    idToShow: null,
    averageData: null
}

export const actions = {
    [GET_TABLE_DATA](context){
        let jsonData = require('../../data.json')
        context.dispatch(GET_TABS, jsonData.Items)
        context.commit(SET_TABLE_DATA, jsonData.Items)
        context.dispatch(FILTER_DATA)
        context.dispatch(CALCULATE_AVERAGE)
    },
    [GET_TABS](context, jsonData){
        let years = [];
        let currencies = [];

        jsonData.forEach(element => {
            if(element.Quote){
                element.Quote.forEach(item => {
                    if(!years.includes(item.Years)){
                        years.push(item.Years)
                    }

                    if(!currencies.includes(item.Currency)){
                        currencies.push(item.Currency)
                    }
                });
            }
        });


        context.commit(SET_YEARS, years.sort((a,b) => a-b))
        context.commit(SET_CURRENCIES, currencies)
    },
    [FILTER_DATA]({commit, state}){
        let currency = state.defaultCurrency
        let years = state.filterYears.length == 0 ? state.years : state.filterYears
        let currentData = JSON.parse(JSON.stringify([...state.tableData]));
        let filteredData = []


        // filter by parameters
         currentData.forEach(company => {
            let quotes = []
            if(company.Quote){
                company.Quote.forEach(item => {
                    if(item.Currency == currency && years.includes(item.Years)){
                        quotes.push(item)
                        if(!filteredData.includes(company)){
                            company.Quote = quotes
                            filteredData.push(company)
                        }
                    }
                });
                
            }
        });

        // add rows without quote
        filteredData = filteredData.concat(currentData.filter((item) => filteredData.indexOf(item) < 0))

        //sort filtered data by DateSent or Preffered
        filteredData.sort((a, b)=> {
            if (a.DateSent === b.DateSent){
              return a.Preferred > b.Preferred ? -1 : 1
            } else {
              return a.DateSent > b.DateSent ? -1 : 1
            }
          })

        console.log(filteredData)

        commit(SET_FILTERED_DATA, filteredData)
    },
    [CALCULATE_AVERAGE]({commit, state}){
        let currency = state.defaultCurrency
        let displays = state.displays
        let years = state.filterYears.length == 0 ? state.years : state.filterYears
        let currentData = JSON.parse(JSON.stringify([...state.filteredData]));
        let averageData = []
        averageData['Spread'] = []
        averageData['Yield'] = []
        averageData['3MLSpread'] = []


        // filter by parameters
         years.forEach(year => {
            currentData.forEach(company => {
                if(company.Quote){
                    company.Quote.forEach(item => {
                        if(item.Currency == currency && years.includes(item.Years) && year == item.Years){

                            displays.forEach(display => {
                                if(year in averageData[display]){
                                    averageData[display][year] += item[display]
                                }else{
                                    averageData[display][year] = item[display]
                                }
                            })
                        }
                    });
                    
                }
            });
         })

        console.log(averageData)

        commit(SET_AVERAGE_DATA, averageData)
    },
}

export const mutations = {
    [SET_TABLE_DATA](state, jsonData){
        state.tableData = jsonData
    },
    [SET_YEARS](state, years){
        state.years = years
    },
    [SET_CURRENCIES](state, currencies){
        state.currencies = currencies
    },
    [SET_DEFAULT_CURRENCY](state, defaultCurrency){
        state.defaultCurrency = defaultCurrency
    },
    [SET_DEFAULT_DISPLAY](state, defaultDisplay){
        state.defaultDisplay = defaultDisplay
    },
    [SET_FILTER_YEARS](state, filterYears){
        state.filterYears = filterYears
    },
    [SET_FILTERED_DATA](state, data){
        state.filteredData = data
    },
    [SET_SHOW_ROW](state, data){
        state.showRow = data
    },
    [SET_ID](state, data){
        state.idToShow = data
    },
    [SET_AVERAGE_DATA](state, data){
        state.averageData = data
    },
}

const getters = {
    tableData(state){
        return state.tableData
    },
    years(state){
        return state.years
    },
    currencies(state){
        return state.currencies
    },
    displays(state){
        return state.displays
    },
    couponTypes(state){
        return state.couponTypes
    },
    defaultCurrency(state){
        return state.defaultCurrency
    },
    defaultDisplay(state){
        return state.defaultDisplay
    },
    filterYears(state){
        return state.filterYears
    },
    filteredData(state){
        return state.filteredData
    },
    showRow(state){
        return state.showRow
    },
    idToShow(state){
        return state.idToShow
    },
    averageData(state){
        return state.averageData
    },
}

export default {
    state,
    actions,
    mutations,
    getters
}