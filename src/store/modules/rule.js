import axios from '@/axios';
const state = () => ({
    data: {
        userRule:[],
        allRule:[],
    }
})

const getters = {
    getUserRules: state => state.data.userRule.data,
    getAllRules: state => state.data.allRule.data
}

const actions = {
    async fetchUserRules ({commit}, body) {
        try {
            const response = await axios.get('/rules/get_user_rule', {
                params: {
                    user_id:body.id
                }
            })
            commit('SET_USER_RULES', response.data)
            return Promise.resolve(response)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },
    async fetchAllRules ({commit}, body) {
        try {
            const response = await axios.get('/rules/get_all_rule', {
                params: {
                    user_id: body.id
                }
            })
            commit('SET_ALL_RULES', response.data)
            return Promise.resolve(response)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },
    async unAttachRule ({dispatch}, body) {
        try {
            const response = await axios.post('/rules/un_attach_rule', {
                ...body
            })
            await dispatch("fetchUserRules", { id: body.user_id })
            await dispatch("fetchAllRules", {id:body.user_id})
            return Promise.resolve(response)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },

    async attachRule ({dispatch}, body) {
        try {
            const response = await axios.post('/rules/attach_rule', {
                ...body
            })
            await dispatch("fetchAllRules", {id:body.user_id})
            await dispatch("fetchUserRules",  {id:body.user_id})
            return Promise.resolve(response)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },
}

const mutations = {
    SET_USER_RULES: (state, rules) => {
        state.data.userRule=rules
    },
    SET_ALL_RULES: (state, rules) => {
        state.data.allRule=rules
    },
}
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}