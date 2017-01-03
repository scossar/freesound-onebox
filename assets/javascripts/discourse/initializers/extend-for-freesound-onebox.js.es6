import {withPluginApi} from 'discourse/lib/plugin-api';

const initializeFreesound = function ($elem) {

  let sounds = {},
    currentSound,
    playerID,
    audioSrc,
    sampleDuration,
    $pauseButton,
    $playButton,
    $freesoundLoading,
    $timerDisplay,
    $durationDisplay,
    $freesoundProgress,
    $freesoundCurrentWave;

  function formatTime(secs) {
    let minutes = Math.floor(secs / 60) || 0;
    let seconds = (secs - minutes * 60) || 0;

    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }

  function step() {
    let seek;

    if (currentSound && sounds.hasOwnProperty(currentSound) && $timerDisplay) {
      seek = sounds[currentSound].seek() || 0;
      $timerDisplay.html(formatTime(Math.round(seek)) + '<span class="freesound-time-divider"> / </span>');

      if (sounds[currentSound].playing()) {
        requestAnimationFrame(step);
        $freesoundProgress.css({
          'width': ((seek / sampleDuration) * 100) + '%'
        });
      }
    }
  }

  function assignVariables(self) {
    playerID = $(self).data('player-id');
    audioSrc = $('#freesound-onebox-' + playerID).data('audio-src');
    $playButton = $('#freesound-play-' + playerID);
    $pauseButton = $('#freesound-pause-' + playerID);
    $freesoundLoading = $('#freesound-loading-' + playerID);
    $timerDisplay = $('#freesound-timer-' + playerID);
    $freesoundProgress = $('#freesound-progress-' + playerID);
    $freesoundCurrentWave = $('#freesound-wave-' + playerID);
    $durationDisplay = $('#freesound-duration-' + playerID);
  }

  $elem.find('.freesound-wave').click(function (e) {
    let elementLeft,
      pageLeft,
      chosenLocation,
      waveWidth,
      newPosition;

    if ($(this).hasClass('current-wave')) {
      elementLeft = $(this).offset().left;
      pageLeft = e.pageX;
      chosenLocation = pageLeft - elementLeft;
      waveWidth = $(this).width();
      newPosition = chosenLocation * sampleDuration / waveWidth;

      sounds[currentSound].seek(newPosition);
    }
  });

  $elem.find('.freesound-play-btn').click(function () {

    if (currentSound && sounds[currentSound].playing()) {
      sounds[currentSound].pause();
      $pauseButton.removeClass('active');
      $playButton.addClass('active');
    }

    assignVariables(this);

    $freesoundCurrentWave.addClass('current-wave');

    currentSound = 'sound_' + playerID;

    if (!sounds.hasOwnProperty(currentSound)) {
      sounds[currentSound] = new Howl({
        src: audioSrc,
        html5: true,
        onload: function () {
          $freesoundLoading.removeClass('loading');
          $freesoundLoading.addClass('loaded');
        },
        onplay: function () {
          sampleDuration = sounds[currentSound].duration() || 0;
          $durationDisplay.html(formatTime(Math.round(sampleDuration)));
          requestAnimationFrame(step);
        },
        onend: function () {
          $freesoundProgress.css({
            'width': 0
          });
          $playButton.addClass('active');
          $freesoundCurrentWave.removeClass('current-wave');
          $pauseButton.removeClass('active');
        }
      });
    }

    sounds[currentSound].play();
    $playButton.removeClass('active');
    $pauseButton.addClass('active');

  });

  $elem.find('.freesound-pause-btn').click(function () {

    if (sounds.hasOwnProperty(currentSound)) {
      sounds[currentSound].pause();
      $(this).removeClass('active');
      $playButton.addClass('active');
    }
  });
};

function initializeWithApi(api) {
  api.decorateCooked(($elem, helper) => {
    let $freesound;
    // let playerID;

    if ($freesound = $elem.find('.freesound-onebox')) {
      initializeFreesound($elem);
    }
  });
}

export default {
  name: 'extend-for-freesound-onebox',

  initialize() {
    withPluginApi('0.6', initializeWithApi);
  }
};
