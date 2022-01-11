<template></template>

<script>
export default {
  name: "navigation-drawer",
  data() {
    return {
      drawer: false,
      min: true,
      menuItems: [
        {
          id: 1,
          to: "/admin",
          title: "Admin Panel",
          icon: "mdi-cog",
        },
        {
          id: 2,
          to: "/",
          title: "People",
          icon: "mdi-account-circle",
        },
      ],
    };
  },
  methods: {
    logout() {
      localStorage.clear();
      location.reload();
    },
  },
};
</script>

<style >
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