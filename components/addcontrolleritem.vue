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
  <section :id='$style.container'>
    <b>{{ title }}</b>
    <div :id='$style.icon' :style='{"background-image": `url(${require(`~/assets/img/${icon}`)})`}' />
    <button v-on:click='onClick()'><b>{{ button }}</b></button>
  </section>
</template>

<script>
export default {
  props: ['title', 'icon', 'button',],
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
  flex-direction: column
  align-items: center
  justify-content: center
  padding: 20pt 10pt
  background-color: #383838
  border-radius: 5pt
  width: 100%
  height: 100%

#container:hover
  padding: 19pt 9pt
  border: 1pt solid #fcfcfc

#icon
  flex: 1
  width: 100%
  margin: 20pt
  background-size: contain
  background-repeat: no-repeat
  background-position: center

#container > button
  border: none
  background-color: #3baf0c 
  border-radius: 7.5pt
  width: 60pt
  height: 15pt
  color: white
  cursor: pointer

#container > button:hover
  background-color: #5bcf2c 

#container > button:active
  background-color: #2a6e0e

</style>
