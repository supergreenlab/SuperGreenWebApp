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
      <b>Please enable and authorize ble discovery for an easier process.</b><br />
      WE DON'T GEOLOCALIZE, but android will still ask for localization, because ble is considered a geolocalization feature:/
    </div>
    <a v-if='!scanning' href='javascript:void(0)' @click='startScan'>START BLE SCAN</a>
    <div v-else>
      <div v-for='device in foundDevices'>
        {{ device.name }} {{ device.state }} {{ device.wifi_status }} {{ device.wifi_ip }}
      </div>
    </div>
  </section>
</template>

<script>

export default {
  data() {
    return {
      scanning: false
    }
  },
  methods: {
    startScan() {
      this.$data.scanning = true
      this.$store.dispatch('controllers/start_ble_scan')
    },
    foundDevices() {
      return this.$store.state.controllers.ble
    },
  },
}
</script>

<style module lang=stylus>

#container
  display: flex
  flex-direction: column

</style>
