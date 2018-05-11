<template>
  <div>
    <div class="header-track">
      <span>Discovering exceptional content.</span>
      <router-link v-if="!userLoggedIn" to="/login">Login</router-link>
      <a v-if="userLoggedIn" href="#" @click="logout">Logout</a>
      <a href="/help">Help</a>
    </div>
    <!-- <router-link to="/">Go go Search</router-link>
    <router-link to="/login">Go go Login</router-link> -->
    <router-view></router-view>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  name: "SteemSearchEngine",
  data () {
    return {
      userLoggedIn: false
    }
  },
  created () {
    try {
      let token = localStorage.getItem('SL-user-token')
      if(token) {
        this.userLoggedIn = true
      }
    } catch (e) {
      console.log(e)
    }
  },
  updated () {
    this.userLoggedIn =  !!window.userLoggedIn;
  },
  methods: {
    logout () {
      axios.post(`/logout`)
        .then(
          response => {
            this.userLoggedIn = false
            window.userLoggedIn = false;
            localStorage.removeItem('SL-user-token')
          }
        )
        .catch(
          error => {
            console.log(error)
          }
        )
    }
  }
};
</script>
