var initializeFreesound = function () {
  var sounds = {},
    currentSound,
    playerID,
    audioSrc,
    sampleDuration,
    $pauseButton,
    $playButton,
    $timerDisplay,
    $durationDisplay,
    $freesoundProgress,
    $freesoundCurrentWave;

  // Utilities

  function formatTime(secs) {
    var minutes = Math.floor(secs / 60) || 0;
    var seconds = (secs - minutes * 60) || 0;

    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }

  function step() {
    var seek;

    if (currentSound && sounds.hasOwnProperty(currentSound) && $timerDisplay) {
      seek = sounds[currentSound].seek() || 0;
      $timerDisplay.html(formatTime(Math.round(seek)));
      $freesoundProgress.css({
        'width': ((seek / sampleDuration) * 100) + '%'
      });

      if (sounds[currentSound].playing()) {
        requestAnimationFrame(step);
      }
    }
  }

  function assignVariables(self) {
    playerID = $(self).data('player-id');
    audioSrc = $('#freesound-onebox-' + playerID).data('audio-src');
    $playButton = $('#freesound-play-' + playerID);
    $pauseButton = $('#freesound-pause-' + playerID);
    $timerDisplay = $('#freesound-timer-' + playerID);
    $freesoundProgress = $('#freesound-progress-' + playerID);
    $freesoundCurrentWave = $('#freesound-wave-' + playerID);
    $durationDisplay = $('#freesound-duration-' + playerID);
  }

  $('.freesound-wave').click(function (e) {
    var elementLeft,
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

  $('.freesound-play-btn').click(function () {

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

  $('.freesound-pause-btn').click(function () {

    if (sounds.hasOwnProperty(currentSound)) {
      sounds[currentSound].pause();
      $(this).removeClass('active');
      $playButton.addClass('active');
    }
  });

};

