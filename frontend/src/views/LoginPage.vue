<template>
    <div class="login-content">
        <div>
            <div class="panel">
                <div class="panel-header">
                    <img src="/iplayarr.png" alt="Image" class="logo">
                </div>
                <div class="panel-body">
                    <div class="sign-in">SIGN IN TO CONTINUE</div>
                    <div class="form-group">
                        <input type="email" class="form-input" placeholder="Username" v-model="loginForm.username" @keyup.enter="login"/>
                    </div>
                    <div class="form-group">
                        <input type="password" class="form-input" placeholder="Password" v-model="loginForm.password" @keyup.enter="login"/>
                    </div>
                    <button type="button" class="button" @click="login">Login</button>
                    <div id="login-failed" class="login-failed" v-if="error">
                        Incorrect Username or Password
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { getHost } from '@/lib/utils';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const loginForm = ref({
    username: '',
    password: ''
});

const error = ref(false);

const login = async () => {
    const response = await fetch(`${getHost()}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm.value),
        credentials: "include"
    });
    if (response.ok) {
        router.push('/queue');
    } else {
        error.value = true;
    }
}
</script>

<style scoped>
.login-content {
    display: flex;
    justify-content: center;
}

.login-content>div {
    flex: 0 0 325px;
}

.panel {
    margin-top: 50px;
    border-radius: 4px;
}

.panel-header {
    display: flex;
    justify-content: center;
    padding: 10px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    background-color: #494949;
}

.logo {
    width: 32px;
    height: 32px;
}

.panel-body {
    padding: 20px;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
    background-color: #111;
}

.sign-in {
    padding: 10px 0;
    text-align: center;
}

.form-group {
    margin: 20px 0;
}

.form-input {
    box-sizing: border-box;
    padding: 6px 16px;
    width: 100%;
    height: 35px;
    background-color: #333;
    border: 1px solid #dde6e9;
    border-radius: 4px;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
    color: #ccc;
}

.button {
    overflow: hidden;
    margin-top: 20px;
    padding: 10px 0;
    width: 100%;
    border: 1px solid;
    border-color: #5899eb;
    border-radius: 4px;
    background-color: #5d9cec;
    color: var(--white);
    vertical-align: middle;
    text-align: center;
    white-space: nowrap;
    line-height: normal;
}

.login-failed {
    margin-top: 20px;
    color: #f05050;
    font-size: 14px;
}
</style>
