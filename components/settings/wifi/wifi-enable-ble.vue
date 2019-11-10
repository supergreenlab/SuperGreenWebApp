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
    <div>
      <b>Please enable and authorize ble discovery for an easier process.</b><br /><br />
      <b>WE DON'T GEOLOCALIZE</b>, but android will still ask for localization, because BLE is considered a geolocalization feature:/
    </div>
    <a href='javascript:void(0)' :class='$style.button' @click='connect'>START BLE SCAN</a>
  </section>
</template>

<script>

export default {
  props: ['connect',],
  data() {
    return {
      scanning: false
    }
  },
}
</script>

<style module lang=stylus>

#container
  display: flex
  flex-direction: column
  align-items: center
  color: #717171

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
  margin: 10pt 10pt

.button:hover
  background-color: #4BC30B

.button:active
  background-color: #2BA30B

</style>
