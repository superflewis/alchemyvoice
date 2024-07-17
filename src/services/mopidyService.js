
// mopidyService.js
const MopidyClient = require('../mopidy');

class MopidyService {
    constructor() {
        this.mopidy = new MopidyClient();
    }

    async play(uri) {
        try {
            await this.mopidy.play(uri);
            return { status: 'success', message: 'Playing' };
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    }

    async pause() {
        try {
            await this.mopidy.pause();
            return { status: 'success', message: 'Paused' };
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    }

    async resume() {
        try {
            await this.mopidy.resume();
            return { status: 'success', message: 'Resumed' };
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    }

    async stop() {
        try {
            await this.mopidy.stop();
            return { status: 'success', message: 'Stopped' };
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    }

    async next() {
        try {
            await this.mopidy.next();
            return { status: 'success', message: 'Next track' };
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    }

    async previous() {
        try {
            await this.mopidy.previous();
            return { status: 'success', message: 'Previous track' };
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    }

    async getTracklist() {
        try {
            const tracklist = await this.mopidy.getTracklist();
            return { status: 'success', data: tracklist };
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    }
}

module.exports = MopidyService;
