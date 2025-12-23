export interface SystemConfig {
    // Canonical key - the internal identifier (e.g., 'NES', 'GB', 'GBA')
    key: string;

    // Display info
    label: string;           // User-friendly name (e.g., 'Nintendo (NES)')
    fullName: string;        // Full name (e.g., 'Nintendo Entertainment System')
    slug: string;            // URL-friendly (e.g., 'nes')

    // File detection
    extensions: string[];    // File extensions (e.g., ['.nes'])

    // Emulation
    core: string;            // RetroArch core (e.g., 'fceumm')
    coreSource?: 'nostalgist' | 'emulatorjs' | 'linuxserver'; // Core source: nostalgist (default), emulatorjs, or linuxserver

    // Database matching (LaunchBox)
    dbNames: string[];       // Possible DB names to search for

    // UI
    iconName: string;        // ConsoleIcon component name
    color: string;           // Tailwind hover color class
    accentHex: string;       // Hex color for accents

    // Aliases - other names that should map to this system
    aliases: string[];

    // Metadata
    biosNeeded?: boolean;
    biosFileNames?: string[]; // Expected filenames for BIOS matching
    biosLocation?: 'system' | 'rom_folder'; // Where to mount the BIOS ('system' dir or alongside 'rom_folder')
    maxFileSizeMB?: number; // Max file size in MB (default: 100, CD-based: 700)
}

/**
 * The master system configuration
 * Order matters for display in dropdowns
 */
export const SYSTEMS: SystemConfig[] = [
    // ============ Nintendo ============
    {
        key: 'NES',
        label: 'Nintendo (NES)',
        fullName: 'Nintendo Entertainment System',
        slug: 'nes',
        extensions: ['.nes'],
        core: 'fceumm',
        dbNames: ['NES', 'Nintendo Entertainment System'],
        iconName: 'NES',
        color: 'group-hover:text-[#E60012]',
        accentHex: '#E60012', // Nintendo Red
        aliases: ['NINTENDO ENTERTAINMENT SYSTEM', 'FAMICOM'],
    },
    {
        key: 'SNES',
        label: 'Super Nintendo (SNES)',
        fullName: 'Super Nintendo Entertainment System',
        slug: 'snes',
        extensions: ['.snes', '.smc', '.sfc'],
        core: 'snes9x',
        dbNames: ['SNES', 'Super Nintendo Entertainment System'],
        iconName: 'SNES',
        color: 'group-hover:text-[#514689]',
        accentHex: '#514689', // SNES Purple
        aliases: ['SUPER NINTENDO', 'SUPER NINTENDO ENTERTAINMENT SYSTEM', 'SUPER FAMICOM'],
    },
    {
        key: 'N64',
        label: 'Nintendo 64',
        fullName: 'Nintendo 64',
        slug: 'n64',
        extensions: ['.n64', '.z64', '.v64'],
        core: 'mupen64plus_next',
        coreSource: 'linuxserver',
        dbNames: ['N64', 'Nintendo 64'],
        iconName: 'N64',
        color: 'group-hover:text-[#FFB300]',
        accentHex: '#FFB300', // N64 Gold
        aliases: ['NINTENDO 64'],
    },
    {
        key: 'GB',
        label: 'Game Boy',
        fullName: 'Game Boy',
        slug: 'gb',
        extensions: ['.gb'],
        core: 'gambatte',
        dbNames: ['Nintendo Game Boy'],
        iconName: 'GB',
        color: 'group-hover:text-[#8BC34A]',
        accentHex: '#8BC34A', // GB Green
        aliases: ['GAME BOY', 'GAMEBOY', 'NINTENDO GAME BOY'],
    },
    {
        key: 'GBC',
        label: 'Game Boy Color',
        fullName: 'Game Boy Color',
        slug: 'gbc',
        extensions: ['.gbc'],
        core: 'gambatte',
        dbNames: ['Nintendo Game Boy Color'],
        iconName: 'GBC',
        color: 'group-hover:text-[#9C27B0]',
        accentHex: '#9C27B0', // GBC Purple
        aliases: ['GAME BOY COLOR', 'GAMEBOY COLOR', 'NINTENDO GAME BOY COLOR'],
    },
    {
        key: 'GBA',
        label: 'Game Boy Advance',
        fullName: 'Game Boy Advance',
        slug: 'gba',
        extensions: ['.gba'],
        core: 'mgba',
        dbNames: ['Nintendo Game Boy Advance'],
        iconName: 'GBA',
        color: 'group-hover:text-[#3F51B5]',
        accentHex: '#3F51B5', // GBA Indigo
        aliases: ['GAME BOY ADVANCE', 'GAMEBOY ADVANCE', 'NINTENDO GAME BOY ADVANCE'],
    },
    {
        key: 'NDS',
        label: 'Nintendo DS',
        fullName: 'Nintendo DS',
        slug: 'nds',
        extensions: ['.nds'],
        core: 'melonds',
        coreSource: 'linuxserver',
        dbNames: ['Nintendo DS'],
        iconName: 'NDS',
        color: 'group-hover:text-[#00BCD4]',
        accentHex: '#00BCD4', // DS Cyan
        aliases: ['NDS', 'NINTENDO DS'],
        maxFileSizeMB: 512, // DS games are 128MB-512MB
    },
    {
        key: 'VIRTUAL_BOY',
        label: 'Virtual Boy',
        fullName: 'Virtual Boy',
        slug: 'virtualboy',
        extensions: ['.vb'],
        core: 'mednafen_vb',
        dbNames: ['Nintendo Virtual Boy'],
        iconName: 'VIRTUAL_BOY',
        color: 'group-hover:text-[#D50000]',
        accentHex: '#D50000', // VB Red
        aliases: ['VIRTUAL BOY', 'NINTENDO VIRTUAL BOY'],
    },

    // Note: Dreamcast (flycast) removed - core not available in any web source
    {
        key: 'SATURN',
        label: 'Sega Saturn',
        fullName: 'Sega Saturn',
        slug: 'saturn',
        extensions: ['.cue', '.chd', '.iso', '.7z'],
        core: 'yabause',
        coreSource: 'linuxserver',
        dbNames: ['Sega Saturn'],
        iconName: 'SATURN',
        color: 'group-hover:text-[#FFA000]',
        accentHex: '#FFA000', // Saturn Orange/Gold
        aliases: ['SATURN', 'SEGA SATURN'],
        biosNeeded: true,
        biosFileNames: ['sega_101.bin', 'mpr-17933.bin'],
        maxFileSizeMB: 700, // CD-ROM games can be up to 700MB
    },
    {
        key: 'GENESIS',
        label: 'Sega Genesis',
        fullName: 'Sega Genesis / Mega Drive',
        slug: 'genesis',
        extensions: ['.gen', '.md', '.smd'],
        core: 'genesis_plus_gx',
        dbNames: ['GENESIS', 'Sega Genesis', 'Sega Mega Drive'],
        iconName: 'GENESIS',
        color: 'group-hover:text-[#0060A9]',
        accentHex: '#0060A9', // Genesis Blue
        aliases: ['SEGA GENESIS', 'MEGA DRIVE', 'SEGA MEGA DRIVE', 'MEGADRIVE'],
        biosNeeded: true, // For Sega CD
        biosFileNames: ['bios_CD_U.bin', 'bios_CD_E.bin', 'bios_CD_J.bin'],
    },
    {
        key: 'MASTER_SYSTEM',
        label: 'Sega Master System',
        fullName: 'Sega Master System',
        slug: 'mastersystem',
        extensions: ['.sms'],
        core: 'gearsystem',
        dbNames: ['Sega Master System'],
        iconName: 'MASTER_SYSTEM',
        color: 'group-hover:text-[#00897B]',
        accentHex: '#00897B', // SMS Teal
        aliases: ['MASTER SYSTEM', 'SEGA MASTER SYSTEM', 'SMS'],
    },
    {
        key: 'GAME_GEAR',
        label: 'Sega Game Gear',
        fullName: 'Sega Game Gear',
        slug: 'gamegear',
        extensions: ['.gg'],
        core: 'gearsystem',
        dbNames: ['Sega Game Gear'],
        iconName: 'GAME_GEAR',
        color: 'group-hover:text-[#1976D2]',
        accentHex: '#1976D2', // GG Blue
        aliases: ['GAME GEAR', 'SEGA GAME GEAR', 'GG'],
    },

    // ============ Sony ============
    {
        key: 'PS1',
        label: 'PlayStation',
        fullName: 'Sony PlayStation',
        slug: 'ps1',
        extensions: ['.iso', '.cue', '.pbp'],
        core: 'pcsx_rearmed',
        dbNames: ['PLAYSTATION', 'Sony Playstation', 'Sony PlayStation'],
        iconName: 'PS1',
        color: 'group-hover:text-[#283593]',
        accentHex: '#283593', // PS1 Dark Blue
        aliases: ['PLAYSTATION', 'PSX', 'PS', 'SONY PLAYSTATION'],
        biosNeeded: true,
        biosFileNames: ['scph5500.bin', 'scph5501.bin', 'scph5502.bin', 'scph1001.bin'],
        maxFileSizeMB: 700, // CD-ROM games can be up to 700MB
    },

    // ============ NEC ============
    {
        key: 'PC_ENGINE',
        label: 'PC Engine / TurboGrafx-16',
        fullName: 'PC Engine / TurboGrafx-16',
        slug: 'pcengine',
        extensions: ['.pce'],
        core: 'mednafen_pce_fast',
        dbNames: ['PC Engine', 'TurboGrafx-16', 'NEC PC Engine', 'NEC TurboGrafx-16'],
        iconName: 'PC_ENGINE',
        color: 'group-hover:text-[#F57C00]',
        accentHex: '#F57C00', // PCE Orange
        aliases: ['PC ENGINE', 'TURBOGRAFX-16', 'TURBOGRAFX', 'PCE', 'TG16'],
        biosNeeded: true, // For CD games
        biosFileNames: ['syscard3.pce'],
    },

    // ============ SNK ============
    {
        key: 'NEOGEO',
        label: 'Neo Geo',
        fullName: 'SNK Neo Geo',
        slug: 'neogeo',
        extensions: ['.neo'],
        core: 'fbalpha2012_neogeo',
        dbNames: ['SNK Neo Geo MVS', 'SNK Neo Geo AES', 'SNK Neo Geo CD', 'Neo Geo'],
        iconName: 'NEOGEO',
        color: 'group-hover:text-[#C62828]',
        accentHex: '#C62828', // Neo Geo Red
        aliases: ['NEO GEO', 'NEO-GEO', 'SNK NEO GEO'],
        biosNeeded: true,
        biosFileNames: ['neogeo.zip'],
        biosLocation: 'rom_folder',
    },
    {
        key: 'NEOGEO_POCKET',
        label: 'Neo Geo Pocket',
        fullName: 'SNK Neo Geo Pocket',
        slug: 'neogeopocket',
        extensions: ['.ngp'],
        core: 'mednafen_ngp',
        dbNames: ['SNK Neo Geo Pocket'],
        iconName: 'NEOGEO_POCKET',
        color: 'group-hover:text-[#0277BD]',
        accentHex: '#0277BD', // NGP Blue
        aliases: ['NEO GEO POCKET', 'NGP'],
    },
    {
        key: 'NEOGEO_POCKET_COLOR',
        label: 'Neo Geo Pocket Color',
        fullName: 'SNK Neo Geo Pocket Color',
        slug: 'neogeopocketcolor',
        extensions: ['.ngc'],
        core: 'mednafen_ngp',
        dbNames: ['SNK Neo Geo Pocket Color'],
        iconName: 'NEOGEO_POCKET_COLOR',
        color: 'group-hover:text-[#AD1457]',
        accentHex: '#AD1457', // NGPC Pink
        aliases: ['NEO GEO POCKET COLOR', 'NGPC'],
    },

    // ============ Atari ============
    {
        key: 'LYNX',
        label: 'Atari Lynx',
        fullName: 'Atari Lynx',
        slug: 'lynx',
        extensions: ['.lnx', '.lyx'],
        core: 'handy',
        dbNames: ['Atari Lynx'],
        iconName: 'LYNX',
        color: 'group-hover:text-[#FBC02D]',
        accentHex: '#FBC02D', // Lynx Yellow
        aliases: ['ATARI LYNX'],
        biosNeeded: true,
        biosFileNames: ['lynxboot.img'],
    },
    {
        key: 'ATARI_5200',
        label: 'Atari 5200',
        fullName: 'Atari 5200',
        slug: 'atari5200',
        extensions: ['.a52'],
        core: 'atari800', // Note: a5200 core not available, using atari800 which supports 5200
        coreSource: 'linuxserver',
        dbNames: ['Atari 5200'],
        iconName: 'ATARI_5200', // Assuming we can reuse a generic icon or this exists. If not, will default or fail gracefully.
        color: 'group-hover:text-[#E65100]',
        accentHex: '#E65100', // 5200 Orange
        aliases: ['ATARI 5200', 'ATARI5200'],
        biosNeeded: true,
        biosFileNames: ['5200.rom'],
    },
    {
        key: 'ATARI_2600',
        label: 'Atari 2600',
        fullName: 'Atari 2600',
        slug: 'atari2600',
        extensions: ['.a26'],
        core: 'stella2014',
        coreSource: 'linuxserver',
        dbNames: ['Atari 2600'],
        iconName: 'ATARI_2600',
        color: 'group-hover:text-[#D84315]',
        accentHex: '#D84315', // 2600 Red-Orange
        aliases: ['ATARI 2600', 'ATARI2600'],
    },
    {
        key: 'ATARI_7800',
        label: 'Atari 7800',
        fullName: 'Atari 7800',
        slug: 'atari7800',
        extensions: ['.a78'],
        core: 'prosystem',
        coreSource: 'linuxserver',
        dbNames: ['Atari 7800'],
        iconName: 'ATARI_7800',
        color: 'group-hover:text-[#5D4037]',
        accentHex: '#5D4037', // 7800 Brown
        aliases: ['ATARI 7800', 'ATARI7800'],
    },

    // ============ Other ============
    {
        key: 'WONDERSWAN',
        label: 'WonderSwan',
        fullName: 'Bandai WonderSwan',
        slug: 'wonderswan',
        extensions: ['.ws'],
        core: 'mednafen_wswan',
        dbNames: ['Bandai WonderSwan'],
        iconName: 'WONDERSWAN',
        color: 'group-hover:text-[#7CB342]',
        accentHex: '#7CB342', // WS Green
        aliases: ['WONDERSWAN', 'WONDER SWAN', 'BANDAI WONDERSWAN'],
    },
    {
        key: 'WONDERSWAN_COLOR',
        label: 'WonderSwan Color',
        fullName: 'Bandai WonderSwan Color',
        slug: 'wonderswancolor',
        extensions: ['.wsc'],
        core: 'mednafen_wswan',
        dbNames: ['Bandai WonderSwan Color'],
        iconName: 'WONDERSWAN_COLOR',
        color: 'group-hover:text-[#009688]',
        accentHex: '#009688', // WSC Teal
        aliases: ['WONDERSWAN COLOR', 'WONDER SWAN COLOR', 'BANDAI WONDERSWAN COLOR', 'WSC'],
    },
    {
        key: 'ARCADE',
        label: 'Arcade (FBNeo)',
        fullName: 'Arcade',
        slug: 'arcade',
        extensions: ['.zip'],
        core: 'fbneo',
        dbNames: ['Arcade', 'MAME', 'FBNeo', 'FinalBurn Neo'],
        iconName: 'ARCADE',
        color: 'group-hover:text-[#E91E63]',
        accentHex: '#E91E63', // Arcade Neon Pink
        aliases: ['MAME', 'CPS1', 'CPS2', 'CPS3', 'FBNEO', 'FINALBURN', 'SYSTEM16', 'SEGA SYSTEM 16'],
        biosNeeded: true,
    },
    {
        key: 'C64',
        label: 'Commodore 64',
        fullName: 'Commodore 64',
        slug: 'c64',
        extensions: ['.d64', '.t64', '.tap', '.prg', '.crt'],
        core: 'vice_x64',
        dbNames: ['Commodore 64'],
        iconName: 'C64',
        color: 'group-hover:text-[#546E7A]',
        accentHex: '#546E7A', // C64 Blue-Grey
        aliases: ['C64', 'COMMODORE 64'],
    },
];
