import { SyntheticPlatformEmitter } from '@unimodules/core';
import { RECORDING_OPTIONS_PRESET_HIGH_QUALITY } from './Audio/Recording';
function getStatusFromMedia(media) {
    if (!media) {
        return {
            isLoaded: false,
            error: undefined,
        };
    }
    const isPlaying = !!(media.currentTime > 0 &&
        !media.paused &&
        !media.ended &&
        media.readyState > 2);
    const status = {
        isLoaded: true,
        uri: media.src,
        progressUpdateIntervalMillis: 100,
        durationMillis: media.duration * 1000,
        positionMillis: media.currentTime * 1000,
        // playableDurationMillis: media.buffered * 1000,
        // seekMillisToleranceBefore?: number
        // seekMillisToleranceAfter?: number
        shouldPlay: media.autoplay,
        isPlaying,
        isBuffering: false,
        rate: media.playbackRate,
        // TODO: Bacon: This seems too complicated right now: https://webaudio.github.io/web-audio-api/#dom-biquadfilternode-frequency
        shouldCorrectPitch: false,
        volume: media.volume,
        isMuted: media.muted,
        isLooping: media.loop,
        didJustFinish: media.ended,
    };
    return status;
}
function setStatusForMedia(media, status) {
    if (status.positionMillis !== undefined) {
        media.currentTime = status.positionMillis / 1000;
    }
    // if (status.progressUpdateIntervalMillis !== undefined) {
    //   media.progressUpdateIntervalMillis = status.progressUpdateIntervalMillis;
    // }
    // if (status.seekMillisToleranceBefore !== undefined) {
    //   media.seekMillisToleranceBefore = status.seekMillisToleranceBefore;
    // }
    // if (status.seekMillisToleranceAfter !== undefined) {
    //   media.seekMillisToleranceAfter = status.seekMillisToleranceAfter;
    // }
    // if (status.shouldCorrectPitch !== undefined) {
    //   media.shouldCorrectPitch = status.shouldCorrectPitch;
    // }
    if (status.shouldPlay !== undefined) {
        if (status.shouldPlay) {
            media.play();
        }
        else {
            media.pause();
        }
    }
    if (status.rate !== undefined) {
        media.playbackRate = status.rate;
    }
    if (status.volume !== undefined) {
        media.volume = status.volume;
    }
    if (status.isMuted !== undefined) {
        media.muted = status.isMuted;
    }
    if (status.isLooping !== undefined) {
        media.loop = status.isLooping;
    }
    return getStatusFromMedia(media);
}
let _mediaRecorder = null;
export default {
    get name() {
        return 'ExponentAV';
    },
    async getStatusForVideo(element) {
        return getStatusFromMedia(element);
    },
    async loadForVideo(element, nativeSource, fullInitialStatus) {
        return getStatusFromMedia(element);
    },
    async unloadForVideo(element) {
        return getStatusFromMedia(element);
    },
    async setStatusForVideo(element, status) {
        return setStatusForMedia(element, status);
    },
    async replayVideo(element, status) {
        return setStatusForMedia(element, status);
    },
    /* Audio */
    async setAudioMode() { },
    async setAudioIsEnabled() { },
    async getStatusForSound(element) {
        return getStatusFromMedia(element);
    },
    async loadForSound(nativeSource, fullInitialStatus) {
        const source = typeof nativeSource === 'string' ? nativeSource : nativeSource.uri;
        const media = new Audio(source);
        media.ontimeupdate = () => {
            SyntheticPlatformEmitter.emit('didUpdatePlaybackStatus', {
                key: media,
                status: getStatusFromMedia(media),
            });
        };
        media.onerror = () => {
            SyntheticPlatformEmitter.emit('ExponentAV.onError', {
                key: media,
                error: media.error.message,
            });
        };
        const status = setStatusForMedia(media, fullInitialStatus);
        return [media, status];
    },
    async unloadForSound(element) {
        element.pause();
        element.removeAttribute('src');
        element.load();
        return getStatusFromMedia(element);
    },
    async setStatusForSound(element, status) {
        return setStatusForMedia(element, status);
    },
    async replaySound(element, status) {
        return setStatusForMedia(element, status);
    },
    /* Recording */
    //   async setUnloadedCallbackForAndroidRecording() {},
    async getAudioRecordingStatus() {
        return {
            isRecording: _mediaRecorder && _mediaRecorder.state === 'recording',
            isDoneRecording: false,
            durationMillis: 2000,
        };
    },
    async prepareAudioRecorder(options) {
        if (!navigator.mediaDevices) {
            throw new Error('No media devices available');
        }
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        _mediaRecorder = new window.MediaRecorder(stream, options?.web || RECORDING_OPTIONS_PRESET_HIGH_QUALITY.web);
        return { uri: 'file:///unsupported', status: await this.getAudioRecordingStatus() };
    },
    async startAudioRecording() {
        if (_mediaRecorder === null) {
            throw new Error('No recorder prepared');
        }
        if (_mediaRecorder.state === 'paused') {
            _mediaRecorder.resume();
        }
        else {
            _mediaRecorder.start();
        }
        return this.getAudioRecordingStatus();
    },
    async pauseAudioRecording() {
        if (_mediaRecorder === null) {
            throw new Error('No recorder prepared');
        }
        // Set status to paused
        _mediaRecorder.pause();
        return this.getAudioRecordingStatus();
    },
    async stopAudioRecording() {
        if (_mediaRecorder === null) {
            throw new Error('No recorder prepared');
        }
        if (_mediaRecorder.state === 'inactive') {
            return { uri: null, status: this.getAudioRecordingStatus() };
        }
        const dataPromise = new Promise(resolve => (_mediaRecorder.ondataavailable = e => resolve(e.data)));
        await _mediaRecorder.stop();
        const data = await dataPromise;
        const url = URL.createObjectURL(data);
        return { uri: url, status: await this.getAudioRecordingStatus() };
    },
    async unloadAudioRecorder() {
        _mediaRecorder = null;
        return this.getAudioRecordingStatus();
    },
};
//# sourceMappingURL=ExponentAV.web.js.map