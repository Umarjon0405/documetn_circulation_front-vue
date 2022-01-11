import Vue from 'vue'
import Vuex from 'vuex'
import login from "./modules/login"
import users from "./modules/users"
import types from "./modules/types"
import document_circulation from "./modules/document_circulation"
import received_document from "./modules/received_document"
import sent_document from "./modules/sent_document"
import rule from "./modules/rule"

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    login,
    users,
    types,
    rule,
    document_circulation,
    received_document,
    sent_document
  }
})

