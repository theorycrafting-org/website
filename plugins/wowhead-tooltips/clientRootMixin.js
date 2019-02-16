export default {
  mounted () {
    this.tooltips();
  }
  updated () {
    this.tooltips();
  }
  methods: {
    tooltips: () => {
      if (window.$WowheadPower) window.$WowheadPower.refreshLinks();
    }
  }
}
