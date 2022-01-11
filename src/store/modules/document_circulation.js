import axios from '@/axios';
const state = () => ({
    documents: {
        data: [],
        params: {}
    },
    document: {
        data: [],
        messages: []
    }
})

const getters = {
    getDocuments: state => state.documents.data,
    getDocumentChat: state => state.documents.message,
}

const actions = {
    async fetchDocuments({ commit }, search) {
        try {
            const response = await axios.get('/documents/received', {
                params: {
                    search
                }
            })
            await commit('SET_DOCUMENTS_RECEIVED', response.data.data)
            return Promise.resolve(response)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },
    async answer({ commit }, payload) {
        try {
            let response = await axios.put(`documents/answer/${payload.id}`, {
                status: payload.status,
            });
            return Promise.resolve(response)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },
    async fetchChatMessage({ commit }, id) {
        try {
            const response = await axios.get(`/documents/chat/${id}`)
            commit('SET_DOCUMENT_MESSAGES', response.data.data)
            return Promise.resolve(response)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },
    async fetchSentDocuments({ commit }, search) {
        try {
            const response = await axios.get('/documents/sent', {
                params: {
                    search
                }
            })
            commit('SET_DOCUMENTS', response.data.data)
            return Promise.resolve(response)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },

    async fetchDocument({ commit }, id) {
        try {
            const response = await axios.get(`/documents/${id}`)
            commit('SET_DOCUMENT', response.data.data)
            return Promise.resolve(response)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },
    async createDocument({ dispatch }, body) {
        try {
            const response = await axios.post('/documents', body)
            // await dispatch('fetchDocuments')
            return Promise.resolve(response)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },
    async fetchMessages({ commit }, body) {
        try {
            const response = await axios.get('/document_chats', body)
            commit('SET_DOCUMENT', response.data.data)
            return Promise.resolve(response)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },
    async sendMessage({ dispatch }, body) {
        try {
            const response = await axios.post('/documents/chat', body)
            return Promise.resolve(response)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },
}

const mutations = {
    SET_DOCUMENTS: (state, document) => {
        state.documents.data = document
    },
    SET_DOCUMENT: (state, document) => {
        state.document.data = document
    },
    SET_DOCUMENT_MESSAGES: (state, messages) => {
        state.document.messages = messages
    },
    SET_DOCUMENTS_RECEIVED: (state, document) => {
        state.documents.data = document
    }
}
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}