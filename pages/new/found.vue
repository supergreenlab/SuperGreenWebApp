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
        Found !
      </h1>
      <p>Loading a few additional stuffs..</p>
    </section>
  </section>
</template>

<script>
export default {
  layout: 'fullscreen',
  computed: {
    loaded() {
      return this.$store.state.controllers.new_controller.loaded
    }
  },
  watch: {
    loaded: {
      handler() {
        if (this.loaded) {
          this.$router.push('/new/done')
        }
      }
    }
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
