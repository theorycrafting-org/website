const path = require('path');
export default {
  props: {
    subThemes: {
      type: Array,
      default: () => []
    }
  },
  render: function(h) {
    console.log(this.props);
    if (this.props.subThemes.length > 0) {
      var thisTheme = this.props.subThemes.slice(0, 1)[0];
      var restThemes = this.props.subThemes.slice(1);
      var layout = require(path.resolve(thisTheme, "./Layout.vue"));
      return h(layout, {
        props: {
          subThemes: restThemes
        }
      });
    }
  }
}
