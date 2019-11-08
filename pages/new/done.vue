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
    <section :id='$style.body'>
      <h1>
        Ok all good, move on:)
      </h1>
    </section>

    <section :id='$style.nav'>
      <NextButton :to='nextUrl' />
    </section>
  </section>
</template>

<script>
import NextButton from '~/components/common/nextbutton'

export default {
  components: { NextButton, },
  layout: 'fullscreen',
  computed: {
    nextUrl() {
      const controller = this.$store.state.controllers.new_controller
      if (controller.state.value == 0) {
        return `/controller/${controller.broker_clientid.value}/setup/preset`
      } else if (controller.wifi_status.value == 4) {
        return `/controller/${controller.broker_clientid.value}/setup/wifi-sta`
      }
      return `/controller/${controller.broker_clientid.value}/0`
    },
  },
}
</script>

<style module lang=stylus>

#container
  display: flex
  flex-direction: column
  min-height: 100vh
  background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)

#body
  display: flex
  flex-direction: column
  flex: 1
  justify-content: center
  align-items: center
  text-align: center

#body img
  max-height: 200pt

#nav
  display: flex
  justify-content: flex-end

</style>
