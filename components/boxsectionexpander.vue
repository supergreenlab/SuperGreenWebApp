<template>
  <section :id='$style.container' :class='expanded ? $style.expanded : ""' @click='onClick'>
    <img src='~/assets/img/expander.svg' />
  </section>
</template>

<script>
export default {
  props: ['expanded', ],
  methods: {
    onClick() {
      this.$emit('click')
    }
  },
}
</script>

<style module lang=stylus>

#container
  display: flex
  position: absolute
  bottom: 0
  width: 100%
  align-items: center
  justify-content: center
  cursor: pointer
  height: 25px

#container > img
  transform: rotate(0deg)  
  transition: transform 0.2s

#container.expanded > img
  transform: rotate(180deg)  

</style>
