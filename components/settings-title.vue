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
    <div :id='$style.icon' :style='{"background-image": `url(${require(`~/assets/img/${icon}`)})`}'></div>
    <div :id='$style.title'>
      <h1>{{ title }}</h1>
    </div>
  </section>
</template>

<script>

export default {
  props: ['title', 'icon', ],
}
</script>

<style module lang=stylus>

#container
  display: flex
  align-items: center
  margin: 15pt 0

#icon
  background-position: center
  background-size: contain
  background-repeat: no-repeat
  width: 25pt
  height: 100%
  margin: 0 5pt

#title
  flex: 1
  border-bottom: 2pt solid #BEBEBE
  margin: 0 15pt 0 0

#title > h1
  color: #6A6A6A
  margin: 0

</style>
