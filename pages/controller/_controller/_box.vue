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
    <div :id='$style.boxes'>
      <div :class='$style.box' :id='$route.params.box == i ? $style.selected : ""' v-for='box, i in controller.boxes' @click='select(i)'>box #{{ i+1 }}</div>
    </div>
    <nuxt-child :key='$route.params.box' />
  </section>
</template>

<script>
export default {
  computed: {
    controller() {
      return this.$store.getters['controllers/getSelected']
    },
    boxid() {
      return this.$route.params.box
    },
  },
  methods: {
    select(i) {
      this.$router.push(`/controller/${this.controller.broker_clientid.value}/${i}`)
    },
  },
}
</script>

<style module lang=stylus>

#container
  flex: 1
  position: relative
  display: flex
  flex-direction: column
  overflow-y: auto

#boxes
  display: flex
  background-color: #454545
  padding-left: 5pt
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25)
  z-index: 1000

.box
  padding: 10pt
  text-decoration-line: underline;
  color: white
  font-weight: 600
  cursor: pointer

.box:hover
  background-color: #404040

#selected
  background-color: #020202

</style>
