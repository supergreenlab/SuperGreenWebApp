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
    <Title title='WIFI CONFIG' icon='wifi-black.svg' />
    <div :id='$style.form'>
      Current mode: {{ controller.wifi_status.value == 3 ? 'connected to your home wifi' : 'not connected to home wifi' }}
      <div :id='$style.fields'>
        <div :class='`${$style.input} ${$style.large}`'>
          <Input label='SSID' name='ssid' />
        </div>
        <div :class='`${$style.input} ${$style.large}`'>
          <Input label='password' name='password' type='password' />
        </div>
        <div :class='$style.input'>
          <a href='javascript:void(0)' @click='connect' :id='$style.connect'>CONNECT</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Title from '~/components/settings-title.vue'
import Input from '~/components/settings-input.vue'

export default {
  components: {Title, Input,},
  computed: {
    controller() {
      return this.$store.getters['controllers/getSelected']
    },
  },
  methods: {
    connect() {
    }
  },
}
</script>

<style module lang=stylus>

#container
  display: flex
  flex-direction: column
  padding: 0 10pt

#form
  color: #717171
  padding: 10pt 25pt

#fields
  display: flex
  align-items: flex-end
  margin: 10pt 0

#connect
  display: flex
  align-items: center
  justify-content: center
  padding: 0 25pt
  background-color: #3BB30B
  height: 23pt
  color: white
  text-decoration: none
  border-radius: 3pt

#connect:hover
  background-color: #4BC30B

#connect:active
  background-color: #2BA30B
  
.input
  margin: 0 10pt

.large
  flex: 1

</style>
