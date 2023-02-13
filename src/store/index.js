import Vue from 'vue'
import Vuex from 'vuex'
import dataModule from '../modules/data.module'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        dataModule,
    } 
})