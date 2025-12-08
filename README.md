# KOIN DECK RETRO PLAYER
## The Premium Cloud Emulator Engine

> **Your Games. Your Saves. Your Legacy.**

[![Try the Demo](https://img.shields.io/badge/PLAY-TRY%20THE%20DEMO-FFD600?style=for-the-badge&logoColor=black&labelColor=black)](https://koin-retro-player.theretrosaga.com/)
[![NPM Version](https://img.shields.io/npm/v/koin-deck-retro-player?style=for-the-badge&color=white&labelColor=black)](https://www.npmjs.com/package/koin-deck-retro-player)
[![License](https://img.shields.io/npm/l/koin-deck-retro-player?style=for-the-badge&color=white&labelColor=black)](LICENSE)

The high-performance, preservation-focused emulation engine powering [Koin Deck](https://koin.theretrosaga.com/). Built for those who remember blowing into cartridges, but demand the convenience of the cloud.

![Koin Deck Retro Player](./koin-player.png)

## Core Philosophy

- **Immortalized Collection**: Designed to interface with permanent cloud storage.
- **Enhanced Play**: Experience games better than original hardware with rewind, cheats, and achievements.
- **Privacy Focused**: Built for zero-knowledge architectures. Your data, your rules.
- **High-Contrast Brutality**: A neo-brutalist aesthetic that puts the game first.

## Features

- 🎮 **Universal Compatibility**: From NES to PlayStation, supporting a vast library of systems.
- ☁️ **Cloud Sync Ready**: Hooks for instant save-state uploads and synchronization.
- ⏪ **Rewind Time**: Mistakes happen. Fix them instantly.
- 🏆 **RetroAchievements**: Native integration for tracking your legacy.
- 🔒 **Secure Execution**: Sandboxed WASM environment via Nostalgist.js.
- 📱 **Adaptive Controls**: Touch controls that actually feel good, plus gamepad support.

## Supported Systems

| System | Key | Core |
|--------|-----|------|
| **Nintendo** |
| Nintendo Entertainment System (NES) | `NES` | fceumm |
| Super Nintendo (SNES) | `SNES` | snes9x |
| Nintendo 64 | `N64` | mupen64plus_next |
| Game Boy / Color / Advance | `GB`, `GBC`, `GBA` | gambatte, mgba |
| Virtual Boy | `VIRTUAL_BOY` | mednafen_vb |
| **Sega** |
| Sega Genesis / Mega Drive | `GENESIS` | genesis_plus_gx |
| Sega Master System | `MASTER_SYSTEM` | gearsystem |
| Sega Game Gear | `GAME_GEAR` | gearsystem |
| **Sony** |
| PlayStation | `PS1` | pcsx_rearmed |
| **Other** |
| PC Engine / TurboGrafx-16 | `PC_ENGINE` | mednafen_pce_fast |
| Neo Geo / Pocket / Color | `NEOGEO`, `NEOGEO_POCKET` | fbalpha, mednafen_ngp |
| WonderSwan / Color | `WONDERSWAN` | mednafen_wswan |
| Atari 2600 / 7800 / Lynx | `ATARI_2600`, `LYNX` | stella, handy |
| Arcade (MAME) | `ARCADE` | mame2003_plus |

## Installation

```bash
npm install koin-deck-retro-player
# or
yarn add koin-deck-retro-player
# or
pnpm add koin-deck-retro-player
```

## Usage

### React (Recommended)

```tsx
import { GamePlayer } from 'koin-deck-retro-player';
// ...
```

### Vanilla HTML / Web Component

You can use the player in any HTML page using the bundled Web Component.

1.  Include the script:
    ```html
    <script src="https://unpkg.com/koin-deck-retro-player/dist/web-component.global.js"></script>
    ```

2.  Use the tag:
    ```html
    <retro-game-player 
        rom-url="path/to/game.nes" 
        system="nes" 
        title="My Game"
    ></retro-game-player>
    ```

3.  Advanced properties (via JS):
    ```js
    const player = document.querySelector('retro-game-player');
    player.onSaveState = async (slot, blob) => {
        console.log('Saved!', blob);
    };
    ```

### Basic Example (React)

```tsx
import { GamePlayer } from 'koin-deck-retro-player';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <GamePlayer
        romUrl="https://example.com/roms/mario.nes"
        system="NES"
        title="Super Mario Bros."
      />
    </div>
  );
}
```

### Advanced Usage

```tsx
import { GamePlayer } from 'koin-deck-retro-player';

function App() {
  return (
    <GamePlayer
      romUrl="https://example.com/roms/sonic.md"
      system="GENESIS"
      title="Sonic the Hedgehog"
      // Optional: Custom core
      core="genesis_plus_gx"
      // Optional: BIOS URL (needed for some systems like GBA, PS1)
      biosUrl="https://example.com/bios/bios.bin"
      // Optional: Start with a specific save state
      initialSaveState={myBlob}
      // Optional: Auto-save interval (defaults to 60s)
      autoSaveInterval={30000}
      // Optional: RetroAchievements
      retroAchievementsConfig={{
        username: 'myuser',
        token: 'mytoken', // Use token, NOT password
        hardcore: false,
      }}
      // Optional: Handle save states externally
      onSaveState={async (blob) => {
        await uploadSave(blob);
      }}
    />
  );
}
```



## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `romUrl` | `string` | **Required** | URL to the ROM file. |
| `system` | `string` | **Required** | System key (e.g., 'NES', 'GBA'). |
| `title` | `string` | **Required** | Game title for display. |
| `core` | `string` | (Auto) | Specific Libretro core to use. |
| `biosUrl` | `string` | `undefined` | URL to BIOS file (required for some systems). |
| `systemColor` | `string` | (Auto) | Theme color for UI accents. |
| `onExit` | `() => void` | `undefined` | Callback when exit button is clicked. |
| `onSaveState` | `(slot, blob) => Promise` | `undefined` | Handler for saving state. |
| `onLoadState` | `(slot) => Promise<Blob>` | `undefined` | Handler for loading state. |
| `onAutoSave` | `(blob) => Promise` | `undefined` | Handler for auto-save (every 60s default). |
| `autoSaveInterval` | `number` | `60000` | Interval for auto-save in ms. |
| `onToggleCheat` | `(id, active) => void` | `undefined` | Handler for cheat toggle. |
| `onSessionStart` | `() => void` | `undefined` | Callback when emulator starts. |
| `onSessionEnd` | `() => void` | `undefined` | Callback when session ends. |
| `onGetSaveSlots` | `() => Promise<SaveSlot[]>` | `undefined` | Handler for listing save slots. |
| `onDeleteSaveState` | `(slot) => Promise` | `undefined` | Handler for deleting a save slot. |
| `maxSlots` | `number` | `undefined` | Maximum number of save slots allowed (for tier limits). |
| `currentTier` | `string` | `undefined` | Current user tier (for UI display). |
| `retroAchievementsConfig` | `object` | `undefined` | Configuration for RetroAchievements (hardcore mode, etc.). |
| `raUser` | `object` | `undefined` | RetroAchievements user object (username, token, etc.). |
| `raGame` | `object` | `undefined` | RetroAchievements game object. |
| `raAchievements` | `object` | `undefined` | List of achievements. |
| `onRALogin` | `(user) => void` | `undefined` | Callback for RA login. |
| `onRALogout` | `() => void` | `undefined` | Callback for RA logout. |
| `onEmergencySave` | `(blob) => Promise` | `undefined` | Handler for emergency saves (tab close/hide). |

## Reliability Features

-   **Save Queue**: Built-in queue system prevents save corruption by serializing all save/load operations.
-   **Optimized File System**: Includes a patched version of Nostalgist.js to eliminate file system timeouts during heavy load (e.g., rewind buffering).
-   **Emergency Saves**: Automatically attempts to save progress when the tab is closed or hidden.

## License

MIT © [Mudit Juneja](https://github.com/muditjuneja)
