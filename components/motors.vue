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
    <Title title='MOTOR CONFIG' icon='light-black.svg' />
    <div :id='$style.body'>
      <div v-for='b, i in controller.motors' :key='i'>
        <h1>Motor #{{ i+1 }}</h1>
        <MotorFrequency :motorId='i' />
      </div>
    </div>
  </section>
</template>

<script>
import Title from '~/components/settings-title.vue'
import MotorFrequency from '~/components/motor-frequency.vue'

export default {
  components: {Title, MotorFrequency,},
  computed: {
    controller() {
      return this.$store.getters['controllers/getSelected']
    },
  },
}
</script>

<style module lang=stylus>

#container
  display: flex
  flex-direction: column
  padding: 0 10pt

#body
  display: flex
  justify-content: space-around
  flex-wrap: wrap
  padding: 10pt 25pt
  color: #717171

.button
  display: flex
  align-items: center
  justify-content: center
  padding: 10pt 25pt
  background-color: #3BB30B
  height: 23pt
  color: white
  text-decoration: none
  border-radius: 3pt
  @media screen and (max-width: 600px)
    margin: 10pt 0

.button:hover
  background-color: #4BC30B

.button:active
  background-color: #2BA30B

.red
  background-color: #D04949
  
.red:hover
  background-color: #D05959

.red:active
  background-color: #2BA30B

</style>
