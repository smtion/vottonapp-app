<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-card class="logo py-4 d-flex justify-center">
        <VottonLogo />
      </v-card>
      <v-card>
        <v-card-title class="headline justify-center">
          Started to easy voting!
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Entrance Code"
                  outlined
                  hide-details
                  v-model="code"
                ></v-text-field>
              </v-col>
              <v-col class="d-flex justify-center">
                <v-btn
                  small
                  color="primary"
                  outlined
                  @click="generateCode"
                >
                  Auto generate
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            nuxt
            x-large
            @click="makeVoteRoom"
          >
            Make
          </v-btn>
          <v-spacer />
          <v-btn
            color="primary"
            nuxt
            x-large
            @click="joinVoteRoom"
          >
            Join
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'IndexPage',
  data: () => ({
    code: '',
  }),
  mounted() {
    // this.generateCode()
  },
  methods: {
    generateCode() {
      this.code = Math.random().toString().substr(2, 6)
    },
    makeVoteRoom() {
      if (! this.code) {
        alert("Code를 입력하세요.")
        return
      }

      this.$store.dispatch('existCode', this.code)
        .then(res => {
          console.log("res:" + res.data)
          if (res.data === true) {
            alert("이미 사용 중인 Code입니다.")
          } else {
            this.$router.push({name: "leader", params: {code: this.code}})
          }
        })
        .catch(ex => {
          console.error(ex)
        })
    },
    joinVoteRoom() {
      if (! this.code) {
        alert("Code를 입력하세요.")
        return
      }

      this.$store.dispatch('existCode', this.code)
        .then(res => {
          if (res.data === true) {
            this.$router.push({name: "member", params: {code: this.code}})
          } else {
            alert("아직 생성되지 않은 Code입니다.")
          }
        })
        .catch(ex => {
          console.error(ex)
        })
    }
  }
}
</script>
