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
    <b-form-checkbox-group
      id="checkbox-group-2"
      v-model="selectedProposals"
      :aria-describedby="ariaDescribedby"
      name="flavour-2"
    >
      <ul v-if="proposals" class="card-columns list-unstyled">
        <li v-for="proposal in filteredList" :key="proposal.id" class="card">
          <!-- <img :src="restaurant.image.url" class="card-img-top" /> -->
          <div class="card-body">
            <h5 class="card-title">{{ proposal.name }}</h5>
            <p class="card-text">
              {{ proposal.description || 'No description provided' }}
            </p>
            <b-form-checkbox
              :value="{
                proposalId: proposal.id,
                proposalName: proposal.name,
                blockchainId: proposal.blockchainId
              }"
              size="lg"
            />
            Vote!
            <p v-if="userRole == 'admin'" class="card-text">
              {{ 'voteCount: ' + proposal.voteCount || 'VoteCount' }}
            </p>
            <b-button
              v-b-modal="'deleteModal' + proposal.id"
              v-if="userRole == 'admin'"
              variant="danger"
            >
              Delete
            </b-button>
          </div>
          <delete-proposal-modal
            :prop-id="proposal.id"
            :prop-name="proposal.name"
          />
        </li>
      </ul>
    </b-form-checkbox-group>
    <modal-vote :selected-proposals="selectedProposals" />
    <b-button v-b-modal="'voteModal'" variant="primary">
      vote
    </b-button>
    <div>
      Selected proposals: <strong>{{ selectedProposals }}</strong>
    </div>
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
      responsed: false,
      selectedProposals: []
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
