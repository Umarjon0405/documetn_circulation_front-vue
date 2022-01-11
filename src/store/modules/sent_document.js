import axios from '@/axios';
const state = () => ({
    data: {
        meta: {
            current_page: 1
        }
    },
    params: {
        url: 'documents/sent?page=',
        body: {},
        method: 'get'
    },

})

const getters = {
    getDocuments: state => state.data.data,
    getCurrentPage: state => state.data.meta.current_page
}

const actions = {
    async fetchDocuments({ commit }, params) {
        try {
            let response = await axios[params.method](params.url + params.pageNumber, params.body)
            commit('SET_DOCUMENTS', response.data)
            state.params = Object.assign({}, params);
            commit('SET_CURRENT_PAGE', response.data.meta.current_page);
            return Promise.resolve(response)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },
}

const mutations = {
    // SET_DOCUMENTS: (state, document) => {
    //     state.documents = document
    // },
    SET_DOCUMENTS: (state, data) => state.data = data,
    SET_CURRENT_PAGE: (state, data) => state.data.meta['current_page'] = data,


}
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}