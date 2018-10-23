export default {
  methods: {
    isActiveRoute(route) {
      return route.path === this.$route.path
    },
    closeCurrentTab: function() {
      let visitedViews = this.$store.state.tagsView.visitedViews
      let view = _.find(visitedViews, (item) => {
        return item.path == this.$route.path
      })
      this.$store.dispatch('delVisitedViews', view).then((views) => {
        if (this.isActiveRoute(view)) {
          const latestView = views.slice(-1)[0]
          this.$router.push(latestView || '/')
        }
      })
    }
  }
}
