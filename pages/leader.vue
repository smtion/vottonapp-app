<template>
  <v-row>
    <v-col class="text-center">
      <v-container v-if="!finished">
        <v-row>
          <v-col cols="12">
            <span class="text-h6">Register Answers</span>
            <div>
              Member count: {{ memberCount }}
            </div>
            <div>
              Voter count: {{ voterCount }}
            </div>
          </v-col>
          <v-col
            v-for="(answer, index) in answers"
            :key="index"
            cols="12"
          >
            <v-text-field
              v-if="!created"
              :label="`#${index+1}`"
              hide-details
              outlined
              v-model="answers[index]"
              append-outer-icon="mdi-close"
              @click:append-outer="removeAnswer(index)"
            ></v-text-field>
            <v-text-field
              v-else
              :label="`#${index+1}`"
              hide-details
              outlined
              :value="answers[index]"
              readonly
            ></v-text-field>
          </v-col>
          <v-col
            v-if="!created"
            cols="12"
          >
            <v-btn
              outlined
              color="primary"
              @click="addAnswer"
            >
              + Add
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn
              v-if="!created"
              color="primary"
              nuxt
              x-large
              @click="createVote"
            >
              Vote Start
            </v-btn>
            <v-btn
              v-else-if="created"
              color="primary"
              nuxt
              x-large
              @click="finishVote"
            >
              Finish
            </v-btn>
            <v-btn
              v-if="!created"
              color="primary"
              nuxt
              x-large
              outlined
              @click="close"
            >
              Close
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

      <v-item-group
        v-else-if="finished"
      >
        <v-container>
          <v-row>
            <v-col
              v-for="(item, index) in result"
              :key="`r_${index}`"
              cols="12"
            >
              <v-item>
                <v-card
                  class="d-flex align-center"
                >
                  <v-card-text class="text-h6 text-center">
                    {{ item.answer.value }} ({{ item.voters.length }})
                  </v-card-text>
                </v-card>
              </v-item>
            </v-col>
            <v-col cols="12" class="text-center">
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="primary"
                  nuxt
                  x-large
                  @click="resetVote"
                >
                  New Vote
                </v-btn>
                <v-spacer />
                <v-btn
                  color="primary"
                  nuxt
                  x-large
                  outlined
                  @click="close"
                >
                  Close
                </v-btn>
                <v-spacer />
              </v-card-actions>
            </v-col>
          </v-row>
        </v-container>
      </v-item-group>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'LeaderPage',
  data: () => ({
    ws: null,
    timer: null,
    answers: [],
    result: [],
    created: false,
    finished: false,
    memberCount: 0,
    voterCount: 0,
    members: new Set(),
    voters: new Set(),
  }),
  computed: {
    code() { return this.$route.params.code },
    wsHost() { return process.env.wsHost }
  },
  created() {
    if (this.code === undefined) {
      this.$router.push("/")
    } else {
      console.info(`Code: ${this.code}`)
      console.info(`wsHost: ${this.wsHost}`)
    }
  },
  mounted() {
    this.init()
  },
  destroyed() {
    if (this.ws) {
      this.$store.dispatch('close', { code: this.code })
      this.ws.close()
    }
  },
  methods: {
    init() {
      this.resetAnswers()
      this.connectWs()
    },
    connectWs() {
      this.ws = new WebSocket(`${this.wsHost}/leader/${this.code}`)
      this.ws.onopen = () => {
        console.log('WebSocket is created')

        this.timer = setInterval(() => {
          if (this.ws) {
            this.ws.send('{}')
          }
        }, 10000)
      }
      this.ws.onmessage = event => {
        const msgJson = JSON.parse(event.data)
        console.log('Received data: ', msgJson)

        this.handleWsMessage(msgJson)
      }
      this.ws.onclose = () => {
        console.log('WebSocket is closed')
        clearInterval(this.timer)
      }
    },
    handleWsMessage(msg) {
      if (msg.messageType == 'JOIN' || msg.messageType == 'LEAVE') {
        this.memberCount = msg.currentMemberCount
        // this.members.add(msg.voterId)
      } else if (msg.messageType == 'VOTE') {
        this.voters.add(msg.voterId)
        this.voterCount = this.voters.size
      }
    },
    addAnswer() {
      this.answers.push("")
    },
    createVote() {
      if (this.answers.filter(answer => answer.length == 0).length) {
        alert("답변을 입력하세요.")
        return
      }
      console.log('createVote')

      this.$store.dispatch('createVote', { code: this.code, data: { answers: this.answers } })
        .then(res => {
          this.created = true
        })
        .catch(ex => {
          console.error(ex)
        })
    },
    finishVote() {
      console.log('finishVote')

      this.$store.dispatch('finishVote', { code: this.code })
        .then(res => {
          this.reportVote()
        })
        .catch(ex => {
          console.error(ex)
        })
    },
    reportVote() {
      this.$store.dispatch('reportVote', { code: this.code })
        .then(res => {
          this.finished = true
          this.result = res.data.answers
        })
        .catch(ex => {
          console.error(ex)
        })
    },
    resetVote() {
      this.created = false
      this.finished = false
      this.voterCount = 0
      this.resetAnswers()
    },
    removeAnswer(index) {
      this.answers.splice(index, 1)
    },
    resetAnswers() {
      this.answers = ['', '']
    },
    close() {
      this.$store.dispatch('close', { code: this.code })
      this.$router.push("/")
    }
  }
}
</script>
