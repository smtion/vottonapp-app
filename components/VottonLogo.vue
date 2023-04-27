<template>
  <img
    class="votton-logo"
    alt="Votton Logo"
    src="/vuetify-logo.svg"
  >
</template>

<style>
.votton-logo {
  height: 100px;
  width: 100px;
  transform: rotateY(560deg);
  animation: turn 3.5s ease-out forwards 1s;
}

@keyframes turn {
  100% {
    transform: rotateY(0deg);
  }
}
</style>
