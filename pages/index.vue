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
                <create-candidates-form />
              </div>
            </div>
          </b-tab>
          <b-tab title="Proposals" active>
            <div class="row">
              <div class="col-md-12">
                <proposal-card />
              </div>
            </div>
          </b-tab>
          <b-tab title="Candidates" active>
            <div class="row">
              <div class="col-md-12">
                <candidate-card />
              </div>
            </div>
          </b-tab>
        </b-tabs>
      </div>
    </div>
  </section>
</template>

<script>
import CandidateCard from '../components/candidateCard.vue'
import CreateCandidatesForm from '../components/createCandidatesForm.vue'
import CreateProposalForm from '../components/createProposalForm.vue'
import ProposalCard from '../components/proposalCard.vue'
import { mapMutations } from 'vuex'

export default {
  components: {
    CreateProposalForm,
    ProposalCard,
    CreateCandidatesForm,
    CandidateCard
  },
  data() {
    return {
      query: ''
    }
  },
  computed: {
    userRole() {
      return this.$store.getters['auth/roll']
    }
  },
  mounted() {
    mapMutations({
      getUser: 'auth/user',
      getJwt: 'auth/jwt',
      getRoll: 'auth/roll'
    })
  }
}
</script>
