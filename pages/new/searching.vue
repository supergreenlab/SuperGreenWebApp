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
      <div :id='$style.loading'><Loading width='100pt' height='75pt' /></div>
      <div :id='$style.message'>
        <h3>Please wait - Finding your controller...</h3>
        <small>Probing {{ retries }} / 5</small>
      </div>
    </section>
  </section>
</template>

<script>
import CloseButton from '~/components/closebutton.vue'
import Loading from '~/components/loading'

export default {
  components: { CloseButton, Loading, },
  layout: 'fullscreen',
  computed: {
    retries() {
      return this.$store.state.controllers.search_n_tries
    },
    searching() {
      return this.$store.state.controllers.searching_new_controller
    },
  },
  watch: {
    searching: {
      handler() {
        const state = this.$store.state.controllers
        if (this.searching == 'searching') {
          return
        }
        if (state.new_controller != null) {
          this.$router.push('/new/found')
        } else if (state.new_controller_failed) {
          this.$router.push('/new/notfound')
        }
      }
    },
  },
  mounted() {
    this.$store.dispatch('controllers/search_new_controller')
  },
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

#body
  flex: 1
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  text-align: center

#loading
  position: relative
  max-width: 150pt
  min-height: 100pt
  width: 50%
  
#message
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  margin: 20pt 0

#message > input
  margin: 10pt 0 0 0
  min-width: 200pt

#nav
  display: flex
  justify-content: flex-end

</style>
