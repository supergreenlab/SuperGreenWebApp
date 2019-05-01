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
    <section :id='$style.top'>
      <CloseButton />
    </section>
    <section :id='$style.body'>
      <div :id='$style.icon'></div>
      <section>
        <h3>Connect to the driver’s</b><br />
        wifi network:</h3><br />
        SSID: <div :id='$style.ssid'></div></br >
        Pass: multipass
      </section>
    </section>
    <section :id='$style.nav'>
      <NextButton v-on:click.native='onNext' to='/new/searching' />
    </section>
  </section>
</template>

<script>
import CloseButton from '~/components/closebutton'
import NextButton from '~/components/nextbutton'

export default {
  components: { CloseButton, NextButton, },
  layout: 'fullscreen',
  methods: {
    onNext(e) {
    }
  }
}
</script>

<style module lang=stylus>

#container
  display: flex
  flex-direction: column
  min-height: 100vh

#top
  display: flex
  justify-content: flex-end

#body
  display: flex
  flex-direction: column
  flex: 1
  justify-content: center
  align-items: center

#body img
  max-height: 200pt
  padding-bottom: 50pt

#nav
  display: flex
  justify-content: flex-end

#ssid
  display: inline-block
  height: 20pt
  width: 100pt
  background-repeat: no-repeat
  background-size: contain
  background-position: left
  background-image: url('~assets/img/wifi-ssid.png')

#icon
  flex: 1
  max-height: 100pt
  width: 50%
  margin-bottom: 20pt
  background-image: url('~assets/img/wifi-icon.png')
  background-position: center
  background-size: contain
  background-repeat: no-repeat

</style>
