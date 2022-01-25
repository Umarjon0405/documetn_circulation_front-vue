<template>
  <div class="d-flex justify-center custom-pagination">
    <v-pagination
      v-model="currentPage"
      color="#add8e6"
      :length="lastPage"
      total-visible="4"
    ></v-pagination>
  </div>
</template>

<script>
export default {
  name: "PaginationActions",
  props: ["store", "collection", "method"],
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
        this.$overlay(true);
        try {
          return this.$store.state[this.store]["data"].meta["current_page"];
        } catch (e) {
          return 1;
        }
      },
      set(value) {
        this.$store.commit(this.store + "/SET_CURRENT_PAGE", value);
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
      this.$store.dispatch(this.store + "/" + this.method, params);
    },
  },
};
</script>
<style>
</style>