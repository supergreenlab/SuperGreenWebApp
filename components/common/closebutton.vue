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
    <nuxt-link to='/'>
      <img src='~/assets/img/remove-timelapse.svg' />
    </nuxt-link>
  </section>
</template>

<script>
export default {
}
</script>

<style module lang=stylus>

#container
  display: flex
  padding: 5pt

#container > a
  display: flex
  align-items: center
  justify-content: center
  background-color: #F27E7E
  border-radius: 50%
  padding: 5pt
  width: 20pt
  height: 20pt

#container > a > img
  text-decoration: none
  transition: opacity 0.2s

#container > a:hover > img
  opacity: 0.3

</style>
