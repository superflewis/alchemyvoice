
// mopidy.js
const Mopidy = require('mopidy');

class MopidyClient {
    constructor() {
        this.mopidy = new Mopidy({
            webSocketUrl: "ws://localhost:6680/mopidy/ws/",
            callingConvention: "by-position-or-by-name"
        });

        this.mopidy.on('state:online', () => {
            console.log('Mopidy is online');
        });

        this.mopidy.on('state:offline', () => {
            console.log('Mopidy is offline');
        });
    }

    play(uri) {
        return this.mopidy.tracklist.clear()
            .then(() => this.mopidy.tracklist.add({ uri: uri }))
            .then(() => this.mopidy.playback.play())
            .catch(console.error);
    }

    pause() {
        return this.mopidy.playback.pause().catch(console.error);
    }

    resume() {
        return this.mopidy.playback.resume().catch(console.error);
    }

    stop() {
        return this.mopidy.playback.stop().catch(console.error);
    }

    next() {
        return this.mopidy.playback.next().catch(console.error);
    }

    previous() {
        return this.mopidy.playback.previous().catch(console.error);
    }

    getTracklist() {
        return this.mopidy.tracklist.getTracks().catch(console.error);
    }
}

module.exports = MopidyClient;
