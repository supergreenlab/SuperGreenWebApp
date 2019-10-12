<!--
      Copyright (C) 2019  SuperGreenLab <towelie@supergreenlab.com>
      Author: Constantin Clauzel <constantin.clauzel@gmail.com>

      This program is free software: you can redistribute it and/or modify
      it under the terms of the GNU General Public License as published by
      the Free Software Foundation, either version 3 of the License, or
      (at your option) any later version.

      This program is distributed in the hope that it will be useful,
      but WITHOUT ANY WARRANTY; without even the implied warranty of
      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
      GNU General Public License for more details.

      You should have received a copy of the GNU General Public License
      along with this program.  If not, see <http://www.gnu.org/licenses/>.
 -->

<template>
  <section :id='$style.container' @click='linkTo' :style='{cursor: (linkto ? "pointer" : "auto")}'>
    <div :id='$style.header' :style='headerstyle'>
      <img :src='require(`~/assets/img/${icon}`)' />
      <h3 :style='{color: (dark ? "#676767" : ""), "text-decoration": (linkto ? "underline" : "none")}'>{{ title }}</h3>
      <a v-if='link && linkurl' :href='linkurl' target='_blank'>{{ link }}</a>
    </div>
    <div :id='$style.body' :style='{height}'>
      <slot></slot>
    </div>
  </section>
</template>

<script>

export default {
  props: ['icon', 'title', 'link', 'linkurl', 'linkto', 'color', 'gradientfrom', 'gradientto', 'dark', 'height',],
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
  methods: {
    linkTo() {
      if (!this.$props.linkto) return
      this.$router.push(this.$props.linkto)
    }
  }
}

</script>

<style module lang=stylus>

#container
  position: relative
  margin: 0 auto
  width: 100%
  overflow-y: hidden

#header
  position: relative
  display: flex
  width: 100%
  align-items: center
  padding: 7pt 10pt
  color: white
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25)

#header > img
  background-color: white
  margin-right: 10pt
  width: 35px
  height: 35px
  border-radius: 17.5px

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
  position: relative
  margin-left: 20pt
  transition: height 0.5s

  @media screen and (max-width: 600px)
    margin-left: 0pt
</style>
