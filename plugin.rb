# name: Freesound Onebox
# about: Adds a Freesound Onebox to Discourse
# version: 0.1
# authors: scossar
# url: https://github.com/scossar/freesound-onebox

enabled_site_setting :freesound_onebox_enabled

register_asset 'stylesheets/freesound-styles.scss'
register_asset 'howler.js/dist/howler.js'
# register_asset 'audiojs/audio.js'
# register_asset 'audiojs/audio.swf'
# register_asset 'audiojs/player-graphics.gif'

PLUGIN_NAME = 'freesound_onebox'.freeze

# register_asset 'public/javascripts/audiojs/audio.js'

class Onebox::Engine::FreesoundOnebox
  include Onebox::Engine
  include StandardEmbed

  matches_regexp /^https?:\/\/www\.freesound\.org\/people\/.+\/(\d+)\/?(\?.*)?$/

  def id
    matches
  end

  def wave_image_url
    raw[:audio].gsub(/-lq.mp3/, '_wave_L.png').gsub(/previews/, 'displays').gsub(/http:/, 'https:')
  end

  def audio_src
    raw[:audio].gsub(/http:/, 'https:')
  end

  def to_html
    <<HTML
    <aside class="onebox freesound-onebox" data-audio-src="#{audio_src}">
      <script src="/plugins/Freesound_Onebox/javascripts/freesound-audio.js"></script>
      <div class="freesound-title">
        <span class="freesound-track">#{raw[:audio_title]}</span>
        <div class="freesound-timer">0:00</div>
        <div class="freesound-duration">0:00</div>
      </div>
      <div class="freesound-waveform" style="background-image: url(#{wave_image_url});">
      </div>
    
      <!-- Controls -->
      <div class="controlsOuter">
        <div class="controlsInner">
          <div class="freesound-loading"></div>
          <div class="freesound-btn play-btn"></div>
          <div class="freesound-btn pause-btn"></div>
          <div class="freesound-btn prev-btn"></div>
          <div class="freesound-btn next-btn"></div>
        </div>
        <div class="freesound-btn playlist-btn"></div>
        <div class="freesound-btn volume-btn"></div>
      </div>
    
      <!-- Progress -->
      <div class="freesound-waveform"></div>
      <div class="freesound-progress-bar"></div>
      <div class="freesound-progress"></div>
    
      <!-- Volume -->
      <div class="freesound-volume fadeout">
        <div class="freesound-barFull bar"></div>
        <div class="freesound-barEmpty bar"></div>
        <div class="freesound-slider-btn"></div>
      </div>
    </aside>
HTML
  end

  def to_html_bac
    <<HTML
    <aside class="onebox freesound-onebox">
        <div class="freesound-content">
        <h3>View on Freesound: <a href="#{raw[:url]}">#{raw[:audio_title]}</a></h3>
        <img class="freesound-waveform" src="#{wave_image_url}">
        <div class="freesound-audio-controls">
        <div class="audiojs" classname="audiojs" id="#{(Time.now.to_f * 1000).to_i}">
        <audio controls>
            <source src="#{audio_src}" type="audio/mpeg">
        </audio>
        <div class="play-pause">
        <p class="play"></p>
        <p class="pause"></p>
        <p class="loading"></p>
        <p class="error"></p>
        </div>
        <div class="scrubber">
        <div class="progress" style="width: 0%;"></div>
        <div class="loaded" style="width: 100%;"></div>
        </div>
        <div class="time">
        <em class="played">00:00</em>/<strong class="duration">00:00</strong>
        </div>
        <div class="error-message"></div>
        </div>
        </div>
        </div>
    </aside>
HTML
  end

end