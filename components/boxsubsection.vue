<template>
  <section :id='$style.container'>
    <div :id='$style.header'>
      <img :src='require(`~/assets/img/${icon}`)' />
      <div :id='$style.title'>
        <b>{{ title }}</b>
        <small v-if='subtitle'>{{ subtitle }}</small>
      </div>
      <h2 v-if='value'>{{ value }}</h2>
      <div :id='$style.underline'></div>
    </div>
    <div :id='$style.body' :style='{height}'>
      <slot></slot>
    </div>
  </section>
</template>

<script>

export default {
  props: ['icon', 'title', 'subtitle', 'value', 'height',],
}

</script>

<style module lang=stylus>

#container
  display: flex
  flex-direction: column
  width: 100%
  overflow-y: hidden

#header
  position: relative
  display: flex
  width: center
  margin: 5pt
  padding: 2pt
  align-items: center
  min-height: 45pt

#title
  flex: 1
  flex-direction: column
  color: #777777
  font-weight: 600

#title > *
  display: block

#header > img
  margin-right: 10pt

#header > h2
  color: #47B71A
  
#underline
  position: absolute
  left: 30pt
  right: 0
  bottom: 0
  height: 1pt
  background-color: #898989

#body
  position: relative
  margin: 10pt
  transition: height 0.5s
  overflow-y: hidden

</style>
