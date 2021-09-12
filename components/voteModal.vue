<template>
  <div>
    <b-modal
      :id="'voteModal' + propId"
      :ref="'voteModal' + propId"
      title="Confirm your vote"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <p>Are you sure to vote fot the proposal: {{ propName }}?</p>
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          :state="dateState"
          label="Confirm c.c expiration date"
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
    },
    propName: {
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
    userId() {
      return this.$store.getters['auth/userId']
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
      bvModalEvt.preventDefault()
      this.handleSubmit()
    },
    handleSubmit() {
      // Exit when the form isn't valid
      console.log(this.propId)
      if (!this.checkFormValidity()) {
        return
      }
      this.$nextTick(() => {
        try {
          this.loading = true
          this.voteProposal(this.propId, this.userId(), this.date).then(
            this.$bvModal.hide('modal-vote')
          )
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
    async voteProposal(proposalId, userId, sendPassword) {
      const config = {
        headers: { Authorization: `Bearer ` + this.userToken() }
      }
      const body = {
        userId: userId,
        wallet: this.userWallet(),
        proposalId: proposalId,
        sendPassword: sendPassword
      }
      try {
        const response = await this.$axios.post(
          apiUrl + '/proposals/vote/' + proposalId,
          body,
          config
        )
        if (response.data.status == 200) {
          this.fetchProposals()
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
