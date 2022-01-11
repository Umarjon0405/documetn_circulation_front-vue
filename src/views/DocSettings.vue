<template>
  <v-container fluid>
    <v-dialog v-model="dialogAsk" max-width="500px">
      <v-card>
        <v-card-title
          style="background-color: #404040d5; color: whitesmoke"
          class="mb-4"
        >
          <h3>Do you want delete this item</h3>
        </v-card-title>
        <v-card-actions>
          <v-btn text color="success" @click="deleteType"> Yes </v-btn>
          <v-spacer />
          <v-btn text color="error" @click="dialogAsk = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog" max-width="700px">
      <v-card>
        <v-card-title
          style="background-color: #404040d5; color: whitesmoke"
          class="mb-4"
        >
          <h4>{{ this.typeData.id ? "Edit" : "Add" }} Type</h4>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="typeData.title"
            dense
            outlined
            label="Title"
            placeholder="set title"
          >
          </v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="success" @click="saveType">{{
            typeData.id ? "Edit" : "Add"
          }}</v-btn>
          <v-btn text color="error" @click="dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-container d-flex>
      <h3>Dokument sozlamalari</h3>
      <v-spacer />
      <v-btn class="success" small @click="showAddDialog"
        ><v-icon class="mr-3">mdi-plus-circle</v-icon> add</v-btn
      >
    </v-container>
    <v-data-table :headers="header" :items="types" hide-default-footer>
      <template #item.active="{ item }">
        <v-switch
          fluid
          @click=""
          v-model="item.active"
          color="success"
        ></v-switch>
      </template>
      <template #item.actions="{ item }">
        <v-btn color="warning" icon @click="showEditDialog(item)">
          <v-icon color="danger">mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon color="error" @click="showDeleteDialog(item.id)">
          <v-icon color="error">mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
import axios from "@/axios";
import { mapGetters } from "vuex";

export default {
  name: "DocSettings",
  data() {
    return {
      dialog: false,
      dialogAsk: false,
      typeData: {
        id: "",
        title: "",
        active: "",
      },
    };
  },
  computed: {
    ...mapGetters({
      types: "types/getTypes",
      header: "types/getTableHeader",
    }),
  },
  created() {
    this.$store.dispatch("types/fetchTypes");
  },
  methods: {
    showAddDialog() {
      this.typeData = {
        id: "",
        title: "",
        active: "",
      };
      this.dialog = true;
    },
    showDeleteDialog(item) {
      this.typeData.id = item;
      this.dialogAsk = true;
    },
    showEditDialog(item) {
      this.typeData = { ...item };
      this.dialog = true;
    },
    async saveType() {
      if (!this.typeData.id) {
        try {
          const response = await this.$store.dispatch(
            "types/createType",
            this.typeData
          );
          this.dialog = false;
          this.$toast.success(response.data.message);
        } catch (error) {
          this.$toast.error(error.data.message);
        }
      } else {
        try {
          const response = await this.$store.dispatch(
            "types/editType",
            this.typeData
          );
          this.dialog = false;
          this.$toast.success(response.data.message);
        } catch (error) {
          this.$toast.error(error.data.message);
        }
      }
    },
    async deleteType() {
      try {
        const response = await this.$store.dispatch(
          "types/deleteType",
          this.typeData.id
        );
        this.dialogAsk = false;
        this.$toast.success(response.data.message);
      } catch (error) {
        this.$toast.error(error.data.message);
      }
    },
  },
};
</script>
<style>
.bg-dark {
  color: whitesmoke !important;
  background-color: #404040b0;
}
.bg-dark {
  color: whitesmoke !important;
  background-color: #404040b0;
}
.v-autocomplete__content .v-list-item--active {
  background-color: whitesmoke !important;
}
.groupMenu .v-list-item--active {
  background-color: rgba(95, 159, 185, 0.466) !important;
  color: rgb(245, 245, 245);
}

.v-groupMenu .primary--text {
  color: whitesmoke !important;
  caret-color: #1976d2 !important;
}
</style>

