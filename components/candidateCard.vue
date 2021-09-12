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
    <ul v-if="candidates" class="card-columns list-unstyled">
      <li v-for="candidate in filteredList" :key="candidate.id" class="card">
        <!-- <img :src="restaurant.image.url" class="card-img-top" /> -->
        <div class="card-body">
          <h5 class="card-title">{{ candidate.name }}</h5>
          <!-- <p class="card-text">
            {{ candidate.description || 'No description provided' }}
          </p> -->
          <b-button
            v-b-modal="'deleteCandidateModal' + candidate.id"
            v-if="userRole == 'admin'"
            variant="danger"
          >
            Delete
          </b-button>
        </div>
        <b-button v-b-modal="'voteModal'" variant="primary">
          vote
        </b-button>
        <vote-candidate-modal
          :prop-id="candidate.id"
          :prop-name="candidate.name"
        />
        <delete-proposal-modal
          :prop-id="candidate.id"
          :prop-name="candidate.name"
        />
      </li>
    </ul>
    <div>
      Selected candidate: <strong>{{ selectedCandidate }}</strong>
    </div>
  </div>
</template>

<script>
import DeleteCandidateModal from './deleteCandidateModal.vue'
import VoteCandidateModal from './voteCandidateModal.vue'
const apiUrl = process.env.API_URL || 'http://localhost:1337'
export default {
  components: { VoteCandidateModal, DeleteCandidateModal },
  data() {
    return {
      query: '',
      selectedCandidate: '',
      responsed: false
    }
  },
  computed: {
    filteredList() {
      return this.candidates.filter(candidate => {
        return candidate.name.toLowerCase().includes(this.query.toLowerCase())
      })
    },
    candidates() {
      return this.$store.getters['candidates/list']
    },
    userRole() {
      return this.$store.getters['auth/userRoll']
    }
  },
  created() {
    this.fetchCandidates()
  },
  methods: {
    async fetchCandidates() {
      this.$store.commit('candidates/emptyList')
      const response = await this.$axios.get(apiUrl + '/candidates')
      if (response) {
        response.data.forEach(candidate => {
          // restaurant.image.url = `${apiUrl}${restaurant.image.url}`
          this.$store.commit('candidates/add', {
            id: candidate.id,
            ...candidate
          })
        })
        return true
      }
    }
  }
}
</script>
