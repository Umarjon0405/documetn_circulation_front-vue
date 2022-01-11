import axios from '@/axios';
const tableHeader =[
    {
        text: "Id",
        value: "id",
        class: "bg-dark title"
    },
    {
        text: "title",
        value: "title",
        class: "bg-dark title"
    },
    {
        text: "active",
        value: "active",
        class: "bg-dark title"
    },
    {
        text: "Amallar",
        value: "actions",
        class: "bg-dark title"
    },
]
const state = () => ({
    types: {
        data:[]
    },
    typesActive: {
        data:[]
    }
})

const getters = {
    getTypes: state => state.types.data,
    getTableHeader: () => tableHeader,
    getActive: state => state.typesActive.data
}

const actions = {
    async fetchTypes ({commit}, ) {
        try {
            const response = await axios.get('/types')
            commit('SET_TYPE', response.data)
            return Promise.resolve(response)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },
    async fetchActiveTypes ({commit}, ) {
        try {
            const response = await axios.get('/types/active')
            commit('SET_ACTIVE_TYPE', response.data)
            return Promise.resolve(response)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },
    async createType({dispatch}, body) {
        try {
            const response = await axios.post('/types', body)
            await dispatch('fetchTypes')
            return Promise.resolve(response)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },
    async editType({dispatch}, body) {
        try {
            const response = await axios.put(`/types/${body.id}`, body)
            await dispatch('fetchTypes')
            return Promise.resolve(response)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },
    async deleteType({dispatch}, body) {
        try {
            const response = await axios.delete(`/types/${body}`)
            await dispatch('fetchTypes')
            return Promise.resolve(response)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },
}

const mutations = {
    SET_TYPE: (state, type) => {
        state.types.data=type
    },
    SET_ACTIVE_TYPE: (state, type) => {
        state.typesActive.data=type
    }
  
}
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}