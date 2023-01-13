<template>
  <v-footer padless height="40px;" v-if="this.$route.path!='/'">
    <v-spacer class="hidden-sm-and-down" />
      <p style="font-size:15px;"> Copyright <strong>AF</strong> &copy; {{ new Date().getFullYear() }} </p> 

  </v-footer>
</template>
<script>
  export default {
    name: 'DashboardCoreFooter',
    data: () => ({
   
      
    }),
  }
</script>

<style lang="sass">
  #dashboard-core-footer
    a
      font-size: .825rem
      font-weight: 500
      text-decoration: none
      text-transform: uppercase
</style>
