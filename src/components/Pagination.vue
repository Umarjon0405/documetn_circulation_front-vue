<template>
  <v-footer app inset height="60" color="white">
    <v-container fluid class="px-0 py-0">
      <v-row align="center">
        <v-col cols="12" sm="12">
          <div class="d-flex justify-center align-center custom-pagination">
            <v-pagination
              v-model="currentPage"
              color="success"
              :length="lastPage"
              circle
              total-visible="8"
            ></v-pagination>
            <v-text-field
              type="number"
              clearable
              autocomplete="off"
              dense
              flat
              hide-details
              append-icon="mdi-magnify"
              class="subtitle-2 mx-4 mt-1"
              v-model="valueTextField"
              placeholder="Саҳифа"
              style="max-width: 180px"
              @click:append="currentPage = parseInt(valueTextField)"
              @click:clear="currentPage = 1"
              @keyup.esc="currentPage = 1"
              @keyup.enter="currentPage = parseInt($event.target.value)"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: "Pagination",
  props: ["store", "collection"],
  data() {
    return {
      valueTextField: "",
    };
  },
  watch: {
    currentPage(newVal) {
      this.paginatePage(newVal);
    },
  },

  computed: {
    currentPage: {
      get() {
        try {
          this.$overlay(true);
          return this.$store.state[this.store]["data"].meta["current_page"];
        } catch (e) {
          return 1;
        }
      },
      set(value) {
        this.$store.commit(this.store + "/setCurrentPage", value);
      },
    },
    lastPage: {
      get() {
        this.$overlay(false);
        try {
          return this.$store.state[this.store]["data"].meta["last_page"];
        } catch (e) {
          return 0;
        }
      },
    },
  },

  methods: {
    paginatePage(pageNumber) {
      let params = this.$store.state[this.store].params;
      params.pageNumber = pageNumber;
      this.$store.dispatch(this.store + "/getList", params);
    },
  },
};
</script>

<style lang="scss">
.custom-pagination input[type="number"] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: textfield;
}

.custom-pagination .v-input__control {
  max-width: 150px;
}
</style>
