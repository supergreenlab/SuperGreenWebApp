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
    <h2>Add controller</h2>
    <div :id='$style.items'>
      <div :class='$style.item'>
        <AddControllerItem title='Just got it !' icon='brand-new.svg' button='Setup' v-on:click='first()' />
      </div>
      <div :class='$style.item'>
        <AddControllerItem title='Already running' icon='running.svg' button='Find it' v-on:click='wifi()' />
      </div>
      <div :class='$style.item'>
        <AddControllerItem title='Get a new one' icon='shop.svg' button='Shop' v-on:click='shop()' />
      </div>
    </div>
  </section>
</template>

<script>
import AddControllerItem from './addcontrolleritem'

export default {
  components: {AddControllerItem,},
  methods: {
    first() {
      this.$store.commit('controllers/configure_search_new_controller', {url: '192.168.4.1', is_sta: false})
      this.$router.push('/new/plug')
    },
    wifi() {
      this.$store.commit('controllers/configure_search_new_controller', {url: '', is_sta: true})
      this.$router.push('/new/wifi-sta')
    },
    shop() {
      window.open('https://supergreenlab.com')
    },
  },
}
</script>

<style module lang=stylus>

#container
  display: flex
  flex-direction: column
  flex: 1
  background-color: #454545
  z-index: 10
  color: white
  font-size: 0.8em
  padding: 10pt

#items
  display: flex

.item
  display: flex
  width: 120pt
  height: 170pt
  margin: 10pt 10pt 10pt 0

</style>
