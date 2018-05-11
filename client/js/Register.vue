<template>
  <div class="pure-g">
    <form @submit.prevent class="pure-u login-form">
      <div>
        <h4><a href="/">Go back to search</a></h4>
        <h2>Register to SteemLookup</h2>
      </div>
      <div>
        <label for="name">Name:</label>
        <input
          type="text"
          name="name"
          v-model="newUser.name"
          required>
      </div>

      <div>
        <label for="email">Email:</label>
        <input
          type="email"
          name="email"
          v-model="newUser.email"
          required>
      </div>

      <div>
        <label for="password">Password:</label>
        <input
          type="password"
          name="password"
          v-model="newUser.password"
          required>
      </div>

      <div>
        <label for="repeatPassword">Repeat password:</label>
        <input
          type="password"
          name="repeatPassword"
          v-model="repeatPassword"
          required>
      </div>

      <div>
        <span v-if="error" class="red">{{ error }}</span>
        <button
          class="primary-button pure-button u-gray most-right"
          @click="register"
        >Register</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      newUser: {
        name: '',
        email: '',
        password: ''
      },
      repeatPassword: '',
      error: ''
    }
  },
  methods: {
    register () {
      if (this.newUser.password !== this.repeatPassword) {
        this.error = 'Passwords do no match!';
        return;
      }
      this.error = ''
      axios.post('/register', this.newUser)
        .then(response => {
          if(response.data.status === 'fail') {
            this.error = response.data.message
          } else {
            this.$router.push({name: 'login'})
          }
        })
        .catch(error => {
          this.error = error.response.data.message
        })
    }
  }
}
</script>
