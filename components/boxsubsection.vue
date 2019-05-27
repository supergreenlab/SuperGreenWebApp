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
    <div :id='$style.header' :class='!subtitle ? $style.nosub : ""'>
      <img :src='require(`~/assets/img/${icon}`)' />
      <div :id='$style.title'>
        <b>{{ title }}</b>
        <small v-if='subtitle'>{{ subtitle }}</small>
      </div>
      <h4 v-if='value'>{{ value }}</h4>
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
  min-height: 40pt

#header.nosub
  min-height: 30pt

#title
  flex: 1
  flex-direction: column
  color: #777777
  font-weight: 600
  font-size: 0.9em

#title > *
  display: block

#header > img
  margin-right: 5pt
  width: 30px
  height: 30px

#header > h4
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
