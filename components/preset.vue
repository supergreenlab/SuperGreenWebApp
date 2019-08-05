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
  <section :id='$style.container' :class='(selected ? $style.selected : "")'>
    <h2>{{ title }}</h2>
    <div :id='$style.iconw' :style='{"background-image": `url(${require(`~/assets/img/presets/${icon}`)})`}'></div>
    <div :id='$style.instruction' v-html='description'></div>
  </section>
</template>

<script>
export default {
  props: [ 'id', 'title', 'icon', 'description', 'selected' ],
}
</script>

<style module lang=stylus>

#container
  display: flex
  flex-direction: column
  border: 1pt solid #b4b4b4
  border-radius: 2pt
  padding: 10pt
  box-sizing: border-box
  align-items: center
  max-width: 250pt
  transition: border .2s, opacity .2s
  opacity: 0.5

#container > h2
  margin: 10pt 0

.selected
  border: 3pt solid #3bb30b !important
  opacity: 1 !important

#iconw
  width: 100%
  height: 100pt
  background-position: center
  background-size: contain
  background-repeat: no-repeat
  @media screen and (max-width: 600px)
    height: 80pt

#instruction
  padding: 20pt 0

#instruction > hr
  border: 1pt solid #efefef
  margin: 10pt 0

#instruction > h3
  margin: 10pt 0

</style>
