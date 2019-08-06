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
  <section v-if='controller' :id='$style.container'>
    <nuxt-child :key='$route.params.controller' />
  </section>
</template>

<script>
import Box from '~/components/box'
import Loading from '~/components/loading'

export default {
  components: { Box, Loading, },
  computed: {
    controller() {
      return this.$store.getters['controllers/getSelected']
    },
  },
}
</script>

<style module lang=stylus>

#container
  position: relative
  flex: 1
  background-color: #efefef
  overflow-y: auto
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

#container > div
  max-width: 700pt

#loading
  position: absolute
  width: 100%
  height: 100%
  top: 0
  left: 0
  display: flex
  flex: 1
  flex-direction: column
  align-items: center
  justify-content: center
  position: relative
  background-color: white
  white-space: nowrap

#loading_relative
  position: relative
  height: 200pt

</style>
