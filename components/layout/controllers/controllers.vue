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
    <div :id='$style.list'>
      <div :id='$style.relative' v-for='(controller, i) in controllers' :class='controller.broker_clientid.value === selected ? $style.selected : ""' @click='select(controller)'>
        Controller {{ i + 1 }}<br />
        <b>{{ controller.device_name.value }}</b><br />
        <span :class='controller.found ? $style.green : $style.red'>{{ controller.found ? 'Online' : 'Offline' }}</span>
      </div>
    </div>
    <div :id='$style.add'>
      <img :class='$style.add_img' :src='!overlay ? require("~/assets/img/add.svg") : require("~/assets/img/remove.svg")' @click="show" />
      <div :id='$style.overlay' :class='overlay ? $style.show : $style.hide'>
        <AddController :onClose='hide' />
      </div>
    </div>
  </section>
</template>

<script>
import AddController from '~/components/layout/addcontroller/addcontroller.vue'

export default {
  components: {AddController},
  data: () => ({
    overlay: false,
  }),
  computed: {
    controllers() {
      return this.$store.state.controllers.controllers
    },
    selected() {
      return this.$route.params.controller
    },
  },
  methods: {
    select(controller) {
      if (controller.state.value == 0) {
        this.$router.push(`/controller/${controller.broker_clientid.value}/setup/preset`)
      } else {
        this.$router.push(`/controller/${controller.broker_clientid.value}/0`)
      }
    },
    show() {
      this.$data.overlay = !this.$data.overlay
      return evt => evt.preventDefault()
    },
    hide() {
      this.$data.overlay = false
    },
  },
}
</script>

<style module lang=stylus>
#container
  display: flex
  max-width: 100vw
  height: 100%
  align-items: center
  justify-content: space-between
  flex-direction: column
  overflow-x: hidden
  overflow-y: auto

#list
  display: flex
  width: 100%
  flex-direction: column
  margin: 5pt

#list > div
  color: white
  padding: 10pt 0pt 10pt 10pt
  transition: background-color .2s
  line-height: 15pt

#list > div:hover
  background-color: #303030
  cursor: pointer

#list > div:active
  background-color: #222222

#list > div > small
  font-size: 0.7em

#relative
  position: relative

#add
  transition: opacity .2s

.add_img
  cursor: pointer
  width: 35pt
  margin: 5pt

#add > img:hover
  opacity: 0.7

#add > img:active
  opacity: 0.2

.selected
  background-color: #020202 !important

.selected::after
  content: ''
  display: block
  position: absolute
  margin-left: -1px
  width: 30pt
  height: 100%
  top: 0
  left: 100%
  background-image: url('~assets/img/selected-arrow.svg')
  background-repeat: no-repeat
  background-size: contain
  background-position: left
 
.green
  color: #3BB30B

.red
  color: #FF4B4B

#overlay
  position: absolute
  bottom: 0
  background-color: #454545
  border-radius: 2pt
  z-index: 10
  color: white
  padding-left: 15pt

  @media screen and (max-width: 600px)
    left: 0
    width: 100vw
    height: 100vh
    transition: margin-bottom 0.2s, opacity 0.5s
    overflow-y: auto

  @media screen and (min-width: 600px)
    transition: left 0.2s, opacity 0.5s
    width: 100vw
    overflow-x: auto

.show
  opacity: 1

  @media screen and (max-width: 600px)
    margin-bottom: 0

  @media screen and (min-width: 600px)
    left: 0pt

.hide
  opacity: 0

  @media screen and (max-width: 600px)
    margin-bottom: -100vh

  @media screen and (min-width: 600px)
    left: -100vw

</style>
