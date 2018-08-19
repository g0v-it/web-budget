<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/treemap">TreeMap</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>
body {
  height: 100%;
  width: 100%;
  margin: 0;
}

#app {
  width: 100%;
  height: 100%;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
