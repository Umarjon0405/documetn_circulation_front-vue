import axios from '@/axios';


const state = () => ({
    users: {
        data:[]
    },
    user: {
        
    }
})

const getters = {
    getUsers: state => state.users.data,
    getUserRules: state => state.user.rules,
    tableHeard() {
        return [
            {
                text: "Id",
                value: "id",
                class: "bg-dark title"
            },
            {
                text: "Ismi",
                value: "full_name",
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
    }
}

const actions = {
    async fetchUsers({ commit }, search) {
        try {
            const response = await axios.get('/users', {
                params: {
                    search:search
                }
            })
            commit("SET_USERS", response.data)
            return Promise.resolve(response)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },
    async fetchUser({ commit }) {
        try {
            const response = await axios.get('/users/auth_user')
            commit("SET_USER", response.data)
            return Promise.resolve(response)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },
    async createUser({ dispatch }, body) {
        try {
            const response = await axios.post('/users', {
                ...body
            })
            await dispatch("fetchUsers",)
            return Promise.resolve(response)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },
    async updateUser({ dispatch }, user) {
        try {
            const response = await axios.put(`/users/${user.id}`, user.formData)
            await dispatch("fetchUsers",)
            return Promise.resolve(response)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },
    async updateActive({ dispatch }, id) {
        try {
            const response = await axios.put(`/users/update_active/${id}`)
            await dispatch("fetchUsers")
            return Promise.resolve(response)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },
    async deleteUser({ dispatch }, id) {
        try {
            const response = await axios.delete(`/users/${id}`)
            await dispatch("fetchUsers")
            return Promise.resolve(response)
        } catch (error) {
            return Promise.reject(error.response)
        }
    },
   
}

const mutations = {
    SET_USERS: (state, user) => {
        state.users.data= user
    },
    SET_USER: (state, user) => {
        state.user = user
    }
  
}
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}