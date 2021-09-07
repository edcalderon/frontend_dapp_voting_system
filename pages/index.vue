<template>
  <section class="container">
    <div class="row">
      <div class="col-md-12">
        <b-tabs content-class="mt-3" fill align="center">
          <b-tab
            v-if="userRole == 'admin'"
            title="Create Proposals and Candidates"
            active
          >
            <div class="row">
              <div class="col-md-12">
                <create-proposal-form />
              </div>
            </div>
          </b-tab>
          <b-tab title="Propuestas" active>
            <div class="row">
              <div class="col-md-12">
                <proposal-card />
              </div>
            </div>
          </b-tab>
          <b-tab title="Candidatos"><p>I'm the second tab</p></b-tab>
        </b-tabs>
      </div>
    </div>
  </section>
</template>

<script>
import CreateProposalForm from '../components/createProposalForm.vue'
import ProposalCard from '../components/proposalCard.vue'

export default {
  components: { CreateProposalForm, ProposalCard },
  data() {
    return {
      query: ''
    }
  },
  computed: {
    userRole() {
      return this.$store.getters['auth/roll']
    }
  }
}
</script>
