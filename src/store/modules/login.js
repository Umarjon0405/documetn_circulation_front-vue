import axios from '@/axios';

const state = () => ({
    user: {
        data:[]
    },
    data: {
        overlay:false
    }
})

const getters = {
    getUserData: state => state.user.data,
}

const actions = {
    async fetchUser({ commit }) {
        try {
            const response = await axios.get('/users/auth_user')
            commit("SET_USER", response.data)
            return Promise.resolve(response)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },
    async fetchLogin({ commit }, body) {
        body.grant_type = process.env.VUE_APP_GRANT_TYPE
        body.client_secret = process.env.VUE_APP_CLIENT_SECRET
        body.client_id = process.env.VUE_APP_CLIENT_ID
        try {
            const response = await axios.post(process.env.VUE_APP_OAUTH_URL, {
                ...body
            })
            commit('SET_TOKEN', response.data)
            return Promise.resolve()
        } catch (error) {
            return Promise.reject()
        }
    }
}

const mutations = {
    SET_USER: (state, user) => {
        state.user.data= user
    },
    SET_TOKEN: (state,data) => {
        localStorage.access_token = data.access_token
    },
    SET_OVERLAY: (state, value) => {
        state.data.overlay = value
    },
}
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}