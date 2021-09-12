<template>
  <div>
    <b-modal
      :id="'deleteCandidateModal' + propId"
      :ref="'deleteCandidateModal' + propId"
      title="Warning!"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <p>Are you sure to delete the candidate {{ propName }}?</p>
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
      name: '',
      id: '',
      nameState: null,
      submittedNames: []
    }
  },
  methods: {
    resetModal() {
      this.name = ''
      this.nameState = null
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
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
      const config = {
        headers: { Authorization: `Bearer ` + this.userToken() }
      }
      try {
        const response = await this.$axios.delete(
          apiUrl + '/proposals/' + id,
          config
        )
        if (response) {
          this.fetchProposals()
          alert('Proposal have been successfully delete.')
          this.loading = false
          return true
        }
      } catch (err) {
        this.loading = false
        alert('An error occurred.')
      }
    },
    handleSubmit() {
      this.$nextTick(() => {
        this.deleteProposal(this.propId).then(
          this.$bvModal.hide('modal-delete')
        )
      })
    }
  }
}
</script>
