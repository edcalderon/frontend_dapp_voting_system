<template>
  <div>
    <b-modal
      id="voteCandidateModal"
      ref="voteCandidateModal"
      title="Confirm your vote"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <p>You are about to vote for this candidate:</p>
      <ul class="card-columns list-unstyled">
        {{
          candidate ? candidate.name : ''
        }}
      </ul>
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          :state="dateState"
          label="To vote for candidate please confirm your CC/DNI expiration date"
          label-for="date-input"
          invalid-feedback="Date is required"
        >
          <b-form-input
            id="date-input"
            v-model="date"
            :state="dateState"
            placeholder="24/12/1970"
            required
          />
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
const apiUrl = process.env.API_URL || 'http://localhost:1337'
export default {
  props: {
    candidate: {
      type: '',
      default: null
    }
  },
  data() {
    return {
      date: '',
      dateState: null
    }
  },
  methods: {
    userWallet() {
      return this.$store.getters['auth/userWallet']
    },
    userId() {
      return this.$store.getters['auth/userId']
    },
    userToken() {
      return this.$store.getters['auth/jwt']
    },
    async getCandidateVoteCount() {
      try {
        const response = await this.$axios.get(
          apiUrl + '/candidate/' + this.candidate.id
        )
        if (response) {
          return response.data.voteCount
        }
      } catch (err) {
        alert('An error occurred.')
      }
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity()
      this.dateState = valid
      return valid
    },
    resetModal() {
      this.date = ''
      this.dateState = null
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault()
      this.handleSubmit()
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return
      }
      this.$nextTick(() => {
        try {
          this.loading = true
          this.voteCandidate(this.candidate, this.userId(), this.date).then(
            this.$bvModal.hide('modal-vote')
          )
        } catch (err) {
          this.loading = false
          alert('An error occurred.')
        }
      })
    },
    async fetchCandidates() {
      this.$store.commit('candidates/emptyList')
      const response = await this.$axios.get(apiUrl + '/candidates')
      if (response) {
        response.data.forEach(candidate => {
          this.$store.commit('candidates/add', {
            id: candidate.id,
            ...candidate
          })
        })
        return true
      }
    },
    async vote(candidateId, userId, sendPassword) {
      const config = {
        headers: { Authorization: `Bearer ` + this.userToken() }
      }
      const body = {
        userId: userId,
        wallet: this.userWallet(),
        candidateId: candidateId,
        sendPassword: sendPassword
      }
      try {
        const response = await this.$axios.post(
          apiUrl + '/candidates/vote',
          body,
          config
        )
        if (response.data.status == 200) {
          this.fetchCandidates()
          alert('You have been vote successfully.')
          this.loading = false
          return true
        }
        if (response.data.status == 403) {
          alert('Dates do not match.')
          this.loading = false
          return true
        }
      } catch (err) {
        this.loading = false
        alert('An error occurred.')
      }
    }
  }
}
</script>
