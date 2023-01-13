<template>
  <v-app-bar
    id="app-bar"
    absolute
    app
    color="transparent"
    flat
    height="75"
    v-if="this.$route.path != '/'"
  >
    <v-btn class="mr-3" elevation="1" fab small @click="setDrawer(!drawer)">
      <v-icon v-if="value"> mdi-view-quilt </v-icon>

      <v-icon v-else> mdi-dots-vertical </v-icon>
    </v-btn>

    <v-toolbar-title
      class="hidden-sm-and-down font-weight-light"
      v-text="$route.name"
    />

    <v-spacer />

    <div class="mx-3" />

    <v-btn
      class="ml-2"
      min-width="0"
      text
      to="/dashboard"
      v-if="this.$route.path != '/'"
    >
      <v-icon>mdi-view-dashboard</v-icon>
    </v-btn>
    <v-btn
      class="ml-2"
      min-width="0"
      text
      to="/produtos"
      v-if="this.$route.path != '/'"
    >
      <v-icon>mdi-archive-outline</v-icon>
    </v-btn>
    <v-btn
      class="ml-2"
      min-width="0"
      text
      to="/categorias"
      v-if="this.$route.path != '/'"
    >
      <v-icon>mdi-archive-search-outline</v-icon>
    </v-btn>
    
    <v-menu
      bottom
      left
      offset-y
      origin="top right"
      transition="scale-transition"
    >
    </v-menu>

    <v-btn class="ml-2" min-width="0" @click="logout()" text>
      <i class="fas fa-sign-out-alt fa-2x"></i>
    </v-btn>
  </v-app-bar>
</template>

<script>
// Components
import { VHover, VListItem } from 'vuetify/lib';

// Utilities
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'DashboardCoreAppBar',

  components: {
    AppBarItem: {
      render(h) {
        return h(VHover, {
          scopedSlots: {
            default: ({ hover }) => {
              return h(
                VListItem,
                {
                  attrs: this.$attrs,
                  class: {
                    'black--text': !hover,
                    'white--text secondary elevation-12': hover,
                  },
                  props: {
                    activeClass: '',
                    dark: hover,
                    link: true,
                    ...this.$attrs,
                  },
                },
                this.$slots.default
              );
            },
          },
        });
      },
    },
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({}),

  computed: {
    ...mapState(['drawer']),
  },

  methods: {
    ...mapMutations({
      setDrawer: 'SET_DRAWER',
    }),
    logout() {
      this.$store.dispatch('destroyToken').then((response) => {
        this.$router.push('/');
      });
    },
  },
};
</script>
