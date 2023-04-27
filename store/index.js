export const actions = {
  existCode({ commit }, code) {
    return new Promise( async (resove, reject) => {
      await this.$axios.get(`${process.env.apiHost}/codes/${code}`).then(res => {
        resove(res);
      })
      .catch(err => {
        console.log(err);
        reject(err.message);
      });
    })
  },
  createVote({ commit }, data) {
    return new Promise( async (resove, reject) => {
      await this.$axios.post(`${process.env.apiHost}/votes/${data.code}`, data.data).then(res => {
        resove(res);
      })
      .catch(err => {
        console.log(err);
        reject(err.message);
      });
    })
  },
  getVote({ commit }, data) {
    return new Promise( async (resove, reject) => {
      await this.$axios.get(`${process.env.apiHost}/votes/${data.code}`).then(res => {
        resove(res);
      })
      .catch(err => {
        console.log(err);
        reject(err.message);
      });
    })
  },
  finishVote({ commit }, data) {
    return new Promise( async (resove, reject) => {
      await this.$axios.put(`${process.env.apiHost}/votes/${data.code}`).then(res => {
        resove(res);
      })
      .catch(err => {
        console.log(err);
        reject(err.message);
      });
    })
  },
  reportVote({ commit }, data) {
    return new Promise( async (resove, reject) => {
      await this.$axios.get(`${process.env.apiHost}/votes/${data.code}/report`).then(res => {
        resove(res);
      })
      .catch(err => {
        console.log(err);
        reject(err.message);
      });
    })
  },
  vote({ commit }, data) {
    return new Promise( async (resove, reject) => {
      await this.$axios.post(`${process.env.apiHost}/votes/${data.code}/vote`, data.data).then(res => {
        resove(res);
      })
      .catch(err => {
        console.log(err);
        reject(err.message);
      });
    })
  },
  close({ commit }, data) {
    return new Promise( async (resove, reject) => {
      await this.$axios.delete(`${process.env.apiHost}/votes/${data.code}`).then(res => {
        resove(res);
      })
      .catch(err => {
        console.log(err);
        reject(err.message);
      });
    })
  }
}
