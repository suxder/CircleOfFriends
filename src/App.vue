<template>
  <div id="app">
    <div class="container">
      <header>
      </header>
      <main></main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/**
  初始化基准字号
*/
:root {
  font-size: 1em;
}

* {
  box-sizing: border-box;
}

body {
  font-size: 1rem;
  width: 100vw;
  height: 100vh;
  margin: 0;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100%;
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}
</style>
