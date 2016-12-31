import {withPluginApi} from 'discourse/lib/plugin-api';

function initializeWithApi(api) {

  api.decorateCooked(($elem) => {
    // if ($elem.find('audio')) {
    //   audiojs.events.ready(function () {
    //     let as = audiojs.createAll();
    //   });
    // }
  });
    audiojs.events.ready(function () {
      var as = audiojs.createAll();
    });
}

export default {
  name: 'extend-for-freesound-onebox',
  initialize() {

    withPluginApi('0.1', initializeWithApi);
  }
};