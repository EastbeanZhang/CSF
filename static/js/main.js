"use strict";

const mainVideo = document.getElementById("main-video");
const controllers = [];
const formatTime = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

class ComparisonPlayer {
  constructor(element) {
    this.element = element;
    this.videos = [...element.querySelectorAll("video")];
    this.range = element.querySelector('input[type="range"]');
    this.clock = element.querySelector("output");
    this.status = element.querySelector(".comparison-status");
    this.buttons = [...element.querySelectorAll("button")];
    this.duration = Number(element.dataset.duration);
    this.position = 0;
    this.playing = false;
    this.loading = false;
    this.buffering = false;
    this.version = 0;
    this.frame = null;
    element.querySelector(".comparison-controls").hidden = false;
    element.querySelector('[data-action="play"]').addEventListener("click", () => this.play());
    element.querySelector('[data-action="pause"]').addEventListener("click", () => this.pause());
    element.querySelector('[data-action="restart"]').addEventListener("click", () => this.seek(0, true));
    this.range.addEventListener("input", () => this.updateClock(Number(this.range.value)));
    this.range.addEventListener("change", () => this.seek(Number(this.range.value), this.playing));
    this.videos.forEach(video => {
      video.addEventListener("loadedmetadata", () => this.updateDuration());
      video.addEventListener("play", () => {
        if (!this.playing && !this.loading) this.play();
      });
      video.addEventListener("pause", () => {
        if (this.playing && !this.loading && !this.buffering) this.pause();
      });
      video.addEventListener("seeking", () => {
        if (this.loading || this.buffering) return;
        const peers = this.videos.filter(peer => peer !== video);
        if (peers.some(peer => Math.abs(peer.currentTime - video.currentTime) > 0.2)) {
          this.seek(video.currentTime, this.playing);
        }
      });
      video.addEventListener("error", () => this.fail());
      video.querySelector("source").addEventListener("error", () => this.fail());
    });
  }

  updateDuration() {
    const durations = this.videos.map(video => video.duration).filter(Number.isFinite);
    if (durations.length === this.videos.length) {
      this.duration = Math.min(...durations);
      this.range.max = String(this.duration);
      this.updateClock(this.position);
    }
  }

  updateClock(position) {
    this.clock.textContent = `${formatTime(position)} / ${formatTime(this.duration)}`;
  }

  async ready() {
    await Promise.all(this.videos.map(video => {
      if (video.readyState >= 2) return Promise.resolve();
      if (video.error) return Promise.reject(new Error("Video is unavailable"));
      return new Promise((resolve, reject) => {
        const cleanup = () => {
          clearTimeout(timeout);
          video.removeEventListener("loadeddata", loaded);
          video.removeEventListener("error", failed);
          video.querySelector("source").removeEventListener("error", failed);
        };
        const loaded = () => { cleanup(); resolve(); };
        const failed = () => { cleanup(); reject(new Error("Could not load the video")); };
        const timeout = setTimeout(failed, 45000);
        video.addEventListener("loadeddata", loaded, { once: true });
        video.addEventListener("error", failed, { once: true });
        video.querySelector("source").addEventListener("error", failed, { once: true });
        video.preload = "auto";
        video.load();
      });
    }));
    this.updateDuration();
  }

  setLoading(loading) {
    this.loading = loading;
    this.buttons.filter(button => button.dataset.action !== "pause").forEach(button => { button.disabled = loading; });
    if (loading) {
      this.status.hidden = false;
      this.status.textContent = "Loading the three videos…";
    } else {
      this.status.hidden = true;
    }
  }

  pause() {
    ++this.version;
    this.playing = false;
    this.buffering = false;
    cancelAnimationFrame(this.frame);
    this.position = this.videos[0].readyState ? this.videos[0].currentTime : this.position;
    this.videos.forEach(video => video.pause());
    this.setLoading(false);
    this.range.value = String(this.position);
    this.updateClock(this.position);
  }

  fail() {
    this.pause();
    this.status.textContent = "A comparison video could not be loaded. Please retry or open the video with its native controls.";
    this.status.hidden = false;
  }

  async play() {
    if (this.loading || this.playing) return;
    controllers.forEach(controller => { if (controller !== this) controller.pause(); });
    mainVideo.pause();
    const version = ++this.version;
    this.setLoading(true);
    this.videos.forEach(video => video.pause());
    try {
      await this.ready();
      if (this.version !== version) return;
      if (this.position >= this.duration - 0.05) this.position = 0;
      this.videos.forEach(video => {
        if (Math.abs(video.currentTime - this.position) > 0.05) video.currentTime = this.position;
        video.playbackRate = 1;
      });
      this.playing = true;
      await Promise.all(this.videos.map(video => video.play()));
      if (this.version !== version) return;
      this.setLoading(false);
      this.tick();
    } catch {
      if (this.version === version) this.fail();
    }
  }

  async seek(position, resume) {
    this.pause();
    const version = ++this.version;
    this.setLoading(true);
    try {
      await this.ready();
      if (this.version !== version) return;
      this.position = Math.max(0, Math.min(position, this.duration));
      this.videos.forEach(video => { video.currentTime = this.position; });
      this.range.value = String(this.position);
      this.updateClock(this.position);
      this.setLoading(false);
      if (resume && this.position < this.duration - 0.05) this.play();
    } catch {
      if (this.version === version) this.fail();
    }
  }

  tick() {
    if (!this.playing) return;
    const leader = this.videos[0];
    if (leader.currentTime >= this.duration - 0.03 || this.videos.some(video => video.ended)) {
      this.pause();
      return;
    }
    // Pause the group while a member buffers so all methods stay on the same source time.
    const ready = this.videos.every(video => video.readyState >= 3 && !video.seeking);
    if (!ready && !this.buffering) {
      this.buffering = true;
      this.videos.forEach(video => video.pause());
    } else if (ready && this.buffering) {
      this.buffering = false;
      Promise.all(this.videos.map(video => video.play())).catch(() => this.fail());
    }
    if (!this.buffering) {
      this.videos.slice(1).forEach(video => {
        if (Math.abs(video.currentTime - leader.currentTime) > 0.15) video.currentTime = leader.currentTime;
      });
    }
    this.position = leader.currentTime;
    this.range.value = String(this.position);
    this.updateClock(this.position);
    this.frame = requestAnimationFrame(() => this.tick());
  }
}

document.querySelectorAll(".comparison").forEach(element => controllers.push(new ComparisonPlayer(element)));
mainVideo.addEventListener("play", () => controllers.forEach(controller => controller.pause()));
