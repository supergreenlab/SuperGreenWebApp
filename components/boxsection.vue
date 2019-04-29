<template>
  <section :id='$style.container'>
    <div :id='$style.header' :style='headerstyle'>
      <img :src='require(`~/assets/img/${icon}`)' />
      <h2 :style='{color: (dark ? "#676767" : "")}'>{{ title }}</h2>
      <a v-if='link && linkurl' :href='linkurl' target='_blank'>{{ link }}</a>
    </div>
    <div :id='$style.body'>
      <slot></slot>
    </div>
  </section>
</template>

<script>

export default {
  props: ['icon', 'title', 'link', 'linkurl', 'color', 'gradientfrom', 'gradientto', 'dark',],
  computed: {
    headerstyle() {
      const {
        color, gradientfrom, gradientto,
      } = this.$props
      if (color) {
        return {'background-color': color}
      } else if (gradientfrom && gradientto) {
        return {'background-image': `linear-gradient(90deg, ${gradientfrom} 0%, ${gradientto} 100%)`}
      }
    },
  },
}

</script>

<style module lang=stylus>

#container
  position: relative
  margin: 0 auto
  display: flex
  flex-direction: column
  width: 100%

#header
  position: relative
  display: flex
  width: 100%
  align-items: center
  padding: 7pt 10pt
  color: white
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25)

#header > img
  margin-right: 10pt

#header > a
  position: absolute
  right: 5pt
  bottom: 5pt
  cursor: pointer
  text-decoration: underline
  color: white
  font-size: 0.8em

#header > a:hover
  opacity: 0.8

#body
  flex: 1
  padding-left: 20pt

</style>
