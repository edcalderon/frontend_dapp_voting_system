<template>
  <div>
    <b-modal
      id="modal-vote"
      ref="modal"
      title="Confirm your vote"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          :state="dateState"
          label="expiration date cc"
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
    propId: {
      type: String,
      default: ''
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
    userToken() {
      return this.$store.getters['auth/jwt']
    },
    async getProposalVoteCount() {
      try {
        const response = await this.$axios.get(
          apiUrl + '/proposals/' + this.propId
        )
        if (response) {
          const voteCount = response.data.voteCount
          return voteCount
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
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return
      }
      // Hide the modal manually
      this.$nextTick(() => {
        try {
          this.loading = true
          this.fetchAndVote().then(this.$bvModal.hide('modal-vote'))
        } catch (err) {
          this.loading = false
          alert('An error occurred.')
        }
      })
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
    async fetchAndVote() {
      const voteCount = await this.getProposalVoteCount()
      this.voteProposal(this.propId, voteCount)
    },
    async voteProposal(id, voteCount) {
      console.log(voteCount)
      const config = {
        headers: { Authorization: `Bearer ` + this.userToken() }
      }
      const body = {
        voteCount: parseInt(voteCount) + 1
      }
      try {
        const response = await this.$axios.put(
          apiUrl + '/proposals/' + id,
          body,
          config
        )
        if (response) {
          this.fetchProposals()
          alert('You have been vote successfully.')
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
