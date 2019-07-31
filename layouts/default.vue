<template>
  <section :id='$style.container'>
    <section :id='$style.menu' :class='(!shown && hasController) ? $style.hide : ""'>
      <Logo margin='5pt' vertical=true size='1.2em' />
      <Controllers />
    </section>
    <section :id='$style.body'>
      <nuxt />
      <div v-if='shown || !hasController' :id='$style.touch' v-touch:swipe.left='hide' v-on:click='hide'></div>
    </section>
  </section>
</template>

<script>
import Logo from '../components/logo'
import Controllers from '../components/controllers'

export default {
  data() {
    return {
      shown: true
    }
  },
  components: { Logo, Controllers, },
  mounted() {
    this.$root.$on('menu', () => {
      this.show()
    })
  },
  methods: {
    show() {
      this.$data.shown = true
    },
    hide() {
      this.$data.shown = false
    },
  },
  computed: {
    hasController() {
      return this.$route.params.controller
    },
  },
}
</script>

<style module lang=stylus>

#container
  flex: 1
  position: relative
  display: flex
  width: 100vw
  height: 100vh
  overflow-y: hidden

#menu
  display: flex
  background-color: #454545
  flex-direction: column
  box-shadow: 4px 0px 4px rgba(0, 0, 0, 0.25)
  z-index: 1000
  transition: margin-left 0.2s, opacity 0.5s
  height: 100vh
  @media screen and (max-width: 600px)
    z-index: 2000
    position: absolute
    top: 0
    left: 0

#menu.hide
  margin-left: -100%

#body
  flex: 1
  position: relative
  display: flex
  justify-content: stretch
  align-items: stretch

#touch
  position: absolute
  top: 0
  left: 0
  width: 100vw
  height: 100vh

  @media screen and (min-width: 600px)
    display: none

</style>
