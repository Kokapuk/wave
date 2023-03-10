<template>
  <div class="view-container">
    <form class="search-container" @submit.prevent="submitHandle">
      <input
        v-model.trim="searchQuery"
        class="search-input input"
        placeholder="Input search query or track link"
        type="search"
        required
        minlength="3" />
      <Button type="submit" class="search-button">Search</Button>
    </form>
    <div v-if="!downloading && !loading" class="track-list">
      <div v-for="track in tracksByQuery" class="spotify-track">
        <iframe
          class="spotify-frame"
          :src="`https://open.spotify.com/embed/track/${track.id}?utm_source=generator`"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"></iframe>
        <Button
          @click="
            () =>
              addClickHandle(
                { id: '', audio: '', cover: track.album.images[0].url, name: track.name, artist: parseArtists(track.artists) },
                track.id
              )
          "
          class="add-button">
          Add
        </Button>
      </div>
    </div>
    <div v-else-if="loading" class="center"><LoadingIndicator /></div>
    <span v-else class="empty-placeholder-center"><ProgressBar :progress="progress" /> Downloading...</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import type { ITrack } from '@/types';
import { usePlayerStore } from '@/stores/player';
import { useSettingsStore } from '@/stores/settings';
import LoadingIndicator from '@/components/Controls/LoadingIndicator.vue';
import ProgressBar from '@/components/Controls/ProgressBar.vue';
import Button from '@/components/Controls/Button.vue';
import router from '@/router';

const playerStore = usePlayerStore();
const settingsStore = useSettingsStore();
const searchQuery = ref('');
const tracksByQuery = ref<any[]>([]);
const downloading = ref(false);
const loading = ref(false);
const progress = ref(0);

function serialize(obj: any) {
  var str = [];
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  }
  return str.join('&');
}

function parseArtists(artists: any[]) {
  let result = '';

  artists.forEach((artist) => {
    result += artist.name + ' & ';
  });

  return result.substring(0, result.length - 3);
}

async function submitHandle() {
  loading.value = true;
  let token;

  if (settingsStore.getSpotifyToken() === null) {
    const credentials = await axios.post(
      'https://accounts.spotify.com/api/token',
      serialize({ grant_type: 'client_credentials' }),
      {
        headers: {
          Authorization:
            'Basic ' + Buffer.from(import.meta.env.VITE_CLIENT_ID + ':' + import.meta.env.VITE_CLIENT_SECRET).toString('base64'),
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    token = credentials.data.access_token;
    settingsStore.setSpotifyToken({
      token: credentials.data.access_token,
      expires: credentials.data.expires_in * 1000 + Date.now(),
    });
  } else {
    token = settingsStore.getSpotifyToken()!.token;
  }

  if (searchQuery.value.startsWith('https://open.spotify.com/track/')) {
    let trackId = searchQuery.value.replace('https://open.spotify.com/track/', '');
    trackId = trackId.split('?si=')[0];

    const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });

    tracksByQuery.value = [response.data];
  } else {
    const response = await axios.get('https://api.spotify.com/v1/search', {
      params: {
        q: searchQuery.value.replaceAll(' ', '%20'),
        type: 'track',
        limit: 10,
      },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });

    const tracks = response.data.tracks.items as any[];
    tracksByQuery.value = tracks;
  }

  loading.value = false;
}

async function addClickHandle(trackDownloadForm: ITrack, id: string) {
  downloading.value = true;
  playerStore.isNavBarDisabled = true;

  try {
    // const apiResponse = await axios.get(`https://spotify-downloader1.p.rapidapi.com/download/${id}`, {
    //   headers: {
    //     'X-RapidAPI-Key': 'd11a10bef4mshdaec2c0d88bdbf9p152dd8jsn748f72f89ef3',
    //     'X-RapidAPI-Host': 'spotify-downloader1.p.rapidapi.com',
    //   },
    // });

    // trackDownloadForm.audio = apiResponse.data.link;

    const apiResponse = await axios.get(`https://spotify-scraper.p.rapidapi.com/v1/track/download`, {
      params: {
        track: id,
      },
      headers: {
        'X-RapidAPI-Key': 'd11a10bef4mshdaec2c0d88bdbf9p152dd8jsn748f72f89ef3',
        'X-RapidAPI-Host': 'spotify-scraper.p.rapidapi.com',
      },
    });

    trackDownloadForm.audio = apiResponse.data.youtubeVideo.audio[0].url;

    await playerStore.loadTrack(trackDownloadForm, (percentage) => (progress.value = percentage));
  } catch (e: any) {
    console.log('Failed to download the track: ', e.message);
  }

  playerStore.isNavBarDisabled = false;
  router.push('/');
}
</script>

<style scoped>
.view-container {
  display: flex;
  flex-direction: column;
  padding: 50px;
  gap: 25px;
  position: relative;
  height: 100%;
}

.search-container {
  display: flex;
  width: 100%;
  gap: 15px;
}

.search-input {
  width: 100%;
}

.search-button {
  flex: 0 0 auto;
}

.track-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.spotify-track {
  display: flex;
  gap: 15px;
}

.spotify-frame {
  width: 100%;
  border-radius: 12px;
}

.add-button {
  flex: 0 0 min-content;
  height: 100%;
  align-items: center;
}

.loading-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  left: 0;
  top: 0;
  background-color: rgb(var(--bg));
  height: 100%;
  width: 100%;
  padding: 0 50px;
  align-items: center;
  justify-content: center;
  gap: 15px;
}
</style>
