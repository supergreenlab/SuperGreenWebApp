<template>
  <section :id='$style.container'>
    <small>{{ title }}</small>
    <h1 :id='$style.value' :style='{color}' :class='blink ? $style.blink : ""'>{{ value }}</h1>
  </section>
</template>

<script>
export default {
  props: ['title', 'value', 'color', 'blink', ],
}
</script>

<style module lang=stylus>

#container
  flex: 1
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  color: #777777

#value
  margin: 5pt 0
  color: #3BB30B

@keyframes blinker {
  50% {
    opacity: 0.4;
  }
}

.blink
  animation: blinker 1s linear infinite;

</style>
