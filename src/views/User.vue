<template>
  <v-container fluid>
    <v-dialog v-model="dialog" max-width="700px">
      <v-card>
        <v-card-title
          style="background-color: rgba(0, 128, 0, 0.79); color: whitesmoke"
          class="mb-4"
        >
          <h4>{{ this.user.id ? "Edit" : "Add" }} User</h4>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="user.username"
            dense
            outlined
            label="Username"
            placeholder="set username"
          >
          </v-text-field>
          <v-text-field
            v-model="user.full_name"
            dense
            outlined
            label="Full name"
            placeholder="set full name"
          >
          </v-text-field>
          <v-text-field
            v-model="user.password"
            type="password"
            dense
            outlined
            label="Password"
            placeholder="set password"
          >
          </v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="success" @click="saveUser">{{
            user.id ? "Edit" : "Add"
          }}</v-btn>
          <v-btn text color="error" @click="dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <template>
      <v-card>
        <v-card-title>
          Users
          <v-spacer></v-spacer>
          <v-btn class="success" v-if="rules.users_add" small @click="showAddDialog">
            <v-icon class="mr-3">mdi-plus-circle</v-icon> add
          </v-btn>
        </v-card-title>
        <v-row class="px-4">
          <v-col cols="2">
            <v-text-field
              v-model="search"
              label="Izlash..."
              placeholder="Izlash..."
              @keyup.enter="getUser"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-data-table :headers="header" :items="users" hide-default-footer>
          <template #item.active="{ item }">
            <v-switch
              fluid
              @click="updateActiveUser(item.id)"
              v-model="item.active"
              color="success"
            ></v-switch>
          </template>
          <template #item.actions="{ item }">
            <v-btn color="warning" icon @click="showEditDialog(item)">
              <v-icon color="danger">mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon color="error" @click="deleteUser(item.id)">
              <v-icon color="error">mdi-delete</v-icon>
            </v-btn>
            <v-btn icon color="error" @click="getUserRules(item.id)">
              <v-icon color="success">mdi-key-variant</v-icon>
            </v-btn>
          </template>
        </v-data-table>
        <v-dialog
          transition="dialog-bottom-transition"
          max-width="900"
          persistent
          v-model="dialogg"
        >
          <template v-slot:default="dialog">
            <v-card>
              <v-toolbar color="primary" dark>User rules</v-toolbar>
              <v-card-text class="text-center">
                <v-row class="pa-2 ma-0">
                  <v-col cols="5" class="text-left pa-0">
                    <h3
                      class="bg-dark text-center pa-2 mb-3"
                      style="background-color: #ff5252"
                    >
                      Unattached
                    </h3>
                    <v-text-field
                      dense
                      outlined
                      class="px-3"
                      placeholder="search"
                    ></v-text-field>
                    <v-data-table
                      dense
                      hide-default-footer
                      v-model="ruleToAttach"
                      :items="allRules"
                      :headers="ruleHeaders"
                      show-select
                    >
                    </v-data-table>
                    {{ ruleToAttach }}
                  </v-col>
                  <v-col cols="2">
                    <div class="text-xs-center">
                      <v-btn
                        size="70"
                        icon
                        color="success"
                        :disabled="ruleToAttach.length < 1"
                        @click="attachRule"
                        ><v-icon size="50"
                          >mdi-arrow-right-bold-box</v-icon
                        ></v-btn
                      >
                      <v-spacer class="py-2"></v-spacer>
                      <v-btn
                        size="70"
                        icon
                        @click="unAttachRule"
                        color="error"
                        :disabled="ruleToNotAttach.length < 1"
                        ><v-icon style="transform: rotate(180deg)" size="50"
                          >mdi-arrow-right-bold-box</v-icon
                        ></v-btn
                      >
                    </div>
                  </v-col>
                  <v-col cols="5" class="text-left pa-0">
                    <h3
                      class="bg-dark text-center pa-2 mb-3"
                      style="background-color: #4caf50"
                    >
                      Attached
                    </h3>
                    <v-text-field
                      dense
                      outlined
                      class="px-3"
                      placeholder="search"
                    ></v-text-field>
                    <v-data-table
                      dense
                      hide-default-footer
                      v-model="ruleToNotAttach"
                      :items="userRules"
                      :headers="ruleHeaders"
                      show-select
                    >
                    </v-data-table>
                    {{ ruleToNotAttach }}
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn text @click="closeRuleDialog">Close</v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </v-card>
    </template></v-container
  >
</template>

<script>
import axios from "@/axios";
import { mapGetters } from "vuex";

export default {
  name: "User",
  data() {
    return {
      dialog: false,
      dialogg: false,
      search: "",
      activeUserId: "",
      ruleToAttach: [],
      ruleToNotAttach: [],
      ruleHeaders: [
        {
          text: "ID",
          value: "id",
        },
        {
          text: "Title",
          value: "title",
        },
      ],
      user: {
        id: "",
        full_name: "",
        username: "",
        password: "",
        active: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      userData: "login/getUserData",
      users: "users/getUsers",
      userRules: "rule/getUserRules",
      allRules: "rule/getAllRules",
      header: "users/tableHeard",
      rules: "users/getUserRules",
    }),
  },
  created() {
    this.$store.dispatch("login/fetchUser");
    this.$store.dispatch("users/fetchUsers");
  },
  methods: {
    async getUserRules(id) {
      try {
        this.activeUserId = id;
        await this.$store.dispatch("rule/fetchUserRules", { id });
        await this.$store.dispatch("rule/fetchAllRules", { id });
        this.dialogg = true;
      } catch (error) {}
    },
    closeRuleDialog() {
      this.ruleToAttach = [];
      this.ruleToNotAttach = [];
      this.dialogg = 0;
    },
    async updateActiveUser(id) {
      try {
        const response = await this.$store.dispatch(`users/updateActive`, id);
        this.user.active = response.data.data.active;
        this.$toast.success(response.data.message);
      } catch (error) {
        this.$toast.error(response.data.message);
      }
    },
    showAddDialog() {
      this.user = {
        id: "",
        username: "",
        full_name: "",
        password: "",
      };
      this.dialog = true;
    },
    showEditDialog(item) {
      this.user = { ...item };
      this.dialog = true;
    },
    async deleteUser(id) {
      try {
        const response = await this.$store.dispatch(`users/deleteUser`, id);
        this.$toast.success(response.data.message);
      } catch (error) {
        this.$toast.error(response.data.message);
      }
    },
    async getUser() {
      try {
        const response = await this.$store.dispatch(
          "users/fetchUsers",
          this.search
        );
      } catch (error) {
        this.$toast.error(Object.values(error.data.message)[0][0]);
      }
    },
    async saveUser() {
      if (this.user.id) {
        try {
          const response = await this.$store.dispatch(
            "users/updateUser",
            this.user
          );
          this.dialog = false;
          this.$toast.success(response.data.message);
        } catch (error) {
          this.$toast.error(error.data.message);
        }
      } else {
        try {
          const response = await this.$store.dispatch(
            "users/createUser",
            this.user
          );
          this.dialog = false;
          this.$toast.success(response.data.message);
        } catch (error) {
          this.$toast.error(error.data.message);
        }
      }
    },
    async attachRule() {
      try {
        let rule_id = [];
        this.ruleToAttach.forEach((element, key) => {
          rule_id.push(element.id);
        });
        const response = await this.$store.dispatch("rule/attachRule", {
          user_id: this.activeUserId,
          rule_id,
        });
        this.ruleToAttach = [];
        this.ruleToNotAttach = [];
        this.$toast.success(response.data.message);
      } catch (error) {
        this.$toast.error(error.data.message);
      }
    },
    async unAttachRule() {
      try {
        let rule_id = [];
        this.ruleToNotAttach.forEach((element, key) => {
          rule_id.push(element.id);
        });
        const response = await this.$store.dispatch("rule/unAttachRule", {
          user_id: this.activeUserId,
          rule_id,
        });
        this.ruleToAttach = [];
        this.ruleToNotAttach = [];
        this.$toast.success(response.data.message);
      } catch (error) {
        this.$toast.error(error.data.message);
      }
    },
  },
};
</script>

<style >
.bg-dark {
  color: whitesmoke !important;
  background-color: #404040b0;
}
.bg-dark {
  color: whitesmoke !important;
  background-color: #404040b0;
}
.bg-danger {
  color: whitesmoke !important;
  background-color: #404040b0;
}
.v-autocomplete__content .v-list-item--active {
  background-color: whitesmoke !important;
}
/* .groupMenu .v-list-item--active {
  background-color: rgba(95, 159, 185, 0.466) !important;
  color: rgb(245, 245, 245);
} */

/* .v-groupMenu .primary--text {
  color: whitesmoke !important;
  caret-color: #1976d2 !important;
} */
</style>