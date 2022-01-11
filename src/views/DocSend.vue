<template>
  <v-container fluid>
    <h3 class="py-4">Document Circulation</h3>

    <v-row class="main_row">
      <v-col cols="7" class="row-1">
        <h4 class="py-4">Select document title</h4>
        <v-autocomplete
          v-model="data.type_id"
          filled
          :items="types"
          dense
          required
          item-text="title"
          item-value="id"
          clearable
          label="Select Type"
          solo
        ></v-autocomplete>
        <h4 class="pb-4">Set document name</h4>

        <v-text-field
          v-model="data.name"
          required
          dense
          filled
          solo
          label="set name"
          placeholder="set name"
        >
        </v-text-field>
        <v-textarea
          label="Three rows"
          auto-grow
          v-model="data.description"
          style="border-radius: 10px"
          solo
          class="textarea"
          outlined
          required
          rows="5"
          row-height="20"
        ></v-textarea>
        <div class="d-flex">
          <div class="d-flex flex-wrap">
            <div
              bottom
              class="px-1 doc_icon"
              v-for="(file, index) of data.files"
              :key="index"
            >
              <v-tooltip bottom class="">
                <template class="doc_icon" v-slot:activator="{ on, attrs }">
                  <a
                    target="_blank"
                    class="ma-0 pa-0"
                    v-on="on"
                    v-bind="attrs"
                    style="font-size: 12px; position: relative"
                  >
                    <span v-if="file.invalidMessage" class="warning">{{
                      file.invalidMessage
                    }}</span>
                    <img
                      src="../assets/doc_icon/document.png"
                      style="width: 40px"
                      alt="salom"
                    />
                  </a>
                  <v-btn
                    @click="
                      data.files.splice(index, 1);
                      uploadFIles.splice(index, 1);
                    "
                    x-small
                    icon
                    class="error delete-btn"
                    ><v-icon>mdi-window-close</v-icon></v-btn
                  >
                </template>
                <span>{{ file.name }}</span>
              </v-tooltip>
            </div>
          </div>
          <div
            class="
              file-upload__btn
              upload_icon
              d-flex
              align-center
              justify-center
            "
            @click="onPickFile"
          >
            <v-icon size="30px" color="#1976d2" dense
              >mdi-file-upload-outline</v-icon
            >
          </div>
        </div>
        <!-- <v-file-input
          v-model="data.file"
          multiple
          ref="fileInput"
          accept="*/*"
          @change="onFilePicked"
        /> -->
        <input
          type="file"
          style="display: none"
          ref="fileInput"
          accept="*/*"
          @change="onFilePicked"
        />
        <v-container fluid class="d-flex justify-end">
          <v-btn
            class="mx-5 primary"
            :disabled="
              data.type_id.length < 1 ||
              data.name.length < 1 ||
              data.description.length < 1 ||
              data.to_user.length < 1
            "
            @click="sendDocument"
          >
            send
          </v-btn>
          <v-btn
            :disabled="
              data.type_id.length < 1 &&
              data.name.length < 1 &&
              data.description.length < 1 &&
              to_user.length < 1
            "
            @click="deleteData"
            class="error"
          >
            cancel
          </v-btn>
        </v-container>
      </v-col>
      <v-col cols="5" class="user_cols" justify-end>
        <h4 class="py-4">Sellect User</h4>
        <v-spacer />
        <v-data-table
          dense
          v-model="data.to_user"
          hide-default-footer
          :headers="headers"
          :items="users"
          show-select
        >
          <template v-slot:top>
            <v-text-field
              dense
              v-model="search"
              label="Search "
              class="mx-4"
              @click="searchUser"
            ></v-text-field>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import axios from "@/axios";
import { mapGetters } from "vuex";
import _ from "lodash";

export default {
  name: "DocSend",
  data() {
    return {
      to_user: [],
      search: "",
      headers: [
        {
          text: "Id",
          value: "id",
        },
        {
          text: "ismi",
          value: "full_name",
        },
      ],
      data: {
        type_id: "",
        name: "",
        description: "",
        to_user: [],
        files: [],
      },
      uploadFIles: [],
    };
  },
  computed: {
    ...mapGetters({
      users: "users/getUsers",
      types: "types/getActive",
    }),
  },
  created() {
    this.$store.dispatch("users/fetchUsers");
    this.$store.dispatch("types/fetchActiveTypes");
  },
  methods: {
    async sendDocument() {
      let formData = new FormData();
      _.forEach(this.uploadFIles, (file) => {
        if (this.validate(file) === "") {
          formData.append("files", file);
        }
      });
      _.forEach(this.data.to_user, (user) => {
        formData.append("to_user", user.id);
      });
      formData.append("name", this.data.name);
      formData.append("description", this.data.description);
      formData.append("type_id", this.data.type_id);
      try {
        if (this.data.to_user.length > 0) {
          let response = await this.$store.dispatch(
            "document_circulation/createDocument",
            formData
          );
          this.deleteData();

          this.$toast.success(response.data.message);
        }
      } catch (error) {
        this.$toast.error(error.data.message);
      }
    },
    margeToUser() {
      this.data.to_user = this.to_user.map((el) => el.id);
    },
    deleteData() {
      this.data.files = [];
      this.uploadFIles = [];
      this.data.description = "";
      this.data.type_id = "";
      this.data.name = "";
      this.data.to_user = [];
      this.to_user = [];
    },
    async searchUser() {
      try {
        const response = await this.$store.dispatch(
          "users/fetchUsers",
          this.search
        );
      } catch (error) {
        this.$toast.error(Object.values(error.data.message)[0][0]);
      }
    },
    onFilePicked(event) {
      const files = event.target.files;
      // this.data.files = [...this.files, ...files];
      (this.uploadFIles = [...this.uploadFIles, ...files]),
        (this.data.files = [
          ...this.data.files,
          ..._.map(files, (file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            invalidMessage: this.validate(file),
          })),
        ]);
    },
    validate(file) {
      const MAX_SIZE = 500000;
      if (file.size > MAX_SIZE) {
        return `Max size can be less then ${MAX_SIZE / 1000}kb`;
      }
      return "";
    },
    onPickFile() {
      this.$refs.fileInput.click();
    },

    removeFile(file_index) {
      this.$delete(this.data.file, file_index);
    },
  },
};
</script>
<style>
.bg-dark {
  color: whitesmoke !important;
  background-color: #404040b0;
}
.v-autocomplete__content .v-list-item--active {
  background-color: whitesmoke !important;
}

.doc_icon {
  position: relative;
  margin: 0 10px !important;
}
.input1 {
  max-width: 256px !important;
}
.upload_icon {
  width: 40px;
  height: 40px;
  box-shadow: 1px 1px 5px black;
  border-radius: 10px;
}
.delete-btn {
  right: -5px;
  position: absolute;
}
.user_cols {
  border-left: 1px solid black;
}
.main_row {
  border-top: 1px solid black;
}
@media only screen and (max-height: 800px) {
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
  .doc_icon {
    position: relative;
    margin: 0 15px !important;
  }
  .input1 {
    max-width: 200px !important;
  }
  .upload_icon {
    width: 30px;
    height: 30px;
    box-shadow: 1px 1px 5px black;
    border-radius: 10px;
  }
  .delete-btn {
    right: -5px;
    position: absolute;
  }
  .user_cols {
    border-left: 1px solid black;
  }
  .main_row {
    border-top: 1px solid black;
  }
  .textarea {
    height: 150px;
  }
}
</style>

