import { ipcRenderer } from 'electron';

declare var navigation: any;
declare var ytcfg: any;

declare global {
  interface Window {
    api: any;
  }
}

window.api = {
  addToPlaylist: () => {
    const videoTitleSelector = '#title.style-scope.ytd-watch-metadata';
    const channelNameSelector = '#upload-info.style-scope.ytd-video-owner-renderer #channel-name';

    const videoTitle = document.querySelector<HTMLElement>(videoTitleSelector);

    if (!videoTitle) {
      return;
    }

    const channelName = document.querySelector<HTMLElement>(channelNameSelector);

    if (!channelName) {
      return;
    }

    const bestThumbnail =
      ytcfg.data_.SBOX_SETTINGS.SEARCHBOX_COMPONENT.__dataHost.hostElement.__shady.parentNode.__data.data.playerResponse.videoDetails.thumbnail.thumbnails.sort(
        (a, b) => b.width * b.height - a.width * a.height
      )[0]?.url;

    if (!bestThumbnail) {
      return;
    }

    ipcRenderer.sendToHost('addToPlaylist', location.href, videoTitle.innerText, channelName.innerText, bestThumbnail);
  },
};

const menuSelector = 'ytd-mini-guide-renderer.style-scope.ytd-app';
const menuExpandedSelector = '#guide';
const expandMenuButtonSelector = '#guide-button';
const settingsAndAuthSelector = '#buttons';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector(menuSelector)?.remove();
  document.querySelector(menuExpandedSelector)?.remove();
  document.querySelector(expandMenuButtonSelector)?.remove();
  document.querySelector(settingsAndAuthSelector)?.remove();

  const observer = new MutationObserver(() => {
    const subscribeButtonSelector = '#subscribe-button';
    const sponsorButtonSelector = '#sponsor-button';
    const channelSubAndSponsorSelector =
      '.page-header-view-model-wiz__page-header-flexible-actions.page-header-view-model-wiz__page-header-flexible-actions--page-header-flexible-actions-margin.yt-flexible-actions-view-model-wiz.yt-flexible-actions-view-model-wiz--inline';
    const videoActionsSelector = '#actions-inner';
    const commentsInputSelector = '#simple-box';
    const noResultsTitleSelector = '.promo-title.style-scope.ytd-background-promo-renderer';
    const noResultsCaptionSelector = '.promo-body-text.style-scope.ytd-background-promo-renderer';
    const commentActionButtons = '#action-buttons';
    const channelActionButtons = '#call-to-action-buttons';

    setTimeout(() => {
      [
        subscribeButtonSelector,
        sponsorButtonSelector,
        channelSubAndSponsorSelector,
        commentsInputSelector,
        commentActionButtons,
        channelActionButtons,
      ].forEach((i) => {
        document.querySelectorAll(i).forEach((i) => i.remove());
      });
    });

    const videoActions = document.querySelector(videoActionsSelector);

    if (videoActions) {
      videoActions.outerHTML = `
        <button-view-model class="yt-spec-button-view-model" style="margin-left: auto;">
          <button
            class="yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading"
            onclick="api.addToPlaylist();"
          >
            <div class="yt-spec-button-shape-next__button-text-content">Add to Playlist</div>
            <yt-touch-feedback-shape style="border-radius: inherit;">
              <div class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response" aria-hidden="true">
                <div class="yt-spec-touch-feedback-shape__stroke"></div>
                <div class="yt-spec-touch-feedback-shape__fill"></div>
              </div>
            </yt-touch-feedback-shape>
          </button>
        </button-view-model>`;
    }

    setTimeout(() => {
      const noResultsTitle = document.querySelector(noResultsTitleSelector);

      if (noResultsTitle) {
        noResultsTitle.innerHTML = 'Find track using YouTube';
      }

      const noResultsCaption = document.querySelector(noResultsCaptionSelector);

      if (noResultsCaption) {
        noResultsCaption.innerHTML = 'Open any video and click the "Add to Playlist" button beneath it';
      }
    });
  });

  observer.observe(document.body, { attributes: true, childList: true, subtree: true });

  navigation.addEventListener('navigate', (event) => {
    if (!event.destination.url.match(/^https:\/\/(www\.)?youtube\.com/)) {
      location.href = location.href;
      return;
    }

    if (event.destination.url.match(/^https:\/\/(www\.)?youtube\.com\/shorts/)) {
      location.href = event.destination.url.replace(
        /https:\/\/(www\.)?youtube\.com\/shorts\/(.+)/,
        'https://www.youtube.com/watch?v=$2'
      );
      return;
    }
  });
});
