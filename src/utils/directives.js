import Vue from 'vue';
import backgroundCanvas from '@/assets/js/background';

const directives = {
  'canvas-background': {
    inserted(el) {
      backgroundCanvas(el);
    },
  },

};

Object.keys(directives).forEach((directive) => {
  Vue.directive(directive, { ...directives[directive] });
});
