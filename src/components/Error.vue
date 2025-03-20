<template>
  <div class="error-container">
    <h1>Error</h1>
    <p>The page you are looking for was not found.</p>
    <router-link to="/">Back to login</router-link>
  </div>
</template>

<script setup></script>

<style scoped>
.error-container {
  text-align: center;
  padding: 50px;
  background-color: #eceaea;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 50px auto;
}
.error-container h1 {
  color: #e74c3c;
}
.error-container p {
  font-size: 1.2em;
}
.error-container a {
  text-decoration: none;
  color: #646cff;
}
</style>
