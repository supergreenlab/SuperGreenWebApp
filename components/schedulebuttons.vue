<template>
  <section :id='$style.container' :class='selected ? $style.selected : ""' @click='onClick'>
    {{ title }}
    <img :src='require(`~/assets/img/${icon}`)'></div>
    <span :style='{color}'>{{ subtitle }}</span>
  </section>
</template>

<script>
export default {
  props: ['title', 'icon', 'subtitle', 'color', 'selected', ],
  methods: {
    onClick() {
      this.$emit('click')
    },
  },
}
</script>

<style module lang=stylus>

#container
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  border: 1pt solid #C4C4C4
  border-radius: 3pt
  padding: 10pt
  margin: 5pt
  width: 100pt
  height: 100pt
  transition: box-shadow 0.2s
  cursor: pointer

#container > img
  margin: 10pt 0

.selected
  box-shadow: 0 0 0 2pt #3AB20B  

</style>
