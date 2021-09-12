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
            {{ proposal.description || 'No description provided' }}
          </p>
          <p v-if="userRole == 'admin'" class="card-text">
            {{ 'voteCount: ' + proposal.voteCount || 'VoteCount' }}
          </p>
          <b-button v-b-modal="'voteModal' + proposal.id" variant="primary">
            vote
          </b-button>
          <b-button
            v-b-modal="'deleteModal' + proposal.id"
            v-if="userRole == 'admin'"
            variant="danger"
          >
            Delete
          </b-button>
        </div>
        <modal-vote :prop-id="proposal.id" :prop-name="proposal.name" />
        <delete-proposal-modal
          :prop-id="proposal.id"
          :prop-name="proposal.name"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import DeleteProposalModal from './deleteProposalModal.vue'
import modalVote from './voteModal.vue'
const apiUrl = process.env.API_URL || 'http://localhost:1337'
export default {
  components: { modalVote, DeleteProposalModal },
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
    }
  }
}
</script>
