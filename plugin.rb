# name: Freesound Onebox
# about: Adds a Freesound Onebox to Discourse
# version: 0.1
# authors: scossar
# url: https://github.com/scossar/freesound-onebox

enabled_site_setting :freesound_onebox_enabled

register_asset 'stylesheets/freesound-styles.scss'
register_asset 'howler.js/dist/howler.js'

PLUGIN_NAME = 'freesound_onebox'.freeze

class Onebox::Engine::FreesoundOnebox
  include Onebox::Engine
  include StandardEmbed

  matches_regexp /^https?:\/\/www\.freesound\.org\/people\/.+\/(\d+)\/?(\?.*)?$/

  def wave_image_url
    raw[:audio].gsub(/-lq.mp3/, '_wave_L.png').gsub(/previews/, 'displays').gsub(/http:/, 'https:')
  end

  def audio_src
    raw[:audio].gsub(/http:/, 'https:')
  end

  def onebox_id
    Time.now.to_i
  end

  def to_html
    <<HTML
    <aside class="onebox freesound-onebox" data-audio-src="#{audio_src}" id="freesound-onebox-#{onebox_id}" data-player-id="#{onebox_id}">
      <div class="freesound-title">
        <h3 class="freesound-track" id="freesound-track-#{onebox_id}">View on Freesound: <a href="#{raw[:url]}">#{raw[:audio_title]}</a></h3>
      </div>
      <div class="wrapper">
        <div class="freesound-wave" id="freesound-wave-#{onebox_id}" style="background-image: url(#{wave_image_url});">
        <div class="freesound-progress" id="freesound-progress-#{onebox_id}"></div>
      </div>
      <div class="freesound-controls-outer">
        <div class="freesound-controls-inner">
        <div class="freesound-btn freesound-play-btn active" id="freesound-play-#{onebox_id}" data-player-id="#{onebox_id}"></div>
        <div class="freesound-btn freesound-pause-btn" id="freesound-pause-#{onebox_id}" data-player-id="#{onebox_id}"></div>
        <div class="freesound-loading"></div>
        <div class="freesound-timer" id="freesound-timer-#{onebox_id}">0:00</div>
        <div class="freesound-duration" id="freesound-duration-#{onebox_id}"></div>
      </div>
    </div>
  </div>
</aside>

HTML
  end
end