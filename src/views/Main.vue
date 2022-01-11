<template>
  <v-app id="inspire">
    <v-dialog v-model="dialog" width="500" persistent>
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Update Profile
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field
              dense
              outlined
              v-model="authuser.full_name"
              label="Full name"
              placeholder="set full name"
            ></v-text-field>
            <v-text-field
              dense
              outlined
              v-model="authuser.username"
              label="Username"
              placeholder="set user name"
            ></v-text-field>
            <v-text-field
              dense
              v-model="authuser.password"
              outlined
              label="Password"
              placeholder="set Password"
            ></v-text-field>
            <v-file-input
              show-size
              dense
              v-model="authuser.img"
              accept=".jpg,.png,.jpeg"
              counter
              label="Photo"
            ></v-file-input>
          </v-container>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="cancelUpdateDialog"> Cancel </v-btn>
          <v-btn
            color="primary"
            text
            :disabled="
              authuser.full_name.length < 1 ||
              authuser.username.length < 1 ||
              authuser.password.length < 1
            "
            @click="updateProfile"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="imageDialogg" width="500">
     <v-card>
      <div class="d-flex flex-column justify-space-between align-center container">
        <v-slider
          v-model="width"
          class="align-self-stretch"
          min="200"
          max="500"
          step="1"
        ></v-slider>

        <v-img
          :aspect-ratio="1"
          :width="width"
          :src="file_env + imageProfile"
        ></v-img>
      </div>
     </v-card>
    </v-dialog>
    <v-navigation-drawer app v-model="drawer">
      <v-list>
        <v-list-item style="height: 20px">
          <v-list-item-icon
            style="
              width: 20%;
              cursor: pointer;
              align-items: center;
              align-self: center;
              display: flex;
            "
          >
            <v-img
              v-if="userData.img"
              contain
              @click="imageDialog(userData.img)"
              class="grey lighten-2 profile_img"
              :aspect-ratio="100 / 100"
              :src="file_env + userData.img"
            >
            </v-img>

            <v-icon
              v-if="!userData.img"
              size="50"
              color="dark"
              class="text-wrap title_list"
              >mdi-account-tie</v-icon
            >
            <v-hover v-slot="{ hover }" open-delay="200">
              <v-icon
                @click="showEditDialog()"
                :elevation="hover ? 40 : 2"
                :class="{ 'on-hover': hover }"
                size="20"
                color="success"
                class="title_list"
                >mdi-fountain-pen-tip</v-icon
              >
            </v-hover>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-subtitle
              style="font-size: 20px"
              color="success"
              class="text-wrap title_list"
            >
              {{ userData.full_name }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list>
        <v-list-item
          class="list_item"
          v-for="item in filterItems"
          :key="item.id"
          v-if="item.one"
          :prepend-icon="item.icon"
          no-action
          :to="item.to"
        >
          <template>
            <v-list-item-icon size="8" tile>
              <v-icon class="" color="dark">{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content @click="selectedItem = item.title">
              <v-list-item-title class="navTitle text-wrap title_list">
                {{ item.title }}
              </v-list-item-title>
            </v-list-item-content>
          </template>
        </v-list-item>
        <v-list-group
          class="list_item groupMenu"
          v-for="item in filterItems"
          :key="item.id"
          no-action
          v-if="!item.one"
          :to="item.to"
        >
          <template v-slot:activator>
            <v-list-item-icon size="18" tile>
              <v-icon
                class=""
                style="background-color: unset !important"
                color="dark"
                >{{ item.icon }}</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content
              class="text-wrap navTitle color--text"
              @click="selectedItem = item.title"
            >
              <v-list-item-title class="text-wrap navTitlenavTitle title_list">
                {{ item.title }}
              </v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            class=""
            v-for="child in item.items"
            :to="child.to"
            :key="child.title"
          >
            <template>
              <v-list-item-icon size="8" tile>
                <v-icon
                  class=""
                  color="dark"
                  style="background-color: unset !important"
                  >{{ child.icon }}</v-icon
                >
              </v-list-item-icon>
              <v-list-item-content @click="selectedItem = child.title">
                <v-list-item-title
                  class="navTitle"
                  v-text="child.title"
                ></v-list-item-title>
              </v-list-item-content>
            </template>
          </v-list-item>
        </v-list-group>
        <v-list-item link @click="logout">
          <v-list-item-icon size="18" tile>
            <v-icon class="" color="white">mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="navTitle text-wrap title_list">
              Logout
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app class="app_bar" >
      <v-app-bar-nav-icon
        class="dark--text"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title class="navTitle">{{ selectedItem }}</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
    <v-overlay :value="$store.state.login.data.overlay" z-index="100000">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script>
import axios from "@/axios";
import NavigationDrawer from "../components/navigation-drawer";
import { mapGetters } from "vuex";

export default {
  name: "Main",
  components: { NavigationDrawer },
  data() {
    return {
      drawer: false,
      file_env: process.env.VUE_APP_FILE_URL,
      authuser: {
        full_name: "",
        id: "",
        username: "",
        password: "",
        img: "",
      },
      selectedItem: "",
      filterItems: [],
      menuItems: [
        {
          id: 1,
          to: "/",
          title: "Foydalanuvchilar",
          icon: "mdi-account-circle",
          one: "true",
        },
      ],
      groupItems: [
        {
          id: 1,
          to: "/",
          title: "Get started",
          icon: "mdi-home",
          one: true,
        },
        {
          id: 1,
          to: "/users",
          title: "Foydalanuvchilar",
          icon: "mdi-account-circle",
          rule: "users_show",
          one: true,
        },
        {
          id: 2,
          title: "Document",
          icon: "mdi-file",
          one: false,
          item: [
            {
              to: "/doc_send",
              title: "Send Document",
              icon: "mdi-file",
              rule: "document_show",
            },
            {
              to: "/doc_received",
              title: "Received Documents",
              icon: "mdi-file",
              rule: "document_show",
            },
            {
              to: "/sended_document",
              title: "Sent Document",
              icon: "mdi-file-send-outline",
              rule: "document_show",
            },
            {
              to: "/doc_settings",
              title: "Settings",
              icon: "mdi-cog",
              rule: "Document_settings",
            },
          ],
        },
      ],
      dialog: false,
      imageDialogg: false,
      imageProfile: "",
      width: 0,
    };
  },
  computed: {
    ...mapGetters({
      userData: "login/getUserData",
      rules: "users/getUserRules",
    }),
  },
  created() {
    for (let item of this.groupItems) {
      if (!item.rule && item.one) {
        this.filterItems.push({
          title: item.title,
          to: item.to,
          icon: item.icon,
          one: item.one,
        });
      } else {
        if (item.one == false) {
          let filterChild = item.item.filter((child) => {
            if (typeof child.rule === "string") return this.rules[child.rule];
            return child.rule.some((rule) =>
              Object.keys(this.rules).includes(rule)
            );
          });
          if (filterChild.length > 0) {
            this.filterItems.push({
              items: filterChild,
              title: item.title,
            });
          }
        } else {
          let menuItem;
          if (typeof item.rule === "string") {
            menuItem = this.rules[item.rule];
          } else {
            menuItem = item.rule.some((rule) =>
              Object.keys(this.rules).includes(rule)
            );
          }
          if (menuItem) {
            console.log(item.one);
            this.filterItems.push({
              title: item.title,
              to: item.to,
              icon: item.icon,
              one: item.one,
            });
          }
        }
      }
    }
    console.log(this.filterItems);
  },
  methods: {
    showEditDialog() {
      this.authuser = {
        full_name: this.userData.full_name,
        username: this.userData.username,
        id: this.userData.id,
        password: "",
      };
      this.dialog = true;
    },
    cancelUpdateDialog() {
      this.authuser = {
        full_name: "",
        username: "",
        password: "",
      };
      this.dialog = false;
    },
    logout() {
      localStorage.clear();
      this.$router.push("/login");
    },
    imageDialog(item) {
      this.imageDialogg = true;
      this.imageProfile = item;
    },
    async updateProfile(userdata) {
      try {
        let formData = new FormData();
        if (this.authuser.img) {
          formData.append("img", this.authuser.img);
        }
        formData.append("username", this.authuser.username);
        formData.append("id", this.authuser.id);
        formData.append("full_name", this.authuser.username);
        formData.append("password", this.authuser.password);
        const response = await this.$store.dispatch("users/updateUser", {
          formData,
          id: this.authuser.id,
        });
        this.$toast.success(response.data.message);
        this.dialog = false;
      } catch (error) {
        this.$toast.error(error.data.message);
      }
    },
  },
};
</script>

<style>
/* . {
  background-color: #404040 !important;
} */
.navTitle {
  color: rgb(102, 102, 102);
}
/* .v-list-item--active {
  background-color: #404040 !important;
} */
v-list-item-content {
  color: whitesmoke;
}
/* .bg-dark {
  color: whitesmoke !important;
  background-color: #404040b0;
} */
.v-autocomplete__content .v-list-item--active {
  background-color: whitesmoke !important;
}
.groupMenu .v-list-item--active {
  background-color: rgba(95, 185, 150, 0.466) !important;
  color: rgb(245, 245, 245);
}
.groupMenu > * {
  color: rgb(245, 245, 245) !important;
}
.v-groupMenu .primary--text {
  color: whitesmoke !important;
  caret-color: #19d276 !important;
}
.app_bar {
  height: 20px;
}
.profile_img {
  width: 100%;
  border-radius: 50%;
  height: 100%;
}
</style>