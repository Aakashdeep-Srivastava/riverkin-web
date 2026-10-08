/**
 * Education content cluster for /learn/<slug>. Plain data so the route can
 * render the article, build Article + FAQ JSON-LD, and feed the sitemap.
 *
 * These pages are the SEO + social surface of RiverKin: the app itself (map,
 * field check, verify) is a private PWA that does not rank, so organic reach
 * comes from searchable, shareable guides on river health and citizen science.
 * Each guide doubles as a script outline for X / YouTube / Instagram.
 *
 * Keep claims accurate and tied to how RiverKin actually works (visual bank-side
 * observation, macroinvertebrates as bioindicators, peer verification → FHIR).
 */

export interface LearnSection {
  h: string;
  p?: string[];
  ul?: string[];
}

export interface LearnFaq {
  q: string;
  a: string;
}

export interface LearnArticle {
  slug: string;
  /** SEO <title> (~55–60 chars incl. brand). */
  title: string;
  /** On-page H1. */
  h1: string;
  /** Meta description (~150–160 chars). */
  description: string;
  keywords: string[];
  datePublished: string;
  dateModified: string;
  readMinutes: number;
  /** One-line social hook — reuse as the X / caption opener. */
  hook: string;
  intro: string;
  sections: LearnSection[];
  faq: LearnFaq[];
}

export const LEARN_ARTICLES: LearnArticle[] = [
  {
    slug: 'how-to-tell-if-a-river-is-polluted',
    title: 'How to Tell if a River Is Polluted: 8 Signs — RiverKin',
    h1: 'How to tell if a river is polluted: 8 signs anyone can spot',
    description:
      'You do not need a lab to read a river. Learn the 8 visual signs of water pollution you can spot from the bank in five minutes — safely.',
    keywords: [
      'how to tell if a river is polluted',
      'signs of water pollution',
      'river pollution signs',
      'is my river polluted',
      'water quality visual indicators',
    ],
    datePublished: '2026-10-08',
    dateModified: '2026-10-08',
    readMinutes: 5,
    hook: 'You can read the health of a river in five minutes, from the bank, with no equipment. Here are the 8 signs.',
    intro:
      'A healthy stream and a struggling one look different — and most of the difference is visible to the naked eye. You do not need a chemistry kit to notice that something is wrong. Below are eight signs citizen scientists use to read a river from the bank. Observe only; never enter the water or touch anything near a pipe or outfall.',
    sections: [
      {
        h: '1. Unusual water colour',
        p: [
          'Clear or tea-brown (from natural tannins) is usually fine. Milky grey, bright blue-green, orange, or an oily rainbow sheen on the surface is not. A sudden colour change along a short stretch often points to a discharge entering upstream.',
        ],
      },
      {
        h: '2. Foam and suds',
        p: [
          'A little natural foam forms below waterfalls and riffles and breaks up quickly. Thick, long-lasting white or brown foam that piles up, especially near a pipe, can indicate detergents, sewage or industrial surfactants.',
        ],
      },
      {
        h: '3. Smell',
        p: [
          'Healthy water smells of little more than damp earth. A sewage, rotten-egg (hydrogen sulphide), chemical or petrol smell is a warning sign — and a reason to keep your distance rather than investigate closely.',
        ],
      },
      {
        h: '4. Litter and plastic load',
        p: [
          'Visible trash is both a direct harm and a proxy: stretches that trap a lot of plastic often have poor flow, illegal dumping or combined-sewer overflows nearby.',
        ],
      },
      {
        h: '5. Pipes and outfalls',
        p: [
          'Note any pipe discharging into the channel, its colour and whether it is flowing in dry weather (dry-weather flow from a storm outfall is a classic misconnection sign). Record it from a safe distance — this is exactly the kind of observation that helps a city act.',
        ],
      },
      {
        h: '6. Algae blooms',
        p: [
          'Bright green mats or blue-green scums signal nutrient pollution (nitrogen and phosphorus from fertiliser or sewage). Some blue-green algae are toxic to pets and people, so look, do not touch.',
        ],
      },
      {
        h: '7. Bank vegetation and erosion',
        p: [
          'A living, vegetated bank filters runoff and shades the water. Bare, eroding or concreted banks let pollution and heat straight in. Note whether the bank is green and varied or stripped and collapsing.',
        ],
      },
      {
        h: '8. The life in the water',
        p: [
          'The strongest single tell is what lives there. Mayfly, stonefly and caddisfly larvae need clean, oxygen-rich water — find them and the river is probably healthy. A stream dominated by worms and leeches with none of the sensitive insects is usually polluted. (More on this in the macroinvertebrate guide below.)',
        ],
      },
      {
        h: 'Turn what you saw into something that counts',
        p: [
          'One person noticing is good; a record a city can act on is better. RiverKin turns a five-minute bank-side observation — a few photos and simple answers — into verified, standardised data that scientists and local authorities already use. Your single visit joins thousands of others watching the same rivers.',
        ],
      },
    ],
    faq: [
      {
        q: 'Can I tell if a river is polluted without testing the water?',
        a: 'Yes — many pollution signs are visual: abnormal colour, persistent foam, bad smells, algae blooms, pipes with dry-weather flow, and the absence of sensitive insect life. Visual observation will not measure exact chemistry, but it reliably flags rivers that need attention.',
      },
      {
        q: 'Is it safe to check a river myself?',
        a: 'Observe and photograph from the bank only. Never wade in, and keep well back from pipes, outfalls, sewage or algae scums. If you smell chemicals or sewage, stay away and report it from a distance.',
      },
      {
        q: 'What should I do if I think a river is polluted?',
        a: 'Record what you saw with a photo and the location, and submit it to a citizen-science programme like RiverKin or your local environmental authority. A documented, verified observation is far more useful than an unrecorded concern.',
      },
    ],
  },
  {
    slug: 'what-macroinvertebrates-tell-you-about-water',
    title: 'What Water Bugs Tell You About River Health — RiverKin',
    h1: 'What the bugs in the water tell you about river health',
    description:
      'Macroinvertebrates are nature’s water-quality meters. Learn which river bugs mean clean water, which mean trouble, and how to read them.',
    keywords: [
      'macroinvertebrates water quality',
      'what do mayflies indicate',
      'bioindicators river health',
      'river bugs clean water',
      'benthic macroinvertebrates',
    ],
    datePublished: '2026-10-08',
    dateModified: '2026-10-08',
    readMinutes: 6,
    hook: 'The cheapest water-quality sensor ever made has six legs. Here is how to read the bugs in a river.',
    intro:
      'Scientists have a trick for judging a river that needs no instruments: look at the small animals living on the stream bed. These macroinvertebrates — insect larvae, snails, worms, shrimp — differ hugely in how much pollution they can tolerate, and because they live in one spot for months, they integrate water quality over time in a way a single chemical spot-test cannot.',
    sections: [
      {
        h: 'Why bugs beat a spot-test',
        p: [
          'A water sample tells you the chemistry at one instant. A pollution spike at 2am can be long gone by the time you sample. Macroinvertebrates cannot leave, so a community of pollution-sensitive species is proof the water has been clean for a sustained period. This is why biological monitoring underpins water-quality law such as the EU Water Framework Directive.',
        ],
      },
      {
        h: 'The clean-water crew (sensitive species)',
        ul: [
          'Mayfly larvae (Ephemeroptera) — flattened bodies, three tails; need high oxygen.',
          'Stonefly larvae (Plecoptera) — two tails; the most pollution-sensitive of all. Their presence is a strong "clean" signal.',
          'Caddisfly larvae (Trichoptera) — many build little cases of sand or twigs.',
        ],
      },
      {
        h: 'The tolerant crew (pollution-friendly species)',
        ul: [
          'Bloodworms (red midge larvae) — the red is haemoglobin for low-oxygen water.',
          'Sludgeworms (Tubifex) — thrive in organically polluted mud.',
          'Rat-tailed maggots and certain leeches — tolerate very low oxygen.',
        ],
        p: [
          'A stream where you can only find these, and none of the sensitive insects, is usually telling you the water is polluted or starved of oxygen.',
        ],
      },
      {
        h: 'How to read a sample (the EPT idea)',
        p: [
          'You do not need species-level identification to get a useful reading. Count how many different kinds of sensitive groups you find — especially the EPT orders (Ephemeroptera, Plecoptera, Trichoptera). More distinct sensitive groups generally means healthier water. Good variety across tolerant and sensitive groups also matters: a river with only one or two kinds of anything is a stressed river.',
        ],
      },
      {
        h: 'RiverKin uses this science',
        p: [
          'Each RiverKin site shows real OneAquaHealth ecology data — including macroinvertebrate, diatom and fish indicators — alongside the citizen observations. When you check a site, you are adding the "what does it look like today" layer on top of the deeper biological picture, so a city sees both the long-term baseline and what changed this week.',
        ],
      },
    ],
    faq: [
      {
        q: 'What are macroinvertebrates?',
        a: 'Macroinvertebrates are small animals without backbones that are big enough to see — insect larvae, snails, worms, shrimp and similar — that live on and under stones on a river bed. Many are used as bioindicators of water quality.',
      },
      {
        q: 'Which river bugs mean clean water?',
        a: 'Mayfly, stonefly and caddisfly larvae (the "EPT" orders) need clean, oxygen-rich water, so finding several kinds of them is a strong sign of a healthy river.',
      },
      {
        q: 'Which bugs mean a river is polluted?',
        a: 'A stream dominated by bloodworms, sludgeworms, rat-tailed maggots and leeches — with none of the sensitive mayflies, stoneflies or caddisflies — usually indicates organic pollution or low oxygen.',
      },
    ],
  },
  {
    slug: 'what-is-citizen-science-water-monitoring',
    title: 'Citizen Science Water Monitoring: A Beginner Guide — RiverKin',
    h1: 'Citizen science for water: how 5 minutes helps protect a river',
    description:
      'What is citizen-science water monitoring, does the data really count, and how do you start? A plain-language guide for beginners and schools.',
    keywords: [
      'citizen science water monitoring',
      'what is citizen science',
      'community water monitoring',
      'how to monitor river health',
      'citizen science for schools',
    ],
    datePublished: '2026-10-08',
    dateModified: '2026-10-08',
    readMinutes: 5,
    hook: 'There are more rivers than there are scientists to watch them. That gap is where you come in.',
    intro:
      'Citizen science is research done with the help of the public — ordinary people collecting real observations that scientists and authorities use. For rivers it matters enormously, because there are far more streams than any agency can monitor, and the people who walk past them every day are the ones who notice when something changes.',
    sections: [
      {
        h: 'Why rivers need citizens',
        p: [
          'Official monitoring networks sample a limited set of points, often only a few times a year. Pollution events — a spill, a sewer overflow after rain — are short and easily missed. A distributed network of people can watch far more water, far more often, and catch the things a quarterly sample never would.',
        ],
      },
      {
        h: 'Does the data really count?',
        p: [
          'It can — if it is collected consistently and verified. The key is structure: a simple, repeatable protocol, a photo as evidence, a precise location, and a way to confirm observations. RiverKin does this by having peers verify each check (three independent agreements make it "community-verified") and then exporting the result as standardised FHIR health data — the same format cities, scientists and biodiversity teams already use. That turns a walk by the river into a record an institution can act on.',
        ],
      },
      {
        h: 'How to start in five minutes',
        ul: [
          'Pick a stretch of river you can reach safely and will pass regularly.',
          'Observe from the bank: water colour, foam, smell, litter, any pipes, bank vegetation.',
          'Take a few clear photos.',
          'Answer a short set of simple questions in an app like RiverKin.',
          'Submit — and let others verify it so it counts.',
        ],
      },
      {
        h: 'Great for schools and groups',
        p: [
          'River monitoring is a natural fit for classes and clubs: it is hands-on, local, and ties maths, biology and civics together. RiverKin supports teacher-led crews where under-16s take part pseudonymously — no personal accounts, no public profiles — with the teacher reviewing submissions before they enter the shared pool.',
        ],
      },
      {
        h: 'Your single check is not alone',
        p: [
          'The power is cumulative. One observation is a data point; thousands, repeated over time across a city, become a living health record for its rivers — showing which stretches are improving, which are slipping, and where to act first.',
        ],
      },
    ],
    faq: [
      {
        q: 'What is citizen-science water monitoring?',
        a: 'It is members of the public collecting structured observations about rivers and streams — such as water colour, foam, litter and signs of life — using a shared protocol, so the combined data can be used by scientists and local authorities.',
      },
      {
        q: 'Do I need any qualifications or equipment?',
        a: 'No. A phone and a safe spot on the bank are enough to get started. Programmes like RiverKin guide you through a few simple questions and use peer verification to keep the data reliable.',
      },
      {
        q: 'Is citizen-science river data actually used?',
        a: 'Yes, when it is verified and standardised. RiverKin exports verified checks as FHIR data in the same format institutions already use, and its sites are tied to real OneAquaHealth ecology data.',
      },
    ],
  },
];

export function getArticle(slug: string): LearnArticle | undefined {
  return LEARN_ARTICLES.find((a) => a.slug === slug);
}
