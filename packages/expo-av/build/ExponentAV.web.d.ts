import { AVPlaybackNativeSource, AVPlaybackStatus, AVPlaybackStatusToSet } from './AV';
declare const _default: {
    readonly name: string;
    getStatusForVideo(element: HTMLMediaElement): Promise<AVPlaybackStatus>;
    loadForVideo(element: HTMLMediaElement, nativeSource: AVPlaybackNativeSource, fullInitialStatus: AVPlaybackStatusToSet): Promise<AVPlaybackStatus>;
    unloadForVideo(element: HTMLMediaElement): Promise<AVPlaybackStatus>;
    setStatusForVideo(element: HTMLMediaElement, status: AVPlaybackStatusToSet): Promise<AVPlaybackStatus>;
    replayVideo(element: HTMLMediaElement, status: AVPlaybackStatusToSet): Promise<AVPlaybackStatus>;
    setAudioMode(): Promise<void>;
    setAudioIsEnabled(): Promise<void>;
    getStatusForSound(element: HTMLMediaElement): Promise<AVPlaybackStatus>;
    loadForSound(nativeSource: string | {
        [key: string]: any;
        uri: string;
    }, fullInitialStatus: AVPlaybackStatusToSet): Promise<[HTMLMediaElement, AVPlaybackStatus]>;
    unloadForSound(element: HTMLMediaElement): Promise<AVPlaybackStatus>;
    setStatusForSound(element: HTMLMediaElement, status: AVPlaybackStatusToSet): Promise<AVPlaybackStatus>;
    replaySound(element: HTMLMediaElement, status: AVPlaybackStatusToSet): Promise<AVPlaybackStatus>;
    getAudioRecordingStatus(): Promise<{
        isRecording: boolean;
        isDoneRecording: boolean;
        durationMillis: number;
    }>;
    prepareAudioRecorder(options: any): Promise<{
        uri: null;
        status: {
            isRecording: boolean;
            isDoneRecording: boolean;
            durationMillis: number;
        };
    }>;
    startAudioRecording(): Promise<{
        isRecording: boolean;
        isDoneRecording: boolean;
        durationMillis: number;
    }>;
    pauseAudioRecording(): Promise<{
        isRecording: boolean;
        isDoneRecording: boolean;
        durationMillis: number;
    }>;
    stopAudioRecording(): Promise<{
        uri: null;
        status: Promise<{
            isRecording: boolean;
            isDoneRecording: boolean;
            durationMillis: number;
        }>;
    } | {
        uri: string;
        status: {
            isRecording: boolean;
            isDoneRecording: boolean;
            durationMillis: number;
        };
    }>;
    unloadAudioRecorder(): Promise<{
        isRecording: boolean;
        isDoneRecording: boolean;
        durationMillis: number;
    }>;
};
export default _default;
