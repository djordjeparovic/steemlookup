<template>
  <div :class="[{'day-theme': theme === 'day-theme'}]">
    <div class="header-track">
      <span>Discovering exceptional content.</span>
      <router-link v-if="!userLoggedIn" to="/login">Login</router-link>
      <a v-if="userLoggedIn" href="#" @click="logout">Logout</a>
      <a href="/help">Help</a>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  name: "SteemSearchEngine",
  data () {
    return {
      userLoggedIn: false,
      theme: ''
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

    try {
      const theme = localStorage.getItem('user-theme')
      if (theme) {
        this.theme = theme;
        window.theme = theme;
      } else {
        this.theme = 'night-theme';
        window.theme = this.theme;
      }
    } catch (e) {
      console.log(e);
    }

    window.addEventListener('change-theme', () => {
      this.theme = window.theme;
      try {
        localStorage.setItem('user-theme', window.theme);
      } catch (e) {
        console.log(e);
      }
    });
  },
  updated () { // todo event-bus
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
