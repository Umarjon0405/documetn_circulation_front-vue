<template>
  <div fluid class="container1">
    <v-row class="main_row pt-0 ma-0">
      <v-col cols="3" solo class="pt-4 ma-0 left-col">
        <v-text-field
          outlined
          dense
          filled
          @input="searchDocument"
          hide-details=""
          @keyup.enter="searchDocument"
          solo
          style="max-width: 90%; margin: auto"
          label="Search"
          placeholder="set simble"
          class=""
          v-model="search_input"
        />
        <div class="parent-div">
          <div
            class="d-flex main_div py-2 px-1 align-center"
            width="100%"
            @click="getDocument(document.id)"
            v-for="(document, index) in documents"
            :key="index"
          >
            <div
              width="20%"
              class="mx-2 logo-div d-flex ali justify-center align-center"
            >
              <h4>
                {{ document.exchange[0].from.full_name.charAt(0) }}
              </h4>
            </div>
            <div style="margin: 0 15px">
              <span>{{ document.exchange[0].from.full_name }}</span>
              <p>{{ `${document.description.slice(1, 10)}...` }}</p>
            </div>
            <div></div>
            <v-spacer />
            <span class="span2" v-if="document.exchange[0].accept == false"
              >!</span
            >
          </div>
        </div>
        <div class="pagination">
          <pagination-in-page
            store="received_document"
            collection="documents"
            method="fetchDocuments"
          ></pagination-in-page>
        </div>
      </v-col>
      <v-col cols="9 pa-0 ma-0" class="parentRow" solo>
        <div style="height: 100%" class="pa-0 ma-0" v-if="data.id">
          <v-row class="main_row ma-0 pa-0 rowInCol">
            <v-col cols="8" class="ma-0 pa-0 colDocument">
              <h2 style="width: 100%; color: blue; text-align: center">
                Document
              </h2>
              <div class="mx-4">
                <h3 class="h3_main">
                  Document type:<span>{{ data.type.title }}</span>
                </h3>
                <h3 class="h3_main">
                  Document name:<span>{{ data.doc_name }}</span>
                </h3>
                <h3 class="h3_main">Document recivers:</h3>
                <div class="d-flex parent_name py-4" style="width: 100%">
                  <v-row width="100%">
                    <v-col
                      cols="5"
                      class="name_div my-0 pa-0"
                      v-for="(user, index) in data.exchange"
                      :key="index"
                    >
                      <h4 class="name_span py-0" style="">
                        {{ user.to.full_name }}
                        <v-icon
                          v-if="user.status === 'waiting'"
                          style="float: right"
                          color="primary"
                          size="25px"
                          >{{
                            user.accept ? "mdi-check-all" : "mdi-check"
                          }}</v-icon
                        >
                        <span
                          v-if="user.status !== 'waiting'"
                          style="
                            font-size: 15px;
                            float: right;
                            font-weight: 400;
                          "
                        >
                          <span
                            :style="
                              user.status === 'confirmed'
                                ? 'color:green'
                                : 'color:red'
                            "
                          >
                            {{ user.status }}
                          </span>
                        </span>
                      </h4>
                    </v-col>
                  </v-row>
                </div>
                <p>
                  <span
                    class="h3_main"
                    style="
                      font-size: 20px;
                      font-weight: 100;
                      font-family: monospace;
                      color: rgb(77, 77, 219);
                    "
                  >
                    Document description:
                  </span>
                  {{ data.description }}
                </p>

                <h3 class="h3_main">Document files</h3>
                <div class="d-flex">
                  <div
                    v-for="(file, index) of data.files"
                    :key="index"
                    class="mx-3"
                  >
                    <v-tooltip bottom class="">
                      <template
                        class="doc_icon"
                        v-slot:activator="{ on, attrs }"
                      >
                        <a
                          class="ma-0 pa-0"
                          :href="file_env + file.file_url"
                          target="_blank"
                          v-on="on"
                          v-bind="attrs"
                          style="font-size: 12px; position: relative"
                        >
                          <img
                            src="../assets/doc_icon/document.png"
                            style="width: 40px"
                            alt="salom"
                          />
                        </a>
                      </template>
                      <span>{{ file.file_name }}</span>
                    </v-tooltip>
                  </div>
                </div>
                <v-spacer></v-spacer>
                <div class="class-group" v-if="my_answer.status === 'waiting'">
                  <v-btn class="btn-received1" @click="answer('confirmed')">
                    accept
                    {{ data.my_answer }}
                  </v-btn>
                  <v-btn class="btn-received2" @click="answer('canceled')">
                    cancel
                  </v-btn>
                </div>
              </div>
            </v-col>

            <v-col cols="4" class="chat_col" style="">
              <h3
                style="
                  text-align: center;
                  color: whitesmoke;
                  background-color: #707070;
                  overflow: hidden;
                  box-shadow: 0px 3px 10px black;
                "
                class="py-2"
              >
                Chat
              </h3>
              <div width="100%" height="100%" class="parentChat pt-2">
                <div fluid class="scrollBar" cols="12">
                  <div
                    v-for="(message, index) in chatData"
                    :key="index"
                    style="display: block"
                  >
                    <div
                      v-if="message.user.id == user.id"
                      class="chat"
                      style="float: right"
                    >
                      <div class="message2">
                        <div v-if="message.file_url">
                          <a
                            :href="file_env + message.file_url"
                            target="_blank"
                          >
                            <img
                              src="../assets/doc_icon/document.png"
                              style="width: 30px"
                              alt="salom"
                            />
                          </a>
                        </div>
                        {{ message.description }}
                      </div>
                      <div class="logo_div3">
                        {{ message.user.full_name.charAt(0) }}
                      </div>
                    </div>
                    <div
                      v-if="message.user.id !== user.id"
                      class="chat"
                      max-width="100%"
                      style="display: block"
                    >
                      <div class="logo_div2">
                        {{ message.user.full_name.charAt(0) }}
                      </div>

                      <div class="message">
                        <div v-if="message.file_url">
                          <a
                            :href="file_env + message.file_url"
                            target="_blank"
                          >
                            <img
                              src="../assets/doc_icon/document.png"
                              style="width: 30px"
                              alt="salom"
                            />
                          </a>
                        </div>
                        {{ message.description }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="over-input">
                  <span v-if="message_file" class="mx-8 file_span">
                    {{ message_file.name.substr(-29, 40) }}
                    <v-icon
                      style="float: right"
                      color="red"
                      height="100%"
                      dense
                      @click="deleteItem"
                      class="close_button"
                      >mdi-window-close</v-icon
                    >
                  </span>
                </div>
                <div class="input pb-4">
                  <div
                    class="
                      file-upload__btn
                      upload_icon
                      d-flex
                      align-center
                      justify-center
                    "
                    @click="onPickFile()"
                  >
                    <v-icon
                      size="30px"
                      color="#1976d2"
                      dense
                      class=""
                      v-if="!message_file"
                      >mdi-paperclip</v-icon
                    >
                  </div>
                  <input
                    type="file"
                    style="display: none; border: none"
                    ref="chatFile"
                    accept="*/*"
                    @change="onFilePicked"
                  />
                  <v-text-field
                    outlined
                    dense
                    @keyup.enter="sendMessage(data.id)"
                    hide-details=""
                    class="input_chat"
                    v-model="message"
                  />
                  <v-icon
                    :disabled="message.length < 1 && message_file.length < 1"
                    @click="sendMessage(data.id)"
                    color="primary"
                    large
                    >mdi-send</v-icon
                  >
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import axios from "@/axios";
import { mapGetters } from "vuex";
import debounce from "lodash.debounce";
import Pagination from "../components/Pagination.vue";
import PaginationInPage from "../components/PaginationInPage.vue";

export default {
  components: { Pagination, PaginationInPage },
  name: "DocReceived",
  data() {
    return {
      data: [],
      chatData: [],
      message: "",
      my_answer: "",
      search_input: "",
      upload_file: "",
      message_file: "",
      file_env: process.env.VUE_APP_FILE_URL,
      file_name: "",
    };
  },
  computed: {
    ...mapGetters({
      documents: "received_document/getDocuments",
      user: "login/getUserData",
      getCurrentPage: "received_document/getCurrentPage",
    }),
  },
  created() {
    this.$store.dispatch("users/fetchUsers");
    this.searchDocument();
  },
  mounted() {
    this.scrollToEnd();
  },
  updated() {
    this.scrollToEnd();
  },
  methods: {
    searchDocument: debounce(async function () {
      try {
        await this.$store.dispatch("received_document/fetchDocuments", {
          url: "documents/received?page=",
          method: "get",
          pageNumber: this.getCurrentPage,
          body: {
            params: {
              search: this.search_input,
            },
          },
        });
      } catch (error) {
        this.$toast.error(error.data.message);
      }
    }, 1000),

    async getDocument(id) {
      this.$overlay(true);
      try {
        let response = await this.$store.dispatch(
          "document_circulation/fetchDocument",
          id
        );
        let response2 = await this.$store.dispatch(
          "document_circulation/fetchChatMessage",
          id
        );
        this.$store.dispatch("received_document/fetchDocuments");
        this.data = response.data.data;
        this.my_answer = response.data.my_answer;
        this.chatData = response2.data.data;
        this.searchDocument();
        this.$overlay(false);
      } catch (error) {
        this.$toast.error(error.data.message);
      }
    },
    async sendMessage(id) {
      let formData = new FormData();
      formData.append("description", this.message);
      formData.append("file", this.upload_file);
      formData.append("document_id", id);

      try {
        let response = await this.$store.dispatch(
          "document_circulation/sendMessage",
          formData
        );
        let response2 = await this.$store.dispatch(
          "document_circulation/fetchChatMessage",
          id
        );
        this.chatData = response2.data.data;
        this.message = [];
        this.message_file = "";
        this.upload_file = "";
      } catch (error) {
        this.$toast.error(error.data.message);
      }
    },

    scrollToEnd() {
      var container = document.querySelector(".scrollBar");
      if (container) {
        var scrollHeight = container.scrollHeight;
        container.scrollTop = scrollHeight;
      }
    },
    async answer(status) {
      try {
        let response = await this.$store.dispatch(
          "document_circulation/answer",
          { id: this.data.id, status: status }
        );
        let response2 = await this.$store.dispatch(
          "document_circulation/fetchDocument",
          this.data.id
        );
        this.data = await response2.data.data;
        this.my_answer = await response2.data.my_answer;
        this.$toast.success(response.data.message);
      } catch (error) {
        this.$toast.error(response.data.message);
      }
    },
    deleteItem() {
      this.message_file = "";
      this.upload_file = "";
    },
    onFilePicked(event) {
      const file = event.target.files[0];
      this.upload_file = file;
      this.message_file = {
        name: file.name,
        size: file.size,
        type: file.type,
      };
    },
    onPickFile() {
      this.$refs.chatFile.click();
    },
  },
};
</script>
<style>
.span2 {
  font-weight: 800;
  color: aliceblue;
  font-size: 15px;
  padding: 0px 10px;
  border-radius: 50%;
  background-color: red;
}
.main_div {
  font-size: 10px;
  border-top: 1px solid black;
  background-color: #f0f0f0;
  color: rgb(112, 112, 112);
  }
  .main_div:hover {
    background-color: #B4DECE;
  }
.left-col {
  border-right: 2px solid #89cc83;
}
.parent-div {
  overflow-y: auto;
  padding-top: 25px;
  height: 65%;
}
.colDocument {
}
.search_input {
  width: 250px;
}
.logo-div {
  font-weight: 900;
  font-size: 25px;
  color: #404040;
  font-family: Georgia, "Times New Roman", Times, serif;
  width: 50px !important;
  background-color: lightblue;
  justify-content: space-around;
  height: 50px !important;
  border-radius: 50%;
}
.h3_main {
  font-family: initial;
  margin-top: 20px;
  font-size: 20px;
  color: rgb(77, 77, 219);
  font-weight: 100;
}

.name_div {
  margin: 10px 10px;
}
.name_span {
  width: 100% !important;
  min-height: 30px;
  padding: 10px;
  padding: 10px 10px;
  margin: 10px 5px;
  color: whitesmoke;
  border-radius: 10px;
  color: #707070;
  border: 1px solid #707070;
}
.h3_main span {
  margin-left: 20px;
  color: #404040;
  font-weight: 900;
  font-family: monospace;
}
.parentRow {
  height: 100%;
}
.main_row {
  padding: 0;
  margin: 0;
  height: 100%;
}
.container1 {
  overflow: hidden;
  height: 900px;
  background-color: rgb(255, 255, 255);
}
.chat_col {
  position: relative;
  margin: 0 !important;
  border-left: 1px solid #404040;
}
.input {
  display: flex;
  position: absolute;
  margin: 0 auto;
  bottom: 1px;
  width: 90%;
}
.logo_div2 {
  float: left;
  position: absolute;
  font-weight: 900;
  font-size: 25px;
  color: whitesmoke;
  font-family: Georgia, "Times New Roman", Times, serif;
  width: 40px !important;
  height: 40px !important;
  display: flex;
  justify-content: center;
  background-color: #707070;
  bottom: 1px;
  left: 1;
  border-radius: 50%;
}
.logo_div3 {
  float: right;
  position: absolute;
  font-weight: 900;
  font-size: 25px;
  color: whitesmoke;
  font-family: Georgia, "Times New Roman", Times, serif;
  width: 40px !important;
  height: 40px !important;
  display: flex;
  justify-content: center;
  background-color: #707070;
  bottom: 1px;
  right: 1px;
  border-radius: 50%;
}
.chat {
  position: relative;
  width: 80%;
  display: inline-block !important;
}
.over-input {
  display: flex;
  position: absolute;
  margin: 0 auto;
  bottom: 70px;
  font-size: 15px;
  width: 88%;
}
.file_span {
  display: inline-block;
  width: 100%;
  margin-top: 10px;
  box-shadow: 1px 1px 1px;
  border: 1px solid red;
}
.message {
  border-radius: 10px 0;
  margin-left: 45px;
  margin-top: 20px;
  max-width: 90%;
  word-wrap: break-word;
  word-break: break-all;
  padding: 5px 10px;
  min-height: 40px;
  color: rgb(255, 255, 255);
  background-color: rgb(177, 174, 174);
}
.message2 {
  border-radius: 0 10px;
  margin-right: 45px;
  margin-top: 20px;
  max-width: 90%;
  word-wrap: break-word;
  word-break: break-all;
  padding: 5px 10px;
  min-height: 40px;
  color: rgb(255, 255, 255);
  background-color: rgb(177, 174, 174);
}
.scrollBar {
  overflow-y: auto;
  max-height: 75vh;
}
@media only screen and (max-height: 800px) {
  .scrollBar {
    margin-top: 10px;
    overflow-y: auto;
    max-height: 65vh;
  }
  .container1 {
    height: 640px;
    overflow: hidden;
    background-color: rgb(255, 255, 255);
  }
  .parent-div {
    overflow-y: auto;
    padding-top: 10px;
    height: 45%;
  }
  .span2 {
    color: aliceblue;
    padding: 2px 7px;
    border-radius: 50%;
    background-color: rgb(255, 91, 91);
  }
  .main_div {
  border-top: 1px solid black;
  background-color: #f0f0f0;
  color: rgb(112, 112, 112);
  }
  .main_div:hover {
    background-color: #B4DECE;
  }

  .parent-div {
    overflow-y: auto;
    padding-top: 10px;
    height: 40%;
    overflow-x: auto;
  }

  .search_input {
    width: 200px;
  }
  .logo-div {
    font-weight: 40px;
    font-size: 18px;
    color: #585858;
    font-family: Georgia, "Times New Roman", Times, serif;
    width: 30px !important;
    background-color: lightblue;
    /* display: flex;
  justify-content: center; */
    height: 30px !important;
    border-radius: 50%;
  }
  .h3_main {
    font-family: initial;
    margin-top: 10px;
    font-size: 10px;
    color: #1976d2;

    font-weight: 100;
  }

  .name_div {
    margin: 10px 10px;
  }
  .name_span {
    width: 100% !important;
    min-height: 30px;
    padding: 10px;
    padding: 10px 10px;
    margin: 10px 5px;
    color: whitesmoke;
    border-radius: 10px;
    color: #707070;
    border: 1px solid #707070;
  }
  .h3_main span {
    margin-left: 20px;
    color: #404040;
    font-weight: 400;
    font-family: monospace;
  }
}
.bg-dark {
  color: whitesmoke !important;
  background-color: #404040b0;
}
.v-autocomplete__content .v-list-item--active {
  background-color: whitesmoke !important;
}
/* .groupMenu .v-list-item--active {
  background-color: rgba(95, 159, 185, 0.466) !important;
  color: rgb(245, 245, 245);
}

.v-groupMenu .primary--text {
  color: whitesmoke !important;
  caret-color: #1976d2 !important;
} */
.close_button:hover {
  background-color: red !important;
  cursor: pointer !important;
  color: white !important;
  height: 100%;
}
.class-group {
  float: right;
}
.btn-received1 {
  transition: 0.5s;
  margin-left: 20px;
  color: #1976d2 !important;
  background-color: rgb(239, 255, 255) !important;
  font-size: 16px !important;
}
.btn-received1:hover {
  transition: 0.5s;
  margin-left: 20px;
  color: rgb(239, 255, 255) !important;
  background-color: #1976d2 !important;
  font-size: 16px !important;
}
.btn-received2 {
  transition: 0.5s;
  background-color: rgb(255, 245, 245) !important;
  color: rgb(255, 100, 100) !important;
  margin-left: 20px;
  font-size: 16px !important;
}
.btn-received2:hover {
  transition: 0.5s;
  background-color: rgb(253, 100, 100) !important;
  color: rgb(255, 245, 245) !important;
  margin-left: 20px;
  font-size: 16px !important;
}
</style>

