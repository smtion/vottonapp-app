<template>
  <v-row>
    <v-col>
      <v-item-group
        v-if="!finished && answers.length"
        v-model="answerIndex"
      >
        <v-container>
          <v-row>
            <v-col
              v-for="(answer, index) in answers"
              :key="`a_${index}`"
              cols="12"
            >
              <v-item v-slot="{ active, toggle }">
                <v-card
                  :color="active ? 'primary' : ''"
                  class="d-flex align-center"
                  @click="toggle"
                >
                  <v-card-text
                    class="text-h6 text-center"
                    :class="{ 'white--text': answerIndex == index }"
                  >
                    {{ answer.value }}
                  </v-card-text>
                </v-card>
              </v-item>
            </v-col>
            <v-col class="text-center">
              <v-spacer />
              <v-btn
                v-if="answers.length"
                color="primary"
                nuxt
                x-large
                @click="vote"
                :disabled="answerIndex == undefined || voted || finished"
              >
                <span v-if="voted">Voted!</span>
                <span v-else>Vote</span>
              </v-btn>
              <v-spacer />
            </v-col>
          </v-row>
        </v-container>
      </v-item-group>

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
          </v-row>
        </v-container>
      </v-item-group>

      <v-card v-else>
        <v-card-text class="text-center">
          <p class="text-h6">
            No vote yet!
          </p>
          <p class="text-h6">
            Wait please :)
          </p>
          <p>
            Tip. Votton means vote button!
          </p>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { ClientJS } from 'clientjs'

export default {
  name: 'MemberPage',
  data: () => ({
    ws: null,
    timer: null,
    answerIndex: null,
    answers: [],
    result: [],
    clientjs: null,
    voted: false,
    finished: false,
  }),
  computed: {
    code() { return this.$route.params.code },
    wsHost() { return process.env.wsHost },
    voterId() { return this.clientjs.getFingerprint() }
  },
  created() {
    this.clientjs = new ClientJS()

    if (this.code === undefined) {
      this.$router.push("/")
    } else {
      console.info(`Code: ${this.code}`)
      console.info(`wsHost: ${this.wsHost}`)
      console.log(`voterId: ${this.voterId}`)
    }
  },
  mounted() {
    this.init()
  },
  destroyed() {
    if (this.ws) {
      this.ws.close()
      console.log('WebSocket is closed')
    }
  },
  methods: {
    init() {
      this.resetAnswers()
      this.connectWs()
    },
    connectWs() {
      this.ws = new WebSocket(`${this.wsHost}/member/${this.code}`)
      this.ws.onopen = () => {
        console.log('WebSocket is created')

        this.timer = setInterval(() => {
          if (this.ws) {
            this.ws.send('{}')
          }
        }, 10000)

        this.getVote()
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
      if (msg.messageType == 'START') {
        this.voted = false
        this.finished = false
        this.getVote()
      } else if (msg.messageType == 'FINISH') {
        this.finished = true
        this.reportVote()
      } else if (msg.messageType == 'CLOSE') {
        alert("투표가 종료되었습니다. 메인페이지로 이동합니다.")
        this.$router.push("/")
      }
    },
    getVote() {
      this.$store.dispatch('getVote', { code: this.code })
        .then(res => {
          console.log(res)
          this.answers = res.data.answers
        })
        .catch(ex => {
          console.error(ex)
        })
    },
    vote() {
      this.$store.dispatch('vote', { code: this.code, data: { voterId: this.voterId, answerIndex: this.answerIndex } })
        .then(res => {
          this.voted = true
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
          this.answerIndex = null
        })
        .catch(ex => {
          console.error(ex)
        })
    },
    resetVote() {
      this.created = false
      this.finished = false
      this.resetAnswers()
    },
    removeAnswer(index) {
      this.answers.splice(index, 1)
    },
    resetAnswers() {
      this.answers = []
    }
  }
}
</script>
