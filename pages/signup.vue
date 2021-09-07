<template>
  <section class="container">
    <div class="col-md-6 offset-md-3 mt-3">
      <form autocomplete="off" @submit.stop.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Document ID</label>
          <b-form-input
            id="usercc"
            v-model="usercc"
            :autofocus="true"
            type="number"
            placeholder="Enter your id"
            required
          />
        </div>
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
          <label for="password">Password</label>
          <b-form-input
            id="password"
            :autofocus="true"
            v-model="password"
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
          Already have an account?
          <router-link :to="{ name: 'signin' }" tag="a">
            Login
          </router-link>
        </p>
      </form>
    </div>
  </section>
</template>

<script>
const apiUrl = process.env.API_URL || 'http://localhost:1337'
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      email: '',
      password: '',
      username: '',
      usercc: '',
      loading: false
    }
  },
  methods: {
    async handleSubmit() {
      try {
        this.loading = true
        const response = await this.$axios.post(
          apiUrl + '/auth/local/register',
          {
            userCC: this.usercc,
            username: this.email,
            email: this.email,
            password: this.password
          }
        )
        if (response) {
          this.loading = false
          this.setUser(response.data.user)
          this.setJwt(response.data.jwt)
          this.$router.push('/')
        }
      } catch (err) {
        this.loading = false
        alert(err.message || 'An error occurred.')
      }
    },
    ...mapMutations({
      setUser: 'auth/setUser',
      setJwt: 'auth/setJwt'
    })
  }
}
</script>
