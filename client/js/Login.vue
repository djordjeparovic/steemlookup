<template>
  <div class="pure-g">
        <form @submit.prevent class="pure-u login-form">
            <div>
                <h4><a href="/">Go back to search</a></h4>
                <h2>Login to SteemLookup</h2>
            </div>
            <div>
                <label>Email:</label>
                <input
                    type="text"
                    name="email"
                    v-model="user.email"
                    required/>
            </div>
            <div>
                <label>Password:</label>
                <input
                    type="password"
                    name="password"
                    v-model="user.password"
                    required/>
            </div>
            <div>
                <span>You don't have account? Please, <router-link to="/register">register</router-link>.</span>
                <br><span v-if="error" class="red">
                    {{ error }}
                </span>
                <button
                    type="button"
                    class="primary-button pure-button u-gray most-right"
                    @click="login"
                >Login</button>
            </div>
        </form>
        <!-- <div>Icons made by <a href="https://www.flaticon.com/authors/simpleicon" title="SimpleIcon">SimpleIcon</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div> -->
  </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'Login',
    data () {
        return {
            user: {
                email: '',
                password: ''
            },
            error: ''
        }
    },
    methods: {
        login () {
            this.error = ''
            axios.post('/login', this.user)
                .then(response => {
                    if (response.data.status === 'fail') {
                        this.error = response.data.message
                        console.log(this.error)
                    } else {
                        try {
                            localStorage.setItem('SL-user-token', JSON.stringify(response.data.token))
                            window.userLoggedIn = true;
                            this.$router.push({name: 'search'})
                        } catch(e) {
                            console.log(e)
                        }   
                    }
                })
                .catch(error => {
                    this.error = error.response.data.message
                })
        },
    },
    mounted() {

    },
};
</script>
