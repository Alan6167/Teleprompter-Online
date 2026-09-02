/**
 * Blog content.
 *
 * Posts live in code rather than in `messages/` because the blog is English-only for now:
 * translating long-form articles into six locales before knowing which ones earn traffic
 * would be a lot of work spent ahead of the evidence. The page components read this file
 * directly; when a post proves worth translating, it can move into the message catalogue.
 */

export interface BlogSection {
  heading: string;
  paragraphs?: string[];
  list?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  /** Meta description and the excerpt shown on the index. */
  description: string;
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  tag: string;
  intro: string[];
  sections: BlogSection[];
  faq?: Array<{ q: string; a: string }>;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'teleprompter-for-zoom',
    title: 'How to use a teleprompter on Zoom, Google Meet and Teams',
    description:
      'A step-by-step guide to using a free browser teleprompter during video calls — where to put the window, how to keep it private when you share your screen, and the settings that keep you sounding natural.',
    publishedAt: '2026-09-02',
    updatedAt: '2026-09-02',
    readingMinutes: 7,
    tag: 'Guides',
    intro: [
      'Everyone on a video call can tell when you are reading. The tell is not the reading itself — it is the eye movement. Your gaze slides to the corner of the screen, comes back, slides away again, and the person watching reads that as evasion even when you are simply well prepared.',
      'The fix is mechanical rather than a matter of skill: move the words to where the camera already is. This guide covers exactly how to do that on Zoom, Google Meet and Microsoft Teams, including the part most people get wrong — keeping the prompter invisible when you share your screen.',
    ],
    sections: [
      {
        heading: 'Why notes beside the camera work better than notes on paper',
        paragraphs: [
          'A webcam sits at the top edge of your screen. Anything you read that is not directly beneath it forces your eyes off-axis, and the further off-axis, the more obvious it becomes. Paper notes on the desk are the worst case: they drop your gaze forty-five degrees and take your whole head with it.',
          'A narrow prompter strip immediately under the lens keeps your eyes within a few degrees of the camera. At that distance the movement reads as normal thinking rather than reading, which is the entire goal. You are not trying to hide that you prepared — you are trying to stop good preparation from looking like evasion.',
        ],
      },
      {
        heading: 'Setting it up: five minutes, once',
        list: [
          'Open the teleprompter in its own browser window, not a tab beside your call.',
          'Drag the window to the top of your screen, directly beneath your webcam.',
          'Resize it into a narrow horizontal strip — wide enough to read, short enough that your eyes barely travel vertically.',
          'Set the font size smaller than you would for camera work: 32–48 px suits a window this close to your face.',
          'Set the scroll speed to 50–75 px/s. Call delivery should sound like thinking, not reciting.',
          'Paste your script and leave it paused. Press Space only when you reach a part you actually want to read.',
        ],
      },
      {
        heading: 'Keeping it private when you share your screen',
        paragraphs: [
          'This is where prepared people get caught out. Every major meeting app offers a choice between sharing your entire screen and sharing one specific window or tab. Share the whole screen and your prompter goes out with it.',
          'In Zoom, choose the specific application window from the share dialogue rather than the Desktop tile. In Google Meet, pick "A window" or "A tab" instead of "Your entire screen". In Microsoft Teams, select the individual window under the share tray rather than the full desktop. In all three, the prompter window then never enters the stream, even though it is visibly on your monitor.',
          'If you present from slides regularly, get in the habit of sharing the slide application window specifically. It protects your prompter, your notifications and your other tabs in one move.',
        ],
      },
      {
        heading: 'A second screen is better, if you have one',
        paragraphs: [
          'A tablet or second monitor placed just under your webcam beats a window on the same screen, for one reason: nothing you do on your main display can accidentally reveal it. Screen sharing cannot capture a device that is not connected to the call at all.',
          'It also lets you use a larger font, which means each line is a single glance rather than a scan. If you take a lot of calls where you present, a cheap tablet on a small stand under the monitor is the highest-value upgrade available.',
        ],
      },
      {
        heading: 'What to actually put in the script',
        paragraphs: [
          'Less than you think. Full sentences read out word for word sound recited, and on a call that is worse than stumbling. The version that works is a skeleton: your opening line written out in full, then three or four short prompts, then the closing ask.',
          'The opening line matters because that is where nerves hit hardest and where a fumble costs the most attention. The closing ask matters because it is the thing people most often soften into vagueness when improvising. Everything in between you already know — you just need to be reminded of the order.',
        ],
      },
      {
        heading: 'Voice mode for longer calls',
        paragraphs: [
          'On a call that runs long, timed scrolling becomes a second thing to manage. Voice-following scroll removes that: the script advances as you speak and waits when you stop, so a question from someone else does not leave you thirty lines behind.',
          'It needs Chrome, Edge or Safari and microphone permission. Worth knowing before you rely on it: while the script matching happens in your browser, most browsers send the audio to their own speech-recognition service to transcribe it. If your call is confidential enough that this matters, leave voice mode off and scroll manually — everything else works without it.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can people on the call see my teleprompter?',
        a: 'Not unless you share it. Share a specific window or tab rather than your entire screen and the prompter is never transmitted, even though you can see it on your own monitor.',
      },
      {
        q: 'Will my eyes give it away?',
        a: 'Only if the prompter is far from the lens. Keep the window directly under the webcam and narrow, and the eye movement is small enough to read as normal conversation.',
      },
      {
        q: 'Does this work on a locked-down work laptop?',
        a: 'Usually, because a browser teleprompter needs no installation. Voice mode additionally needs microphone access, which some managed devices restrict; every other feature works without it.',
      },
    ],
  },

  {
    slug: 'best-free-teleprompter-apps',
    title: 'The best free teleprompter tools in 2026, honestly compared',
    description:
      'An honest look at the free teleprompter options available in 2026 — what each one is genuinely good at, where the free tiers stop, and how to work out which fits how you actually record.',
    publishedAt: '2026-09-02',
    updatedAt: '2026-09-02',
    readingMinutes: 8,
    tag: 'Comparisons',
    intro: [
      'We build one of the tools in this category, so treat this as an interested opinion rather than a neutral review. What we can offer is an honest account of what the alternatives do well, because pretending otherwise would be obvious to anyone who has tried two of them.',
      'The useful question is not "which teleprompter is best" — it is "what does the free tier actually include, and does that match how I record?" Free tiers move, so check the current terms before committing to any of them, this one included.',
    ],
    sections: [
      {
        heading: 'The four things that actually differ',
        paragraphs: [
          'Almost every teleprompter scrolls text at an adjustable speed. That part is solved everywhere. What separates the options is narrower than the marketing suggests:',
        ],
        list: [
          'Whether mirror mode is free. Some tools hold it behind a paid tier, which matters only if you use a beam-splitter rig — but matters completely if you do.',
          'Whether the tool records video for you, and whether the free tier watermarks it.',
          'Whether scripts live in the cloud or on your device. Cloud sync is genuinely convenient across devices; local storage is genuinely private. Neither is strictly better.',
          'Whether voice-following scroll is included, capped, or paid.',
        ],
      },
      {
        heading: 'Teleprompter.com',
        paragraphs: [
          'The most feature-complete of the mainstream options, with apps across web, iOS, Android and Mac, cloud script storage and several scrolling modes including voice-driven. If you want one product that covers recording as well as prompting, and you are comfortable with an account and cloud sync, it is the obvious first stop. The free tier is real but bounded — check what the current limits are on recording length and storage.',
        ],
      },
      {
        heading: 'Speakflow',
        paragraphs: [
          'Best known for voice-activated scrolling, which it did well before most competitors offered it at all, plus a remote mode for syncing multiple devices. The free tier includes script writing and limited voice-following. It is a good fit if voice control is the specific feature you came for and you do not mind an account.',
        ],
      },
      {
        heading: 'CuePrompter',
        paragraphs: [
          'The minimalist. No login, no install, no configuration — paste text and read. It has been around long enough that the interface shows its age, and it does very little beyond scrolling, which is exactly the point for people who want nothing else. If your needs stop at "text that moves", it will not get in your way.',
        ],
      },
      {
        heading: 'GoTeleprompter, BIGVU and the recording-first tools',
        paragraphs: [
          'This group treats the prompter as one part of a video-creation product: script, record, caption, publish. GoTeleprompter is notable for offering script-overlay recording without a watermark on its free tier, which is unusual. BIGVU leans further into the full creator workflow with captions and templates.',
          'They are worth your time if you want the whole pipeline in one place and are recording on the same device you read from. They are more than you need if you already film on a proper camera and just want words next to the lens.',
        ],
      },
      {
        heading: 'Where Teleprompter Online fits',
        paragraphs: [
          'We are the local-first, no-account option. Everything runs in your browser: your script, your current draft and your settings stay in local storage and are never uploaded, because there is no server to upload them to. Mirror mode, fullscreen, keyboard shortcuts, file import including .docx, and voice-following scroll are all free and uncapped, and the site works offline after your first visit.',
          'The honest trade-off: no cloud sync, so your scripts do not follow you to another device, and clearing your browser data deletes them. No built-in recording either — we assume you already have a camera app you prefer. If cross-device sync or one-click recording is what you need, one of the tools above will serve you better, and we would rather tell you that than waste your afternoon.',
        ],
      },
      {
        heading: 'How to choose in two minutes',
        list: [
          'You read through a glass teleprompter rig: check mirror mode is on the free tier before anything else.',
          'You record and read on the same phone: pick a tool that records, since a browser prompter cannot share the screen with your camera app.',
          'You work across a laptop and a tablet: you want cloud sync, which means an account.',
          'Your scripts are confidential: pick something local-first and read its privacy policy rather than its homepage.',
          'You just want to stop fumbling your intro: any of these will do. Take the one that opens fastest.',
        ],
      },
    ],
  },

  {
    slug: 'diy-teleprompter',
    title: 'How to build a DIY teleprompter with glass you already own',
    description:
      'Build a working beam-splitter teleprompter at home for very little money. What glass to use, why mirror mode matters, and the alignment steps that decide whether it looks professional or homemade.',
    publishedAt: '2026-09-02',
    updatedAt: '2026-09-02',
    readingMinutes: 9,
    tag: 'Guides',
    intro: [
      'A commercial teleprompter rig is a piece of glass at forty-five degrees, a hood to keep light off it, and a shelf for a tablet. That is genuinely all it is. The engineering that justifies the price is in rigidity and finish, not in principle — which means a home-built version works, as long as you understand what each part is doing.',
      'This is a practical build guide. It also explains why the text has to be mirrored, because that is the step people skip and then wonder why their footage reads backwards.',
    ],
    sections: [
      {
        heading: 'How a beam-splitter prompter works',
        paragraphs: [
          'A sheet of partially reflective glass sits at forty-five degrees in front of your lens. Your tablet lies flat below it, screen upward. The glass reflects the tablet toward you, so you see the script floating apparently at the lens. The camera, looking through the same glass from behind, sees only the scene — because the glass is transparent from that side and the tablet is shielded from view.',
          'That is why the illusion works: you read from a surface that appears to be exactly where the lens is, so your eye line is dead-on rather than approximately right. It is a genuinely different result from putting a phone next to the camera.',
        ],
      },
      {
        heading: 'What you need',
        list: [
          'A sheet of glass or acrylic, roughly 20 × 25 cm. A picture-frame glass panel works; so does a cheap acrylic sheet from a hardware shop.',
          'A tablet or phone for the script.',
          'Rigid black card or foam board for the hood.',
          'Gaffer tape, a craft knife, and something to hold the glass at 45° — a small box cut diagonally is the simplest option.',
          'Optional but transformative: proper beam-splitter glass, which is the one part genuinely worth buying.',
        ],
      },
      {
        heading: 'On glass: the one part worth paying for',
        paragraphs: [
          'Ordinary glass reflects perhaps eight percent of the light hitting it, so your reflected script will look dim and you will lose contrast in the footage. It works, and it is the right way to test the idea before spending anything.',
          'Real beam-splitter glass is coated to reflect around thirty percent and transmit seventy, which gives you a bright, readable script while letting most of the light through to the sensor. A sheet costs less than most camera accessories and is the difference between a rig you tolerate and one you use. If your test build convinces you, this is the upgrade to make first.',
        ],
      },
      {
        heading: 'Building it',
        list: [
          'Cut a box or frame so one face holds the glass at 45° to the tablet below it. Precision here matters more than materials: a few degrees off and the text sits visibly above or below the lens.',
          'Set the tablet flat, screen up, directly beneath the glass.',
          'Position the camera behind the glass, lens as close to the surface as it will go without touching.',
          'Build a hood of black card around the front of the glass and over the camera. This is not optional — stray light on the glass washes out both your script and your image.',
          'Line the inside of the hood and any surface the camera can see with matte black card. Anything reflective inside the enclosure shows up as a ghost.',
        ],
      },
      {
        heading: 'Why you must turn on mirror mode',
        paragraphs: [
          'A mirror reverses left and right. Your script is reflected once by the glass before it reaches your eye, so text displayed normally arrives backwards. Flip it horizontally on the tablet first and the two reversals cancel: what you read is the right way round.',
          'In Teleprompter Online, that is the mirror button, or the M key. Turn it on before you build anything else, because it makes the alignment steps far easier to judge — you can read the text while you work out where the glass should sit.',
        ],
      },
      {
        heading: 'Getting it aligned',
        paragraphs: [
          'Two adjustments decide whether it reads as professional. First, the glass angle: it should reflect the script so that it appears centred on the lens, not floating above or below it. Adjust by tilting the glass a degree at a time and checking your own eye line on the camera preview.',
          'Second, brightness. Turn the tablet up until the script is comfortably readable and no further. Too bright and the glass throws a visible glow onto your face; too dim and you squint, which the camera records faithfully. Set it in the lighting you will actually shoot in, not in a dark room.',
        ],
      },
      {
        heading: 'When a rig is not worth it',
        paragraphs: [
          'If you film mostly on a phone at arm\'s length, a rig is overkill — a second device just under the lens gets you ninety percent of the benefit for none of the effort. Beam splitters earn their place when the camera is further away, because that is when the gap between "next to the lens" and "at the lens" becomes visible.',
          'Build the cardboard version first. An afternoon and no money tells you whether the finished thing belongs in your setup, and if it does, you will know exactly which part to upgrade.',
        ],
      },
    ],
  },

  {
    slug: 'how-to-write-a-video-script',
    title: 'How to write a video script that sounds like speech',
    description:
      'Scripts fail on camera because they are written to be read, not said. Here is how to write for the ear — sentence length, rhythm, structure, and the read-aloud test that catches everything else.',
    publishedAt: '2026-09-02',
    updatedAt: '2026-09-02',
    readingMinutes: 8,
    tag: 'Writing',
    intro: [
      'The most common reason a teleprompter read sounds stiff is not the prompter and not the delivery. It is that the script was written the way people write, and spoken language and written language are genuinely different systems.',
      'Written prose can carry subordinate clauses, parenthetical asides and sentences that only resolve at the full stop, because a reader can go back. A listener cannot. Everything below follows from that single constraint.',
    ],
    sections: [
      {
        heading: 'Write short sentences, then cut them shorter',
        paragraphs: [
          'A sentence you can say in one breath is a sentence a listener can hold in their head. Once it runs past about twenty words, they are still parsing the opening while you deliver the end, and comprehension drops even though every individual word is clear.',
          'The practical test: read it aloud and mark where you naturally breathe. If you run out of air before a full stop, the sentence is too long — not for you, for them.',
        ],
      },
      {
        heading: 'One idea per line',
        paragraphs: [
          'This is a formatting rule with a delivery payoff. Break your script so each line carries a single thought, even when several lines form one sentence. On a scrolling prompter, a line becomes a unit your eye takes in at a glance, which frees you to look at the lens between them.',
          'It also exposes weak writing. A line that cannot stand as one thought is usually a line doing two jobs badly, and splitting it almost always improves the sentence as well as the read.',
        ],
      },
      {
        heading: 'Use contractions and the words you actually say',
        paragraphs: [
          'Say "you\'ll" rather than "you will", "it\'s" rather than "it is". Formal writing avoids contractions; speech is full of them, and a script without them sounds like a legal notice no matter how well you read it.',
          'The same goes for vocabulary. If you would say "use" in conversation, do not write "utilise". Read your script and circle every word you would not say to a colleague at lunch — those are the words that will make you sound like you are reading.',
        ],
      },
      {
        heading: 'Structure: give them the shape first',
        paragraphs: [
          'A listener who does not know where you are going spends their attention guessing instead of following. Tell them the shape early — "there are three things that matter here" — and they can slot everything that follows into place.',
          'This is why the hook and the roadmap sit at the front of almost every well-made video. Not because attention spans are short, but because a listener who knows the structure can afford to relax into the detail.',
        ],
      },
      {
        heading: 'Write in your own rhythm, not a generic one',
        paragraphs: [
          'Everyone has verbal habits: sentence lengths they favour, ways they open a point, phrases they return to. A script that fights those habits is harder to deliver than one that leans into them, and the difference is audible.',
          'The quickest way to find yours is to record two minutes of yourself explaining the topic with no script at all, transcribe it, and read it back. It will be a mess structurally, but the phrasing is yours. Keep the phrasing, fix the structure.',
        ],
      },
      {
        heading: 'The read-aloud test catches what editing misses',
        paragraphs: [
          'Read the finished script out loud, at full volume, standing up. Every awkward construction, tongue-twisting consonant cluster and unintentional rhyme surfaces immediately. Reading silently catches none of them, because your inner voice smooths over exactly the problems you are looking for.',
          'Do the final pass at the scroll speed you will record at. Timing problems only appear at speed — a paragraph that reads fine slowly can turn out to have nowhere to breathe.',
        ],
      },
      {
        heading: 'Plan the length before you record, not after',
        paragraphs: [
          'At a normal conversational pace of 130 to 150 words per minute, a five-minute video is around 700 words and a thirty-second clip is around 75. Knowing this before you write saves the demoralising experience of cutting a finished script in half.',
          'Add fifteen to twenty percent for anything with a live audience, since laughter, pauses and questions all consume real time that a word count cannot see.',
        ],
      },
    ],
    faq: [
      {
        q: 'Should I script every word or use bullet points?',
        a: 'It depends on the stakes. Full scripts suit anything where wording is legally or commercially precise, and short pieces where every second counts. Bullets suit longer, looser formats where sounding spontaneous matters more than exact phrasing.',
      },
      {
        q: 'How do I stop sounding like I am reading?',
        a: 'Read a line ahead of your voice, so you are delivering a line you have already absorbed rather than decoding the words as you say them. That single habit does more than any amount of rehearsal.',
      },
    ],
  },

  {
    slug: 'teleprompter-speed-guide',
    title: 'What teleprompter speed should you use?',
    description:
      'Scroll speed is the setting people get wrong most often. How to find yours in one rehearsal pass, why the right number depends on font size, and sensible starting points for each format.',
    publishedAt: '2026-09-02',
    updatedAt: '2026-09-02',
    readingMinutes: 6,
    tag: 'Guides',
    intro: [
      'Scroll speed is the setting that decides whether a prompter helps you or fights you, and it is the one most people never deliberately set. Too fast and you race to keep up, dropping the pauses that make delivery sound considered. Too slow and you start improvising filler while you wait for the next line.',
      'The good news is that finding your number takes one rehearsal pass, and once you know it, it barely changes.',
    ],
    sections: [
      {
        heading: 'Speed is measured in pixels, but you think in words',
        paragraphs: [
          'A prompter scrolls in pixels per second, because that is what a screen can measure. You care about words per minute, because that is how speech works. The two are related by your font size: at a large font, fewer words occupy the same vertical space, so the same pixel speed delivers fewer words per minute.',
          'This is why copying someone else\'s speed setting rarely works. Their 80 px/s at 40 px text is a completely different delivery from your 80 px/s at 64 px text. Always adjust speed after you have set font size, never before.',
        ],
      },
      {
        heading: 'Starting points by format',
        list: [
          'Wedding speeches and toasts: 40–60 px/s. Nerves make everyone faster on the night than in rehearsal.',
          'Keynotes and formal presentations: 45–70 px/s. Authority comes from unhurried pacing.',
          'Podcasts and long-form monologue: 50–75 px/s.',
          'Video calls: 50–75 px/s. You want to sound like you are thinking, not reciting.',
          'YouTube talking head: 70–100 px/s.',
          'TikTok, Reels and Shorts: 90–130 px/s. Short-form energy is genuinely quicker.',
        ],
      },
      {
        heading: 'Finding your number in one pass',
        paragraphs: [
          'Load a script you know well. Set the font size you will actually use, at the distance you will actually sit. Start at the middle of the range for your format and read the first paragraph aloud at your natural pace, without trying to match the scroll.',
          'If the reading line drifts above your voice, the scroll is too fast — drop it by ten. If it drifts below, raise it by ten. Two or three corrections and you will be within a few pixels of right. Write that number down; it will be your starting point for everything you record in that setup from now on.',
        ],
      },
      {
        heading: 'Read one line ahead',
        paragraphs: [
          'Fluent prompter reading is not reading the word you are saying. It is taking in the next line while your voice delivers the current one, the same way a musician reads slightly ahead of the note they are playing.',
          'It takes a few sessions to become automatic, and it changes what speed feels comfortable — most people can go slightly faster once they read ahead, and sound more natural doing it, because they are delivering absorbed phrases rather than decoding words in real time.',
        ],
      },
      {
        heading: 'When to stop setting speed at all',
        paragraphs: [
          'Any fixed speed is a compromise, because real delivery is not uniform. You slow for emphasis, pause for effect, and speed up through material you know cold. A timed scroll cannot follow that, so you spend attention managing it.',
          'Voice-following scroll removes the problem: the script advances as you speak and waits when you stop. For long or improvisation-heavy reads it is straightforwardly better than any number you could pick. For short, tightly-timed pieces a fixed speed is still often easier, because it keeps you honest about pace.',
        ],
      },
    ],
    faq: [
      {
        q: 'What is a normal teleprompter speed?',
        a: 'For conversational delivery at a 48 px font, 70–100 px/s is a common range. But the right number depends on your font size and reading distance, so treat any figure as a starting point rather than a setting to copy.',
      },
      {
        q: 'Should I change speed while recording?',
        a: 'Small corrections are fine and normal — arrow keys adjust in steps of ten without interrupting playback. If you are correcting constantly, the underlying speed is wrong; stop and reset it rather than steering all the way through.',
      },
    ],
  },
];

export const BLOG_SLUGS = BLOG_POSTS.map((post) => post.slug);

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
