<template>
  <BoxSubSection 
  icon='subsection-monitoring-status.svg'
  title='Box status'>
    <div :id='$style.container'>
      <div :class='$style.status'>
        <StatusItem title='Temperature' :value='temperature_status[0]' :color='temperature_status[1]' :blink='temperature_status[2]' />
      </div>
      <div :class='$style.status'>
        <StatusItem title='Humidity' :value='humidity_status[0]' :color='humidity_status[1]' :blink='humidity_status[2]' />
      </div>
      <div :class='$style.status'>
        <StatusItem title='Inside weather' :value='timer_status[0]' :color='timer_status[1]' :blink='timer_status[2]' />
      </div>
    </div>
  </BoxSubSection>
</template>

<script>
import StatusItem from '~/components/statusitem.vue'
import BoxSubSection from '~/components/boxsubsection.vue'

export default {
  props: ['temperature', 'humidity', 'timer_advancement',],
  components: { StatusItem, BoxSubSection, },
  computed: {
    temperature_status() {
      const { temperature } = this.$props
      if (temperature > 35)
        return ['TOO HOT', '#D04949', true]
      else if (temperature < 18)
        return ['TOO COLD', '#42BCCC', true]
      return ['OK', '#3BB30B', false]
    },
    humidity_status() {
      const { humidity } = this.$props
      if (humidity > 75)
        return ['TOO HIGH', '#D04949', true]
      else if (humidity < 20)
        return ['TOO LOW', '#42BCCC', true]
      return ['OK', '#3BB30B', false]
    },
    timer_status() {
      const { timer_advancement } = this.$props
      if (timer_advancement == 0)
        return ['NIGHT', '#3F44B9', false]
      else if (timer_advancement > 80)
        return ['EVENING', '#EDA63B', false]
      else if (timer_advancement < 20)
        return ['MORNING', '#A6A9E7', false]
      return ['SUNSHINE', '#CEC946', false]
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
  flex-basis: 20%

</style>
