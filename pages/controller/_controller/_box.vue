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
    <div :id='$style.top'>
      <div :id='$style.boxes'>
          <div :id='$style.menu' v-on:click='menu'></div>
          <div :class='`${$style.box} ${settings ? $style.hidden : ""}`' v-for='box, i in controller.boxes' :id='$route.params.box == i ? $style.selected : ""' @click='select(i)'>box #{{ i+1 }}</div>
      </div>
      <nuxt-link :id='$style.settings' :to='`/controller/${controller.broker_clientid.value}/settings`'></nuxt-link>
    </div>
    <div :id='$style.body'>
      <nuxt-child :key='$route.params.box' />
    </div>
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
    settings() {
      return this.$route.name == 'controller-controller-box-settings'
    },
  },
  methods: {
    select(i) {
      this.$router.push(`/controller/${this.controller.broker_clientid.value}/${i}`)
    },
    menu() {
      this.$root.$emit('menu')
    },
  },
}
</script>

<style module lang=stylus>

#container
  display: flex
  flex-direction: column
  overflow-y: auto
  min-height: 100%

#top
  background-color: #454545
  padding-left: 5pt
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25)
  z-index: 1000
  @media screen and (max-width: 600px)
    top: 0
    left: 0
    width: 100vw
    position: fixed

#boxes
  display: flex

.box
  padding: 10pt
  text-decoration-line: underline;
  color: white
  font-weight: 600
  cursor: pointer

.hidden
  visibility: hidden

.box:hover
  background-color: #303030

#selected
  background-color: #020202

#menu
  width: 20pt
  margin: 0 5pt 0 0
  background-image: url('~assets/img/menu.svg')
  background-position: center
  background-size: contain
  background-repeat: no-repeat
  @media screen and (min-width: 600px)
    display: none
  
#menu:hover
  opacity: 0.5

#body
  display: flex
  position: relative
  min-height: 100%

#settings
  display: block
  position: absolute
  top: 5pt
  right: 10pt
  width: 23pt
  height: 23pt
  background-image: url('~assets/img/settings.svg')
  background-position: center
  background-size: contain
  background-repeat: no-repeat
  cursor: pointer
  z-index: 1001

#settings:hover
  opacity: 0.8

#settings:active
  opacity: 0.5

.settingsactive
  width: 19pt !important
  background-image: url('~assets/img/close.svg') !important

</style>
