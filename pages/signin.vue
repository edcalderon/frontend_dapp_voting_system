<template>
  <section class="container">
    <div class="col-md-6 offset-md-3 mt-3">
      <form autocomplete="off" @submit.stop.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Email</label>
          <b-form-input
            id="email"
            v-model="email"
            :autofocus="true"
            type="email"
            placeholder="Enter your email"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password / CC Exp Date</label>
          <b-form-input
            id="password"
            v-model="password"
            :autofocus="true"
            label="password"
            type="password"
            class="form-control"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          :disabled="loading"
          type="submit"
          class="btn btn-primary btn-block mt-3"
        >
          Submit
        </button>
        <p class="text-center mt-3">
          Not account yet?
          <router-link :to="{ name: 'signup' }" tag="a">
            Register Here
          </router-link>
        </p>
      </form>
    </div>
  </section>
</template>

<script>
import Strapi from 'strapi-sdk-javascript/build/main'
const apiUrl = process.env.API_URL || 'http://localhost:1337'
const strapi = new Strapi(apiUrl)
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      email: '',
      password: '',
      loading: false
    }
  },
  methods: {
    async handleSubmit() {
      try {
        this.loading = true
        const response = await strapi.login(this.email, this.password)
        this.loading = false
        if (response.user && response.jwt) {
          this.setUser(JSON.stringify(response.user))
          this.setJwt(JSON.stringify(response.jwt))
          this.$router.push('/')
        }
      } catch (err) {
        this.loading = false
        console.log(err)
        alert('invalid credentials please try again')
      }
    },
    ...mapMutations({
      setUser: 'auth/setUser',
      setJwt: 'auth/setJwt'
    })
  }
}
</script>
