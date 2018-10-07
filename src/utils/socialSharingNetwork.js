/*!
 * Customized from:
 * vue-social-sharing v2.3.3
 * (c) 2018 nicolasbeauvais
 * Released under the MIT License.
 */

var SocialSharingNetwork = {
  functional: true,

  props: {
    network: {
      type: String,
      default: ''
    }
  },

  render: function (createElement, context) {
    var network = context.parent._data.baseNetworks[context.props.network];

    if (!network) {
      return console.warn(("Network " + (context.props.network) + " does not exist"));
    }

    return createElement(context.parent.networkTag, {
      staticClass: context.data.staticClass || null,
      staticStyle: context.data.staticStyle || null,
      class: context.data.class || null,
      style: context.data.style || null,
      attrs: {
        id: context.data.attrs.id || null,
        'data-link': network.type === 'popup'
          ? '#share-' + context.props.network
          : context.parent.createSharingUrl(context.props.network),
        'data-action': network.type === 'popup' ? null : network.action
      },
      on: {
        click: network.type === 'popup' ? function () {
          context.parent.share(context.props.network);
        } : function () {
          context.parent.touch(context.props.network);
        }
      }
    }, context.children);
  }
};

export default SocialSharingNetwork;