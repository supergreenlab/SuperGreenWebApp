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
      <img src="~/assets/img/plug-driver.png">
      <p>
        Plug your driver’s power plug.
      </p>
    </section>
    <section :id='$style.nav'>
      <NextButton v-on:click.native='onNext' :to='is_sta ? "/new/wifi-sta" : "/new/wifi-ap"' />
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
  },
  computed: {
    is_sta() {
      return this.$store.state.controllers.new_controller_is_sta
    }
  }
}
</script>

<style module lang=stylus>

#container
  display: flex
  flex-direction: column
  min-height: 100vh
  background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)
  overflow: hidden

#top
  display: flex
  justify-content: flex-end
  @media screen and (max-width: 600px)
    padding-top: 15pt

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
