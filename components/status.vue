<template>
  <BoxSubSection 
  icon='subsection-monitoring-status.svg'
  title='Box status'>
    <div :id='$style.container'>
      <div :class='$style.status'>
        <StatusItem title='Inside weather' :value='timer_status[0]' :icon='timer_status[1]' :blink='timer_status[2]' />
      </div>
      <div :class='$style.status'>
        <StatusItem title='Temperature' :value='temperature_status[0]' :icon='temperature_status[1]' :blink='temperature_status[2]' />
      </div>
      <div :class='$style.status'>
        <StatusItem title='Humidity' :value='humidity_status[0]' :icon='humidity_status[1]' :blink='humidity_status[2]' />
      </div>
      <div :class='$style.status'>
        <StatusItem title='CO2' :value='co2_status[0]' :icon='co2_status[1]' :blink='co2_status[2]' />
      </div>
    </div>
  </BoxSubSection>
</template>

<script>
import StatusItem from '~/components/statusitem.vue'
import BoxSubSection from '~/components/boxsubsection.vue'

export default {
  components: { StatusItem, BoxSubSection, },
  created() {
    this.$store.dispatch('controllers/load_box_param', {id: this.controller.broker_clientid.value, i: this.boxid, key: 'sht21_temp_c'})
    this.$store.dispatch('controllers/load_box_param', {id: this.controller.broker_clientid.value, i: this.boxid, key: 'sht21_temp_f'})
    this.$store.dispatch('controllers/load_box_param', {id: this.controller.broker_clientid.value, i: this.boxid, key: 'sht21_humi'})
    this.$store.dispatch('controllers/load_box_param', {id: this.controller.broker_clientid.value, i: this.boxid, key: 'arduino_co2'})
  },
  computed: {
    controller() {
      return this.$store.getters['controllers/getSelected']
    },
    boxid() {
      return this.$route.params.box
    },
    temperature_status() {
      const temperature = this.controller.boxes[this.boxid].sht21_temp_c.value
      if (temperature > 35)
        return [`${temperature}° - To high`, 'status-temperature-icon-high.svg', true]
      else if (temperature < 18)
        return [`${temperature}° - To low`, 'status-temperature-icon-low.svg', true]
      return [`${temperature}° - Ok`, 'status-temperature-icon-ok.svg', false]
    },
    humidity_status() {
      const humidity = this.controller.boxes[this.boxid].sht21_humi.value
      if (humidity > 75)
        return [`${humidity}% - To high`, 'status-humidity-icon-high.svg', true]
      else if (humidity < 20)
        return [`${humidity}% - To low`, 'status-humidity-icon-low.svg', true]
      return [`${humidity}% - Ok`, 'status-humidity-icon-ok.svg', false]
    },
    co2_status() {
      const co2 = this.controller.boxes[this.boxid].arduino_co2.value
      if (co2 > 1600)
        return [`${co2}ppm - To high`, 'status-co2-icon-high.svg', true]
      else if (co2 < 800)
        return [`${co2}ppm - To low`, 'status-co2-icon-low.svg', true]
      return [`${co2}ppm - Ok`, 'status-co2-icon-ok.svg', false]
    },
    timer_status() {
      const timer_advancement = this.timer_advancement
      if (timer_advancement == 0)
        return ['NIGHT', 'status-weather-icon-night.svg', false]
      else if (timer_advancement > 85)
        return ['EVENING', 'status-weather-icon-evening.svg', false]
      else if (timer_advancement < 15)
        return ['MORNING', 'status-weather-icon-morning.svg', false]
      return ['SUNSHINE', 'status-weather-icon-sunshine.svg', false]
    },
    timer_advancement() {
      const controller = this.controller,
            boxid = this.boxid,
            timer_output = controller.boxes[boxid].timer_output.value
      if (timer_output <= 0) {
        return 0
      }

      const on_sec = controller.boxes[boxid].on_hour.value * 3600 + controller.boxes[boxid].on_min.value * 60,
            off_sec = controller.boxes[boxid].off_hour.value * 3600 + controller.boxes[boxid].off_min.value * 60,
            dt = new Date(),
            cur_sec = dt.getSeconds() + (60 * dt.getMinutes()) + (60 * 60 * dt.getHours()),
            time_span = (on_sec < off_sec) ? (off_sec - on_sec) : ((off_sec + (24 * 3600)) - on_sec),
            on_since = (on_sec < cur_sec ? (cur_sec - on_sec) : ((cur_sec + (24 * 3600)) - on_sec))
      return on_since / time_span * 100
    },
  },
}
</script>

<style module lang=stylus>

#container
  display: flex
  flex-wrap: wrap;

.status
  display: flex
  flex-basis: 15%
  @media screen and (max-width: 600px)
    flex-basis: 50%

</style>
