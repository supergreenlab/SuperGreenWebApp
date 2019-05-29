<template>
  <section :id='$style.container'>
    <small>{{ title }}</small>
    <div :id='$style.icon' :class='blink ? $style.blink : ""' :style='{"background-image": `url(${require(`~/assets/img/${icon}`)})`}' />
    <b :id='$style.value'>{{ value }}</b>
  </section>
</template>

<script>
export default {
  props: ['title', 'value', 'icon', 'blink', ],
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
  margin: 0pt 0

@keyframes blinker {
  50% {
    opacity: 0.4;
  }
}

.blink
  animation: blinker 1s linear infinite;

#icon
  height: 30pt
  width: 30pt
  margin: 5pt
  background-position: center
  background-repeat: no-repeat
  background-size: contain

</style>
