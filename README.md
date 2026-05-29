# 🔊 SonicFX

A lightweight, high-performance, zero-dependency JavaScript framework for synthesizing user interface and game sound effects on the fly using the native **Web Audio API**.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Size](https://img.shields.io/badge/size-<3KB_gzipped-brightgreen)]()
[![PRs-Welcome](https://img.shields.io/badge/PRs-welcome-orange.svg)](http://makeapullrequest.com)

Relying entirely on visual cues (like toast messages or modal popups) can leave an application feeling flat. `SonicFX` adds a robust, dynamic audio layer—**without bloating your bundle size** with heavy `.mp3` or `.wav` files.

---

## ✨ Features

* **Zero Asset Footprint:** No static audio assets to load, cache, or maintain. All sounds are mathematically generated via standard browser oscillators in real time.
* **Microscopic Size:** Under 3KB minified and gzipped.
* **Smart Autoplay Handling:** Lazily instantiates and resumes the browser's `AudioContext` only on the first explicit user gesture, fully complying with modern browser security policies.
* **Central Mute Architecture:** Features a global mute toggle state engine that automatically cuts node generation short to save precious CPU clock cycles.
* **Decoupled State Broadcasting:** Automatically dispatches standard native web custom events (`sonicfx-mute-toggle`) so any isolated UI node or micro-frontend can stay perfectly synced with the audio state.
* **Clean Sound Overlapping:** Nodes are contextually decoupled, allowing sounds to stack naturally without ugly clipping or cutting off ongoing tones.

---

## 🚀 Installation & Setup

### Production CDN (Recommended)
Load the framework instantly via the highly optimized jsDelivr global network. Drop this script tag directly into your HTML document:

```html
<script src="https://cdn.jsdelivr.net/gh/sumitkarn12/sonicfx@latest/src/sonicfx.min.js"></script>
```

## 🕹️ Quick Start Usage
### 1. Triggering Standard UI Audio Feedback

```
const saveButton = document.getElementById('save-btn');

saveButton.addEventListener('click', () => {
  // Play a mechanical transient click on tap
  SonicFX.click();
  
  // Example asynchronous process
  saveData().then(() => {
    SonicFX.success(); // Play ascending confirmation chime
  }).catch(() => {
    SonicFX.error();   // Play harsh downward warning alert
  });
});
```

### 2. Driving Game States
```
function onPlayerCollision(enemy) {
  if (enemy.isProjectile) {
    SonicFX.laser();
  }
}

function onInventoryUnlock() {
  SonicFX.unlock();
}

function onLevelComplete() {
  SonicFX.levelUp();
  // Cascades an arpeggiated celebratory chord multi-node fanfare
  SonicFX.celebration(); 
}
```

## 🎛️ Centralized Mute Management
`SonicFX` handles mute state centrally. Instead of mutating internal volume multipliers down to zero, it short-circuits the dynamic generation sequence entirely to prevent unnecessary hardware processing.

```
const muteUiToggle = document.getElementById('mute-button');

// 1. Fire the toggle from your button
muteUiToggle.addEventListener('click', () => {
  SonicFX.toggleMute(); // Swaps internal state and returns boolean
});

// 2. Listen to the global event anywhere else in your app
window.addEventListener('sonicfx-mute-toggle', (event) => {
  const isMuted = event.detail.isMuted;
  
  if (isMuted) {
    muteUiToggle.textContent = '🔇 Unmute Audio';
    muteUiToggle.classList.add('is-disabled');
  } else {
    muteUiToggle.textContent = '🔊 Mute Audio';
    muteUiToggle.classList.remove('is-disabled');
  }
});
```

## 🎵 API Reference Guide
### Application UI Sounds

| Method | Target Waveform | Sound Profile Description |
| :--- | :--- | :--- |
| `SonicFX.success()` | `sine` | A rapid, clean two-tone rising chime ($C_5 \rightarrow E_5$) with an exponential gain decay. |
| `SonicFX.error()` | `triangle` | A buzzed, dual-pulse harsh frequency dive down to 85Hz designed for high visibility alerts. |
| `SonicFX.warning()` | `triangle` | Alternating medium-frequency alert pulses ($G_4 \rightarrow F_4$) to denote soft non-blocking errors. |
| `SonicFX.info()` | `sine` | A transparent, quick single-pulse frequency blip ($A_4$). |
| `SonicFX.click()` | `sine` | An ultra-fast transient pitch slide mimicking a clean mechanical click element. |

### Video Game Sounds

| Method | Target Waveform | Sound Profile Description |
| :--- | :--- | :--- |
| `SonicFX.celebration()` | `triangle` | A 4-voice stacked harmonic arpeggio structure playing an ascending triumph fanfare chord. |
| `SonicFX.levelUp()` | `sine` | A continuous, mathematical exponential frequency sweep ($C_4 \rightarrow C_6$). |
| `SonicFX.laser()` | `triangle` | A rapid exponential downward slide starting from 1200Hz down to 80Hz mimicking classic arcade SFX. |
| `SonicFX.powerUp()` | `triangle` | A rapid stepped, multi-frequency rhythmic ladder climbing element. |
| `SonicFX.unlock()` | `sine` | A complex three-tone musical progression (Low $\rightarrow$ High $\rightarrow$ Medium) signifying structural access. |


### Utility Control Methods
* `SonicFX.toggleMute()`: Swaps the framework's operational sound emission properties. Fires sonicfx-mute-toggle. Returns boolean.
* `SonicFX.setMute(boolean)`: Overwrites the internal global state tracker directly based on inputs.
* `SonicFX.getMutedState()`: Returns current active operational flag state (true or false).

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.