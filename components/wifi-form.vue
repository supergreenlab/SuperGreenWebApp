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
    Current mode: <b>{{ controller.wifi_status.value == 3 ? 'connected to your home wifi' : 'not connected to home wifi' }}</b>
    <div :id='$style.fields'>
      <div :class='`${$style.input} ${$style.large}`'>
        <Input label='SSID' name='ssid' v-model='ssidM' />
      </div>
      <div :class='`${$style.input} ${$style.large}`'>
        <Input label='password' name='password' type='password' v-model='passwordM' />
      </div>
      <div :class='$style.input'>
        <a href='javascript:void(0)' :class='`${$style.button} ${!this.valid ? $style.invalid : ""}`' @click='connect'>CONNECT</a>
      </div>
    </div>
  </section>
</template>

<script>
import Input from '~/components/settings-input.vue'

export default {
  components: {Input,},
  props: ['ssid', 'password', 'connect',],
  computed: {
    ssidM: {
      get() { return this.$props.ssid },
      set(v) {this.$emit('update:ssid', v)}
    },
    passwordM: {
      get() { return this.$props.password },
      set(v) {this.$emit('update:password', v)}
    },
    controller() {
      return this.$store.getters['controllers/getSelected']
    },
    valid() {
      return this.$props.ssid && this.$props.password
    },
  },
}
</script>

<style module lang=stylus>

#container
  color: #717171
  padding: 10pt 25pt

#fields
  display: flex
  position: relative
  align-items: flex-end
  margin: 10pt 0
  @media screen and (max-width: 600px)
    align-items: flex-start
    flex-direction: column
    font-size: 0.7em

.button
  display: flex
  align-items: center
  justify-content: center
  padding: 0 25pt
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

.invalid
  opacity: 0.5
  
.input
  margin: 0 10pt
  @media screen and (max-width: 600px)
    margin: 10pt 0
    width: 100%

</style>
