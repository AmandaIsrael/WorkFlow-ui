<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <input type="text" v-model="username" placeholder="User" />
        <div class="password-container">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="Password"
          />
          <span @click="togglePasswordVisibility" class="eye-icon">
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </span>
        </div>
        <button type="submit">Sign-in</button>
      </form>
      <button type="submit" class="sign-up" @click="openAddUser()">
        Sign-up
      </button>
    </div>

    <div v-if="isOpenModal" class="modal-overlay" @click="closeModal">
      <div class="add-user-modal" @click.stop>
        <AddUser />
      </div>
    </div>
  </div>
</template>

<script>
import AddUser from './Modal/AddUser.vue';

export default {
  components: {
    AddUser,
  },
  data() {
    return {
      username: '',
      password: '',
      showPassword: false,
      isOpenModal: false,
    };
  },
  methods: {
    handleLogin() {
      console.log('Login clicado:', this.username, this.password);
      // Simulação de login, substitua pela lógica real
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    openAddUser() {
      this.isOpenModal = true;
    },
    closeModal() {
      this.isOpenModal = false;
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #242424;
}

.login-card {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 350px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 390px;
}

h1 {
  margin-bottom: 20px;
}

.password-container {
  position: relative;
}

.eye-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 18px;
  color: #646cff;
}

.sign-up {
  width: 100%;
  background-color: #ffffff;
  color: #646cff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: auto;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.add-user-modal {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.3);
  width: 400px;
  max-width: 90%;
  position: relative;
}
</style>
