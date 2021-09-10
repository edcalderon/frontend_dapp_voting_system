<template>
  <section class="container">
    <div>
      <div class="row">
        <div class="col-md-6 offset-md-3 mt-3">
          <form autocomplete="off" @submit.stop.prevent="handleSubmit">
            <div class="form-group">
              <label for="proposalName">Proposal Name</label>
              <b-form-input
                id="proposalName"
                v-model="proposalName"
                type="text"
                placeholder="Enter proposal name"
                required
              />
            </div>
            <div class="form-group">
              <label for="postalCode">Description</label>
              <b-form-textarea
                id="description"
                v-model="description"
                placeholder="Enter some description..."
                rows="3"
                max-rows="6"
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
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
const apiUrl = process.env.API_URL || 'http://localhost:1337'
export default {
  data() {
    return {
      proposalName: '',
      description: '',
      loading: false
    }
  },
  methods: {
    userToken() {
      return this.$store.getters['auth/jwt']
    },
    async handleSubmit() {
      this.loading = true
      const config = {
        headers: { Authorization: `Bearer ` + this.userToken() }
      }
      const body = {
        name: this.proposalName,
        description: this.description
      }
      try {
        const response = await this.$axios.post(
          apiUrl + '/proposals',
          body,
          config
        )
        if (response) {
          alert('Proposal have been successfully created.')
          this.loading = false
          this.$store.commit('proposals/add', {
            id: response.data.id,
            ...response.data
          })
        }
      } catch (err) {
        this.loading = false
        alert('An error occurred.')
      }
    }
  }
}
</script>
