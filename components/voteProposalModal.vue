<template>
  <div>
    <b-modal
      id="voteModal"
      ref="voteModal"
      title="Confirm your vote"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <div v-if="!haveVoted">
        <p>You are about to vote for this proposals:</p>
        <ul class="card-columns list-unstyled">
          <li v-for="proposal in selectedProposals" :key="proposal.proposalId">
            {{ proposal ? proposal.proposalName : '' }}
          </li>
        </ul>
        <form ref="form" @submit.stop.prevent="handleSubmit">
          <b-form-group
            :state="dateState"
            label="To vote for proposals please confirm your CC/DNI expiration dat"
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
      </div>
      <div v-else>
        <p>You have already voted</p>
      </div>
    </b-modal>
  </div>
</template>

<script>
const apiUrl = process.env.API_URL || 'http://localhost:1337'
export default {
  props: {
    selectedProposals: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      date: '',
      dateState: null,
      haveVoted: this.user().voteProposalState
    }
  },
  methods: {
    userWallet() {
      return this.$store.getters['auth/userWallet']
    },
    userId() {
      return this.$store.getters['auth/userId']
    },
    user() {
      return this.$store.getters['auth/user']
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
          this.vote(this.selectedProposals, this.userId(), this.date).then(
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
          this.$store.commit('proposals/add', {
            id: proposal.id,
            ...proposal
          })
        })
        return true
      }
    },
    async vote(selectedProposals, userId, sendPassword) {
      const config = {
        headers: { Authorization: `Bearer ` + this.userToken() }
      }
      const body = {
        userId: userId,
        wallet: this.userWallet(),
        selectedProposals: selectedProposals,
        sendPassword: sendPassword
      }
      try {
        const response = await this.$axios.post(
          apiUrl + '/proposals/vote',
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
