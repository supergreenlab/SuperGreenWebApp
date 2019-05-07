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
    <iframe :id='$style.settingsframe' :src='`http://${controller.wifi_ip.value}/fs/app.html`'></iframe>
  </section>
</template>

<script>
export default {
  computed: {
    controller() {
      return this.$store.getters['controllers/getSelected']
    },
  },
}
</script>

<style module lang=stylus>

#container
  flex: 1
  max-width: 700pt
  position: relative
  display: flex
  flex-direction: column
  overflow-y: auto
  background-color: white
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.15)
  margin-left: 10pt

#settingsframe
  border: none
  height: 100%

</style>
