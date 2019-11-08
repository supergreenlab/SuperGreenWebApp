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
      <p><b>Welcome to</b></p>
      <Logo color='black' size='3em' />
    </section>
    <section :id='$style.nav'>
      <NextButton :onClick='onNext' />
      <small>
        By proceeding, you explicitly agree that you are acting in coordinance with
        local, state, and federal laws. SuperGreenLabs will not be liable for
        consequences surrounding the legality of how the lights or grow bundle are used.
      </small>
    </section>
  </section>
</template>

<script>
import Logo from '~/components/common/logo.vue'
import CloseButton from '~/components/common/closebutton.vue'
import NextButton from '~/components/common/nextbutton.vue'

export default {
  components: { Logo, CloseButton, NextButton, },
  layout: 'fullscreen',
  methods: {
    onNext() {
      this.$store.commit('app/first_start')
      this.$store.commit('controllers/configure_search_new_controller', {url: '192.168.4.1', is_sta: false})
      this.$router.push('/new/plug')
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
  text-align: center

#body img
  max-height: 100pt

#nav
  display: flex
  align-items: flex-end
  flex-direction: column

#nav > small
  text-align: center

</style>
