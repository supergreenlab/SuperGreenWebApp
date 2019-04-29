<template>
  <section :id='$style.container'>
    <section :id='$style.menu'>
      <Logo margin='5pt' vertical=true size='1.2em' />
      <Controllers />
    </section>
    <section :id='$style.body'>
      <nuxt />
    </section>
  </section>
</template>

<script>
import Logo from '../components/logo'
import Controllers from '../components/controllers'

export default {
  components: { Logo, Controllers, },
}
</script>

<style module lang=stylus>

#container
  flex: 1
  position: relative
  display: flex
  width: 100vw
  height: 100vh

#menu
  display: flex
  background-color: #454545
  flex-direction: column
  box-shadow: 4px 0px 4px rgba(0, 0, 0, 0.25)
  z-index: 100

#body
  flex: 1
  display: flex
  justify-content: stretch
  align-items: stretch

</style>
