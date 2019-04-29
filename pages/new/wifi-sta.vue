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
      <div :id='$style.form'>
        <h3>Search the controller by it’s name:</h3>
        <input v-model='url' type='text' @keydown='enter' placeholder='supergreendriver' />
      </div>
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
  data() {
    return {
      url: '',
    }
  },
  components: { CloseButton, NextButton, },
  layout: 'fullscreen',
  methods: {
    onNext(e) {
      let url = this.$data.url.toLowerCase().replace(/([^A-Za-z0-9.-])+/g, '-')
      if (url.indexOf('.local') == -1) {
        url = `${url}.local`
      }
      this.$store.commit('controllers/configure_search_new_controller', {url , is_sta: true})
    },
    enter(e) {
      if (e.key == 'Enter') {
        this.onNext(e)
        this.$router.push('/new/searching')
      }
    },
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
  flex: 1
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center

#icon
  flex: 1
  max-height: 150pt
  width: 50%
  background-image: url('~assets/img/wifi-icon.png')
  background-position: center
  background-size: contain
  background-repeat: no-repeat
  
#form
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  margin: 20pt 0

#form > input
  margin: 10pt 0 0 0
  min-width: 200pt

#nav
  display: flex
  justify-content: flex-end

</style>
