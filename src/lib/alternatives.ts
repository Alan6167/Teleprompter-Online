/**
 * Comparison pages.
 *
 * These name competing products, so the rule for every line here is that it must be
 * something we would be comfortable with that company reading. Claims stay at the level of
 * what a product is built around rather than specific pricing or free-tier limits, which
 * change without notice and would quietly turn these pages into misinformation.
 *
 * English-only, like the blog.
 */

export interface ComparisonRow {
  feature: string;
  them: string;
  us: string;
}

export interface Alternative {
  slug: string;
  /** The competing product, as they spell it. */
  competitor: string;
  title: string;
  description: string;
  updatedAt: string;
  intro: string[];
  strengths: { heading: string; paragraphs: string[] };
  differences: { heading: string; paragraphs: string[] };
  rows: ComparisonRow[];
  chooseThem: string[];
  chooseUs: string[];
}

export const ALTERNATIVES: Alternative[] = [
  {
    slug: 'cueprompter',
    competitor: 'CuePrompter',
    title: 'A CuePrompter alternative that kept the simplicity',
    description:
      'CuePrompter pioneered the no-login browser teleprompter. Here is an honest comparison with Teleprompter Online — what each does well, and which one fits how you record.',
    updatedAt: '2026-09-02',
    intro: [
      'CuePrompter has been doing the no-account browser teleprompter longer than almost anyone, and it deserves the credit: paste text, press play, done. That restraint is a real design position, not an absence of features.',
      'If you are here, it is probably because you want that same immediacy with a few things it does not do — a modern mobile layout, saved scripts, colour control. This page lays out the differences honestly, including where CuePrompter is still the better answer.',
    ],
    strengths: {
      heading: 'What CuePrompter does well',
      paragraphs: [
        'It is the fastest possible path from a block of text to scrolling words. No account, no settings to wade through, no onboarding. For a one-off read on a desktop machine, that is hard to improve on.',
        'It has also been stable and free for a very long time, which counts for something in a category where tools appear and disappear. If it already does what you need, there is no reason to switch.',
      ],
    },
    differences: {
      heading: 'Where Teleprompter Online differs',
      paragraphs: [
        'The main difference is the device you are likely to read from. Teleprompter Online is built mobile-first: landscape fullscreen, large touch targets, tap-anywhere pause and resume, and a layout that assumes the screen might be a phone clamped under a lens rather than a desktop browser window.',
        'The second difference is memory. Your settings and your current draft are saved automatically, and you can keep multiple named scripts — all in your own browser, none of it uploaded. Close the tab mid-edit and everything is where you left it.',
        'Beyond that: voice-following scroll, text and background colour control, .docx and subtitle import, six interface languages, and offline support after the first visit.',
      ],
    },
    rows: [
      { feature: 'Account required', them: 'No', us: 'No' },
      { feature: 'Price', them: 'Free', us: 'Free, uncapped' },
      { feature: 'Mirror mode', them: 'Yes', us: 'Horizontal and vertical' },
      { feature: 'Mobile-first layout', them: 'Desktop-oriented', us: 'Built for phones and tablets' },
      { feature: 'Saved scripts', them: 'Not offered', us: 'Multiple, stored in your browser' },
      { feature: 'Autosaved draft and settings', them: 'Not offered', us: 'Yes' },
      { feature: 'Voice-following scroll', them: 'Not offered', us: 'Yes, free' },
      { feature: 'File import', them: 'Paste only', us: '.txt, .md, .docx, .rtf, .srt, .vtt' },
      { feature: 'Text and background colours', them: 'Fixed', us: 'Presets plus custom' },
      { feature: 'Interface languages', them: 'English', us: 'Six' },
      { feature: 'Works offline', them: 'No', us: 'Yes, after first visit' },
    ],
    chooseThem: [
      'You want the absolute minimum interface and nothing else.',
      'You only ever read from a desktop browser.',
      'It already works for you — familiarity has real value.',
    ],
    chooseUs: [
      'You read from a phone or tablet near the lens.',
      'You reuse intros, outros or sponsor reads and want them saved.',
      'You want the script to follow your voice instead of a timer.',
      'You need the interface in a language other than English.',
    ],
  },

  {
    slug: 'speakflow',
    competitor: 'Speakflow',
    title: 'A Speakflow alternative with free, uncapped voice scrolling',
    description:
      'Speakflow built its reputation on voice-activated scrolling. An honest comparison with Teleprompter Online, which offers voice following free and stores nothing in the cloud.',
    updatedAt: '2026-09-02',
    intro: [
      'Speakflow made voice-activated scrolling mainstream in browser teleprompters, and it remains a polished implementation with genuinely useful extras — notably a remote mode for syncing several devices during a shoot.',
      'The comparison below is about two different products rather than a better and a worse one: Speakflow is an account-based tool with cloud scripts and tiered features, and Teleprompter Online is a local-first tool with no account and no tiers.',
    ],
    strengths: {
      heading: 'What Speakflow does well',
      paragraphs: [
        'Voice following is the feature it is built around, and it shows in the polish. Cloud storage means your scripts follow you from a laptop to a tablet without thinking about it, which is a real convenience a local-first tool cannot match.',
        'Remote mode — controlling and syncing the prompter across multiple devices — is genuinely useful on a set with an operator, and it is not something a page with no backend can offer.',
      ],
    },
    differences: {
      heading: 'Where Teleprompter Online differs',
      paragraphs: [
        'Voice following here is free and uncapped, with no account and no minutes to watch. It uses your browser\'s built-in speech recognition and matches the transcript against your script locally.',
        'One thing worth being straight about, since this is a privacy-positioned product: your script text stays on your device, but most browsers — Chrome included — send the audio itself to their own speech-recognition service to transcribe it. That is true of any browser-based voice prompter, ours as much as anyone\'s. If it matters for a given recording, leave voice mode off; the rest of the tool works without it.',
        'The wider difference is storage. There is no cloud here at all: scripts, drafts and settings live in your browser. That means genuine privacy and no account, and it also means no sync between your devices. Which of those matters more is a real decision, not a marketing one.',
      ],
    },
    rows: [
      { feature: 'Account required', them: 'Yes', us: 'No' },
      { feature: 'Voice-following scroll', them: 'Yes, tiered', us: 'Yes, free and uncapped' },
      { feature: 'Script storage', them: 'Cloud', us: 'Your browser only' },
      { feature: 'Sync across devices', them: 'Yes', us: 'No' },
      { feature: 'Remote / multi-device control', them: 'Yes', us: 'Not offered' },
      { feature: 'Mirror mode', them: 'Yes', us: 'Horizontal and vertical, free' },
      { feature: 'Video recording', them: 'On paid tiers', us: 'Not offered' },
      { feature: 'File import', them: 'Yes', us: '.txt, .md, .docx, .rtf, .srt, .vtt' },
      { feature: 'Interface languages', them: 'English', us: 'Six' },
      { feature: 'Works offline', them: 'No', us: 'Yes, after first visit' },
    ],
    chooseThem: [
      'You need your scripts on several devices without moving them by hand.',
      'You want remote control across devices during a shoot.',
      'You want recording built into the same tool.',
    ],
    chooseUs: [
      'You want voice following without an account or a usage cap.',
      'Your scripts are confidential and you would rather they never left the device.',
      'You want everything free with no tier to hit mid-project.',
      'You need the interface in Spanish, Portuguese, French, German or Italian.',
    ],
  },

  {
    slug: 'teleprompter-apps',
    competitor: 'teleprompter apps',
    title: 'A free alternative to paid teleprompter apps',
    description:
      'Most teleprompter apps ask for an install, an account and a subscription. What you give up — and what you gain — by using a browser teleprompter instead.',
    updatedAt: '2026-09-02',
    intro: [
      'The App Store and Play Store are full of capable teleprompter apps, and several are genuinely excellent. They also tend to share a shape: install, sign up, hit a limit, subscribe.',
      'A browser teleprompter is a different trade rather than a strictly better one. This page is about which trade suits which kind of work.',
    ],
    strengths: {
      heading: 'What native apps do better',
      paragraphs: [
        'Recording is the big one. A native app can drive the camera and display the script at the same time, which no browser page can do — a phone cannot run its camera app and a fullscreen web prompter simultaneously. If you shoot on the same phone you read from, a native app solves a problem we simply cannot.',
        'They also tend to offer deeper integrations: camera overlays, captioning, direct publishing, hardware remotes, and background operation while other apps are open. If your workflow lives on one device, that integration is worth real money.',
      ],
    },
    differences: {
      heading: 'What a browser teleprompter gives you instead',
      paragraphs: [
        'No install, which matters more than it sounds. It works on a locked-down work laptop, on a borrowed machine, on a phone with no storage left, and on whatever operating system the room happens to have. Add it to your home screen and it launches like an app anyway.',
        'No account and no tier. Mirror mode, voice following, file import, saved scripts and fullscreen are all free, because there is no per-user cost to recover — the site is static files on a CDN.',
        'And nothing leaves your device: scripts, drafts and settings live in your browser rather than in someone\'s account system. For confidential material that is a category difference, not a feature comparison.',
      ],
    },
    rows: [
      { feature: 'Install required', them: 'Yes', us: 'No' },
      { feature: 'Account required', them: 'Usually', us: 'No' },
      { feature: 'Cost', them: 'Free tier plus subscription', us: 'Free, uncapped' },
      { feature: 'Records video with script overlay', them: 'Commonly yes', us: 'No — use your camera app' },
      { feature: 'Read and film on one phone', them: 'Yes', us: 'Needs a second device' },
      { feature: 'Script storage', them: 'Usually cloud account', us: 'Your browser only' },
      { feature: 'Works on a managed work laptop', them: 'Often blocked', us: 'Yes' },
      { feature: 'Mirror mode', them: 'Sometimes paid', us: 'Free' },
      { feature: 'Voice-following scroll', them: 'Often paid', us: 'Free' },
      { feature: 'Works offline', them: 'Yes', us: 'Yes, after first visit' },
    ],
    chooseThem: [
      'You film and read on the same phone.',
      'You want recording, captions and publishing in one place.',
      'You use a hardware remote or foot pedal.',
    ],
    chooseUs: [
      'You film on a separate camera, or have a spare phone or tablet.',
      'You cannot install software on the machine you are using.',
      'You want every feature free, with nothing behind a tier.',
      'Your scripts should not sit in a third party\'s account system.',
    ],
  },
];

export const ALTERNATIVE_SLUGS = ALTERNATIVES.map((item) => item.slug);

export function getAlternative(slug: string): Alternative | undefined {
  return ALTERNATIVES.find((item) => item.slug === slug);
}
