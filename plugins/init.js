export default async ({ store }) => {
  store.dispatch('controllers/init')
  store.dispatch('liveviews/init')
  store.dispatch('graphs/init')
  store.dispatch('settings/init')
}
