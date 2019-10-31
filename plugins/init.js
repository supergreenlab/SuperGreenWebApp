export default async ({ store }) => {
  await store.dispatch('controllers/init')
  await store.dispatch('liveviews/init')
  await store.dispatch('graphs/init')
  await store.dispatch('settings/init')
}
