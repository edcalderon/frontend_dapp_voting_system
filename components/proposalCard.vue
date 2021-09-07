<template>
  <div>
    <div class="form-group mt-12">
      <input
        v-model="query"
        type="text"
        class="form-control"
        placeholder="Search..."
      />
    </div>
    <ul v-if="proposals" class="card-columns list-unstyled">
      <li v-for="proposal in filteredList" :key="proposal.id" class="card">
        <!-- <img :src="restaurant.image.url" class="card-img-top" /> -->
        <div class="card-body">
          <h5 class="card-title">{{ proposal.name }}</h5>
          <p class="card-text">
            {{ proposal.description || 'No description provided' }}.
          </p>
          <router-link
            :to="{
              name: '',
              params: { id: proposal.id }
            }"
            tag="a"
            class="btn btn-primary"
          >
            vote
          </router-link>
          <b-button
            v-if="userRole == 'admin'"
            variant="danger"
            @click="deleteProposal(proposal.id)"
          >
            Delete
          </b-button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
const apiUrl = process.env.API_URL || 'http://localhost:1337'
export default {
  data() {
    return {
      query: '',
      responsed: false
    }
  },
  computed: {
    filteredList() {
      return this.proposals.filter(proposal => {
        return proposal.name.toLowerCase().includes(this.query.toLowerCase())
      })
    },
    proposals() {
      return this.$store.getters['proposals/list']
    },
    userRole() {
      return this.$store.getters['auth/roll']
    }
  },
  created() {
    this.fetchProposals()
  },
  methods: {
    userToken() {
      return this.$store.getters['auth/jwt']
    },
    async fetchProposals() {
      this.$store.commit('proposals/emptyList')
      const response = await this.$axios.get(apiUrl + '/proposals')
      if (response) {
        response.data.forEach(proposal => {
          // restaurant.image.url = `${apiUrl}${restaurant.image.url}`
          this.$store.commit('proposals/add', {
            id: proposal.id,
            ...proposal
          })
        })
        return true
      }
    },
    async deleteProposal(id) {
      const response = await this.$axios.delete(apiUrl + '/proposals/' + id)
      if (response) {
        console.log(response)
        this.$store.commit('proposals/remove', {
          id: response.data.id,
          ...response.data
        })
        this.fetchProposals()
        alert('Proposal have been successfully deleted.')
        return true
      }
    }
  }
}
</script>
