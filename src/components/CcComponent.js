import {CcPanel} from './CcPanel'
const install = function (Vue) {
  Vue.component('ccPanel', CcPanel);
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install
};
