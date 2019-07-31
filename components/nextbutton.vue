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
    <ui-button raised color="green">
    <nuxt-link v-if='to' :to='to'>{{ label }} &gt;</nuxt-link>
    <a v-else-if='onClick' href='javascript:void(0)' v-on:click='onClick'>{{ label }} &gt;</a>
    <span v-else>{{ label }} &gt;</span>
    </ui-button>
  </section>
</template>

<script>
import Vue from 'vue';
import { UiButton } from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';

export default {
  components: { UiButton },
  props: {
    'onClick': Function,
    'to': String, 
    'label': {
      type: String,
      default: 'Next',
    },
  },
}
</script>

<style module lang=stylus>

a
  color: white
  text-decoration: none
  font-weight: 500
  transition: opacity 0.2s
  padding: 20px
  margin: -20px

#container
  display: flex
  padding: 5pt

#container > a
  color: #5dbd37
  text-decoration: none
  font-size: 1.3em
  font-weight: 400
  transition: opacity 0.2s

#container > a:hover
  opacity: 0.3

</style>
