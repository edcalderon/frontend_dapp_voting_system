<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <router-link tag="a" class="navbar-brand" to="/" exact>
        Decentralized Voting System
      </router-link>
      <div class="navbar-collapse justify-content-end">
        <ul class="navbar-nav">
          <li v-if="username" class="nav-item">
            <a href="#" class="nav-link"> Hello {{ username }} </a>
          </li>
          <li v-if="username">
            <a href="#" class="nav-link" @click="logout">
              Logout
            </a>
          </li>
          <li v-if="!username" class="nav-item">
            <router-link
              v-if="!username"
              tag="a"
              class="nav-link"
              to="/signin"
              exact
            >
              Signin
            </router-link>
          </li>
          <li v-if="!username" class="nav-item">
            <router-link
              v-if="!username"
              tag="a"
              class="nav-link"
              to="/signup"
              exact
            >
              Signup
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  computed: {
    username() {
      return this.$store.getters['auth/username']
    }
  },
  methods: {
    ...mapMutations({
      logout: 'auth/logout'
    })
  }
}
</script>
