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
    <div :id='$style.title'>
      Led #{{ n }}
    </div>
    <div :id='$style.boxes'>
      Box:
      <div :class='$style.box' v-for='i in 3'>
        {{ i }}
      </div>
    </div>
  </section>
</template>

<script>

export default {
  props: ['n', 'box',],
}
</script>

<style module lang=stylus>

#container
  display: flex
  flex-direction: column
  font-weight: 600
  font-size: 1.1em
  color: #797979

#title
  margin-bottom: 5pt
  border-bottom: 1pt solid #BEBEBE
  font-size: 1.1em

#boxes
  display: flex
  align-items: center
  justify-content: space-between

.box
  display: flex
  align-items: center
  justify-content: center
  width: 40pt
  height: 40pt
  border: 2pt solid #BEBEBE
  border-radius: 3pt
  font-weight: 600
  font-size: 1.1em
  margin: 0 5pt
  cursor: pointer

.box:hover
  background-color: #efefef

.box:active
  background-color: #dfdfdf

#selected
  border: 2pt solid #3BB30B

</style>
