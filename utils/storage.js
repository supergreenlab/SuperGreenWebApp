/*
 * Copyright (C) 2019  SuperGreenLab <towelie@supergreenlab.com>
 * Author: Constantin Clauzel <constantin.clauzel@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

//const storage = require('electron-json-storage') // electron storage
const storage = { // browser storage
  get(key, fn) {
    fn(undefined, JSON.parse(window.localStorage.getItem(key) || '{}'))
  },
  set(key, value, fn) {
    window.localStorage.setItem(key, JSON.stringify(value))
    fn()
  }
}

/*storage.clear(function(error) {
  if (error) throw error
})*/

export default {
  async get(key, def) {
    return new Promise((resolve, reject) => storage.get(key, (error, data) => {
      if (error) {
        reject(error)
        return
      }
      resolve(typeof data == 'undefined' || typeof data.v == 'undefined' ? def : data.v)
    }))
  },
  async set(key, value) {
    return new Promise((resolve, reject) => storage.set(key, {v: value}, (error) => {
      if (error) {
        reject(error)
        return
      }
      resolve()
    }))
  },
}
