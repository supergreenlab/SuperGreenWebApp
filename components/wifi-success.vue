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
     <h1>
       Ok, found it!
     </h1>
     <div :id='$style.buttons'>
       <a href='javascript:void(0)' :class='$style.button' @click='retype'>BACK</a>
     </div>
   </section>
</template>

<script>
export default {
  props: ['retype',],
}
</script>

<style module lang=stylus>

#container
  display: flex
  color: #717171
  align-items: center
  flex-direction: column

#buttons
  display: flex
  flex-direction: column
  align-items: center

#buttons > .button
  width: 200pt
  margin-top: 10pt

.button
  display: flex
  align-items: center
  justify-content: center
  padding: 0 25pt
  background-color: #3BB30B
  height: 23pt
  color: white
  text-decoration: none
  border-radius: 3pt
  @media screen and (max-width: 600px)
    margin: 10pt 0

.button:hover
  background-color: #4BC30B

.button:active
  background-color: #2BA30B

</style>
