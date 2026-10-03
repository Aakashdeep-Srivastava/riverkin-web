# RiverKin --- Brand & Design System

> **Design direction:** Minimal, vibrant, premium,
> nature-meets-technology.
>
> **Core visual idea:** A flowing river moving through layered terrain,
> with a warm sun representing energy, optimism, and forward movement.

------------------------------------------------------------------------

## 1. Brand Identity

### Brand Name

**RiverKin**

### Visual Personality

-   Vibrant
-   Modern
-   Human
-   Premium
-   Outdoors / nature inspired
-   Technological without looking overly futuristic
-   Confident and memorable

### Logo Concept

The primary mark combines:

-   A **royal-blue flowing river** as the central visual element.
-   **Deep maroon and crimson terrain** surrounding the river.
-   A **golden sun** positioned above the landscape.
-   Clean **white negative-space curves** separating the river and
    terrain.

The logo should remain recognizable when reduced to an app icon,
favicon, map marker, or small UI element.

------------------------------------------------------------------------

# 2. Color System

The palette is intentionally built around a strong blue + maroon
contrast, supported by a warm gold.

## Primary Colors

  -----------------------------------------------------------------------
  Token             Color             Hex               Usage
  ----------------- ----------------- ----------------- -----------------
  `river-blue`      Royal Blue        `#0052FF`         Primary actions,
                                                        river, active
                                                        states

  `azure-blue`      Azure Blue        `#1E7BFF`         Information,
                                                        links, highlights

  `deep-maroon`     Deep Maroon       `#7A003C`         Brand accent,
                                                        terrain, identity

  `crimson`         Crimson           `#C1124A`         Energy,
                                                        community,
                                                        notifications

  `sun-gold`        Sun Gold          `#FFC629`         Success,
                                                        achievements,
                                                        highlights
  -----------------------------------------------------------------------

## Neutral Colors

  Token        Color            Hex         Usage
  ------------ ---------------- ----------- ----------------------------
  `surface`    Warm Off White   `#F7F5F0`   Main background, cards
  `slate`      Slate            `#6B7280`   Secondary text, muted UI
  `midnight`   Midnight Navy    `#0E1B38`   Dark mode, strong headings

------------------------------------------------------------------------

# 3. Color Roles

### `river-blue`

Use for:

-   Primary CTA buttons
-   Active navigation
-   Selected map elements
-   Primary links
-   Progress indicators
-   Core brand interactions

### `azure-blue`

Use for:

-   Information states
-   Secondary actions
-   Interactive map elements
-   Hover states
-   Supporting visual data

### `deep-maroon`

Use for:

-   Brand identity elements
-   Major visual accents
-   Terrain / landscape illustrations
-   Important visual anchors

### `crimson`

Use sparingly for:

-   Community indicators
-   Notifications
-   Badges
-   Energy / engagement states
-   Secondary brand accents

### `sun-gold`

Use for:

-   Achievements
-   Milestones
-   Rewards
-   Positive highlights
-   Important visual emphasis

Gold should be an accent rather than the dominant interface color.

------------------------------------------------------------------------

# 4. Color Balance

Recommended visual ratio:

-   **45%** Warm Off White / neutral surfaces
-   **25%** Royal / Azure Blue
-   **20%** Deep Maroon / Crimson
-   **10%** Sun Gold

The interface should feel colorful without becoming visually noisy.

------------------------------------------------------------------------

# 5. Logo Usage

## Primary Mark

Use the full emblem on:

-   Landing pages
-   Product headers
-   Brand presentations
-   Marketing material
-   Large-format signage

## App Icon

Use the emblem inside a rounded-square container.

### Light Mode

-   Warm Off White background
-   Full-color RiverKin mark

### Dark Mode

-   Midnight Navy background
-   Full-color RiverKin mark

## Small Sizes

At very small sizes:

-   Preserve the river silhouette.
-   Keep the sun.
-   Avoid adding text.
-   Maintain strong contrast.
-   Do not introduce extra details.

------------------------------------------------------------------------

# 6. Typography

## Recommended Font Direction

Use a modern geometric sans-serif.

Preferred characteristics:

-   Clean
-   Rounded
-   High readability
-   Strong numerals
-   Modern but not overly futuristic

### Heading

Use a bold / semibold weight.

Example:

``` text
Discover the river around you.
```

### Body

Use regular / medium weight.

Example:

``` text
Explore places, follow waterways and build a deeper connection
with the landscapes around you.
```

### UI Labels

Use medium or semibold weight with generous letter spacing.

------------------------------------------------------------------------

# 7. UI Design Language

## Surfaces

Use:

-   Warm off-white backgrounds
-   White cards where needed
-   Soft borders
-   Large rounded corners
-   Generous whitespace

Avoid:

-   Heavy borders
-   Excessive shadows
-   Glassmorphism everywhere
-   Overly dark interfaces
-   Excessive gradients

## Border Radius

Suggested scale:

``` text
xs: 8px
sm: 12px
md: 16px
lg: 24px
xl: 32px
pill: 999px
```

Large hero cards can use `24–32px`.

------------------------------------------------------------------------

# 8. Buttons

## Primary

``` text
Background: #0052FF
Text: #FFFFFF
Radius: 14–16px
```

## Secondary

``` text
Background: transparent
Border: #0052FF
Text: #0052FF
```

## Accent

Use gold only for contextual actions such as:

-   Rewards
-   Achievements
-   Milestones

``` text
Background: #FFC629
Text: #0E1B38
```

------------------------------------------------------------------------

# 9. Gradients

Gradients should be used selectively.

### River Gradient

``` css
background: linear-gradient(
  135deg,
  #0052FF 0%,
  #1E7BFF 100%
);
```

### Brand Accent Gradient

``` css
background: linear-gradient(
  135deg,
  #7A003C 0%,
  #C1124A 100%
);
```

Do not apply gradients to every component.

The logo itself should primarily use **solid, crisp color fields**.

------------------------------------------------------------------------

# 10. Iconography

Icons should feel:

-   Custom
-   Rounded
-   Geographic
-   Organic
-   Simple

Avoid making the product feel like a generic SaaS dashboard through
excessive use of standard utility icons.

Use custom iconography for major concepts such as:

-   Rivers
-   Trails
-   Places
-   Communities
-   Water
-   Nature
-   Exploration
-   Achievements

Lucide-style icons can be used for secondary utility actions, but the
primary product vocabulary should have a distinctive visual language.

------------------------------------------------------------------------

# 11. Maps & Geographic UI

Maps are a major part of the visual identity.

Recommended treatment:

-   Royal blue for waterways
-   Maroon for highlighted terrain / regions
-   Gold for points of interest or achievements
-   Warm off-white for surrounding UI
-   Midnight navy for labels when contrast is required

The river should visually remain the strongest geographic element.

------------------------------------------------------------------------

# 12. Dark Mode

### Background

`#0E1B38`

### Primary Blue

`#1E7BFF`

### Maroon

`#C1124A`

### Gold

`#FFC629`

### Primary Text

`#FFFFFF`

### Secondary Text

`#B8C0D0`

Dark mode should feel atmospheric rather than purely black.

------------------------------------------------------------------------

# 13. Accessibility

Maintain strong contrast between:

-   Text and backgrounds
-   Buttons and surrounding surfaces
-   Map markers and map backgrounds
-   Interactive states

Do not rely on color alone to communicate:

-   Errors
-   Success
-   Selection
-   Progress
-   Notifications

Pair color with icons, labels, patterns, or shape changes.

------------------------------------------------------------------------

# 14. Motion

Motion should reinforce the river metaphor.

Recommended motion language:

-   Smooth flowing transitions
-   Gentle horizontal movement
-   Soft easing
-   Subtle map movement
-   Progressive route drawing

Avoid:

-   Excessive bouncing
-   Constant animations
-   Distracting parallax
-   Long transition durations

Suggested timing:

``` text
Micro interaction: 120–180ms
Standard transition: 200–300ms
Large scene transition: 400–600ms
```

------------------------------------------------------------------------

# 15. Design Principles

### 01 --- River First

The river is the core visual metaphor.

### 02 --- Vibrant, Not Loud

Use strong colors, but preserve large areas of calm neutral space.

### 03 --- Nature + Technology

The interface should feel technologically sophisticated while remaining
connected to the physical world.

### 04 --- Recognizable Silhouette

The logo and major visual elements should be identifiable even without
text.

### 05 --- Minimal Detail

Prefer a few strong shapes over many decorative elements.

### 06 --- Human Exploration

The product should feel inviting and exploratory rather than corporate
or administrative.

------------------------------------------------------------------------

# 16. Core Design Tokens

``` css
:root {
  --rk-river-blue: #0052FF;
  --rk-azure-blue: #1E7BFF;

  --rk-deep-maroon: #7A003C;
  --rk-crimson: #C1124A;

  --rk-sun-gold: #FFC629;

  --rk-surface: #F7F5F0;
  --rk-slate: #6B7280;
  --rk-midnight: #0E1B38;

  --rk-white: #FFFFFF;

  --rk-radius-sm: 12px;
  --rk-radius-md: 16px;
  --rk-radius-lg: 24px;
  --rk-radius-xl: 32px;
  --rk-radius-pill: 999px;
}
```

------------------------------------------------------------------------

# 17. Brand Do / Don't

## Do

-   Use Royal Blue as the strongest functional color.
-   Pair blue with maroon for distinctive brand contrast.
-   Use gold as a high-value accent.
-   Preserve whitespace.
-   Keep the logo crisp and recognizable.
-   Use warm neutral surfaces.
-   Build a consistent geographic visual language.

## Don't

-   Don't use green as the primary brand color.
-   Don't make black the dominant background.
-   Don't overuse gradients.
-   Don't add unnecessary visual effects.
-   Don't overload screens with icons.
-   Don't use the full logo with text at tiny sizes.
-   Don't turn every component into a colorful card.

------------------------------------------------------------------------

# 18. Brand Keywords

``` text
RIVER
FLOW
EXPLORATION
COMMUNITY
NATURE
MOVEMENT
DISCOVERY
CONNECTION
ENERGY
BELONGING
```

**RiverKin should look immediately recognizable through its royal-blue
river, maroon landscape, and warm gold accent --- even before the name
is visible.**

# 19. Product Psychology Layer

RiverKin should not only look beautiful; it should make the user's next
action feel obvious, rewarding, and meaningful.

The psychology layer is designed around **agency, understanding,
achievement, safety, and joy**. The interaction principles in this
system also follow the uploaded Apple Design guidance: immediate
feedback, direct manipulation, spatial consistency, interruptible
motion, simplicity, craft, and delight. fileciteturn1file0L24-L26
fileciteturn1file0L247-L258

## 19.1 The Core Emotional Loop

Every important RiverKin interaction should follow:

``` text
NOTICE → UNDERSTAND → ACT → FEEL PROGRESS → DISCOVER → RETURN
```

### NOTICE

Create a strong visual hierarchy so the user immediately understands
what matters.

Use:

-   One dominant visual focus per screen.
-   Royal blue for primary action.
-   Gold for meaningful opportunities.
-   Maroon for identity and environmental context.
-   Motion only where it explains change.

The interface should answer **"What can I do here?"** within seconds.

### UNDERSTAND

Reduce cognitive load before asking for action.

Use:

-   Familiar metaphors.
-   Specific labels.
-   Progressive disclosure.
-   Short explanations.
-   Visual grouping.
-   Consistent placement.

The Apple guidance explicitly emphasizes familiarity, mapping,
wayfinding, and putting the common path first.
fileciteturn1file0L251-L265

### ACT

Make the first action extremely easy.

Primary actions should:

-   Be visually dominant.
-   Require minimal decisions.
-   Respond immediately on press.
-   Provide continuous feedback during gestures.

Feedback should begin on pointer-down rather than waiting for release.
fileciteturn1file0L28-L34

### FEEL PROGRESS

People should be able to see that their actions matter.

Use:

-   Route completion.
-   River segments explored.
-   Places discovered.
-   Personal milestones.
-   Collection progress.
-   Community contributions.
-   Seasonal journeys.

Avoid meaningless points. Every progress indicator should represent
something the user actually values.

### DISCOVER

Use curiosity to create exploration rather than forcing engagement.

Examples:

``` text
"There's another stretch of this river nearby."
"3 places remain on this route."
"Something interesting was recorded upstream."
```

Reveal information progressively rather than presenting the entire
system at once.

### RETURN

The reason to return should be **unfinished meaningful exploration**,
not artificial pressure.

Good return triggers:

-   A saved route becoming relevant.
-   A new place appearing.
-   A completed community contribution.
-   A personal milestone.
-   A meaningful environmental update.

Avoid:

-   Fake urgency.
-   Manipulative notifications.
-   Artificial scarcity.
-   Fear-based retention.
-   Endless reward loops with no user value.

------------------------------------------------------------------------

# 20. Behavioral Psychology Principles

## 20.1 Goal-Gradient Effect

People tend to increase effort as they perceive themselves getting
closer to a goal.

### RiverKin implementation

Instead of:

``` text
Progress: 42%
```

Prefer:

``` text
42% of this river explored
```

And show the remaining path visually.

The progress should become increasingly tangible as the user approaches
completion.

### UI pattern

``` text
START ━━━━━━━●━━━━ FINISH
              ↑
          You're here
```

The user should always understand:

1.  Where they started.
2.  Where they are.
3.  What remains.
4.  What happens when they finish.

------------------------------------------------------------------------

## 20.2 Endowed Progress

Give users a meaningful sense of identity or context immediately rather
than making the experience feel empty.

Example:

``` text
Your River Journey
0 places explored
```

The user starts with a **journey**, not an empty dashboard.

Do not fabricate progress. The starting state must be truthful.

------------------------------------------------------------------------

## 20.3 Zeigarnik Effect --- Open Loops

People naturally remember incomplete tasks.

Use incomplete exploration carefully:

``` text
"2 more locations complete this route."
"One section remains."
```

The open loop should represent a genuinely useful unfinished task.

Never manufacture dozens of tiny tasks simply to increase session time.

------------------------------------------------------------------------

## 20.4 Curiosity Gap

Show enough information to create curiosity without hiding essential
context.

Bad:

``` text
Something happened nearby...
```

Better:

``` text
A new ecological observation was recorded 1.2 km upstream.
```

Then let the user choose whether to explore it.

**Curiosity should invite exploration, not manipulate clicks.**

------------------------------------------------------------------------

## 20.5 Variable Discovery

RiverKin can feel alive because discovery is not completely predictable.

Possible discovery categories:

-   New places
-   River stories
-   Local history
-   Community observations
-   Wildlife
-   Water-quality information
-   Seasonal changes

The **content** can vary.

The **interaction rules must remain predictable**.

This distinction is critical:

``` text
Unpredictable CONTENT
+
Predictable INTERACTION
=
Healthy Discovery
```

------------------------------------------------------------------------

# 21. Self-Determination Theory

Design the experience around three psychological needs:

## Autonomy

The user chooses what to explore.

Give users:

-   Multiple routes.
-   Optional challenges.
-   Skip controls.
-   Personalized interests.
-   Flexible exploration.

Never force a single engagement path when several reasonable paths
exist.

## Competence

Help users feel increasingly capable.

Use:

-   Clear progress.
-   Small achievable milestones.
-   Helpful explanations.
-   Increasingly sophisticated discoveries.

Avoid making the user feel stupid for not knowing something.

## Relatedness

Create connection with:

-   Local communities.
-   Shared discoveries.
-   Friends.
-   Contributors.
-   Place-based stories.

Community should feel human rather than like a leaderboard optimized for
competition.

------------------------------------------------------------------------

# 22. Identity-Based Design

The strongest long-term behavior often comes from identity rather than
rewards.

Instead of:

``` text
+100 XP
```

Prefer:

``` text
River Explorer
5 waterways discovered
```

The user should gradually build a meaningful personal identity around
exploration.

Potential identity states:

``` text
Observer
Explorer
Pathfinder
River Keeper
Local Guide
Community Steward
```

These should be earned through meaningful behavior, not arbitrary point
accumulation.

------------------------------------------------------------------------

# 23. Peak-End Rule

People remember experiences disproportionately through meaningful peaks
and endings.

Design every journey with:

### A strong beginning

``` text
"Let's find your first river."
```

### A meaningful middle

Discovery, movement, interaction, contribution.

### A memorable ending

``` text
Journey complete.
You explored 8.4 km of the river.
```

Completion should feel calm and satisfying rather than overloaded with
confetti.

The final screen should answer:

``` text
What did I accomplish?
Why did it matter?
What can I explore next?
```

------------------------------------------------------------------------

# 24. Progressive Disclosure

Do not expose the entire product model immediately.

### Layer 1 --- Immediate

``` text
Explore
```

### Layer 2 --- Context

``` text
River → Route → Place
```

### Layer 3 --- Depth

``` text
Ecology
History
Community
Data
```

### Layer 4 --- Advanced

``` text
Detailed measurements
Analytics
Filters
Technical information
```

This keeps the first experience simple while preserving depth for expert
users.

------------------------------------------------------------------------

# 25. Cognitive Load Rules

### One primary decision per screen

Avoid presenting:

``` text
Explore
Map
Routes
Community
Challenges
Analytics
Collections
Profile
Settings
...
```

as equal visual choices.

Instead establish hierarchy:

``` text
WHAT MATTERS NOW
        ↓
PRIMARY ACTION
        ↓
SECONDARY OPTIONS
        ↓
ADVANCED CONTROLS
```

### Recognition over recall

Show:

-   Recent places.
-   Saved routes.
-   Current position.
-   Familiar icons.
-   Contextual recommendations.

Do not make users remember IDs, coordinates, or previous navigation
paths.

------------------------------------------------------------------------

# 26. Hick's Law --- Reduce Choice Paralysis

As the number of choices increases, decision time increases.

Therefore:

### Bad

``` text
Choose one of 14 actions.
```

### Better

``` text
Continue your journey
Explore nearby
View map
```

Advanced options can remain one level deeper.

------------------------------------------------------------------------

# 27. Fitts's Law --- Make Important Actions Easy to Hit

High-frequency actions should have:

-   Large touch targets.
-   Strong visual contrast.
-   Comfortable spacing.
-   Predictable positions.

Interactive controls should not depend on tiny precision taps.

The Apple interaction guidance similarly recommends hit padding and
direct pointer feedback for gestures. fileciteturn1file0L164-L169

------------------------------------------------------------------------

# 28. Von Restorff Effect --- Strategic Visual Contrast

The visually distinctive element receives more attention.

Use this deliberately:

``` text
Neutral UI
      ↓
BLUE PRIMARY ACTION
      ↓
GOLD IMPORTANT MOMENT
```

Do not make every component visually distinctive.

If everything is loud, nothing is important.

------------------------------------------------------------------------

# 29. Social Proof Without Vanity Metrics

Community signals should demonstrate usefulness rather than popularity
alone.

Prefer:

``` text
24 people explored this route this week
```

over:

``` text
24 likes
```

Prefer:

``` text
8 local observations contributed
```

over:

``` text
Trending #1
```

Social proof should answer:

**"Why is this useful to me?"**

------------------------------------------------------------------------

# 30. Commitment & Consistency

Let users make lightweight commitments:

``` text
Save this route
Follow this river
Continue this journey
```

Then make those commitments easy to resume.

Do not use guilt-based messaging such as:

``` text
You haven't visited in 5 days.
```

Instead:

``` text
Your saved river journey is waiting.
```

------------------------------------------------------------------------

# 31. Loss Aversion --- Use Carefully

Loss aversion can be powerful but should never become anxiety-driven
retention.

Acceptable:

``` text
Your saved route will remain here.
```

Not acceptable:

``` text
Come back today or you'll lose your progress!
```

The product should create **desire to return**, not fear of leaving.

------------------------------------------------------------------------

# 32. Feedback Psychology

Every meaningful interaction should communicate one of four states:

``` text
STATUS
COMPLETION
WARNING
ERROR
```

The uploaded Apple guidance specifically recommends these four feedback
categories and inline validation rather than waiting until submission.
fileciteturn1file0L260-L265

### Example

When saving a route:

``` text
Tap
 ↓
Immediate button response
 ↓
Save animation
 ↓
"Route saved"
 ↓
Return to exploration
```

The user should never wonder:

**"Did that work?"**

------------------------------------------------------------------------

# 33. Motion Psychology

Motion is not decoration. It communicates causality, spatial
relationships, and continuity.

For RiverKin:

### River-like motion

Use smooth flowing movement for:

-   Map transitions
-   Route drawing
-   Bottom sheets
-   Card expansion
-   Place transitions

### Physical continuity

If the user drags something, it should track the finger 1:1.
fileciteturn1file0L44-L50

### Interruptibility

Users should be able to interrupt transitions immediately. Animations
should continue from the element's current visual state rather than
jumping to a predetermined state. fileciteturn1file0L61-L70

### Spring behavior

Use critically damped motion by default and reserve bounce for
interactions that actually carry momentum. fileciteturn1file0L73-L86

------------------------------------------------------------------------

# 34. Attention Architecture

Every screen should have a deliberate attention hierarchy:

``` text
LEVEL 1
The one thing I should notice.

LEVEL 2
The things that help me understand it.

LEVEL 3
The actions I can take.

LEVEL 4
Supporting information.

LEVEL 5
Advanced controls.
```

Use:

-   Size
-   Position
-   Contrast
-   Whitespace
-   Motion
-   Color

to establish this hierarchy.

Never use animation simply to steal attention.

------------------------------------------------------------------------

# 35. The RiverKin Habit Loop

A healthy recurring product loop:

``` text
TRIGGER
   ↓
Curious observation / useful update
   ↓
ACTION
   ↓
Explore a place or route
   ↓
REWARD
   ↓
Discovery + progress + meaning
   ↓
IDENTITY
   ↓
"I am someone who explores and understands my surroundings."
```

The loop should reinforce **intrinsic motivation** rather than
addiction.

------------------------------------------------------------------------

# 36. Notification Psychology

Notifications must provide genuine value.

### Good

``` text
A new place was added to your saved route.
```

``` text
Your river journey is complete.
```

``` text
A community observation near your saved area is available.
```

### Bad

``` text
We miss you!
```

``` text
You haven't opened RiverKin today.
```

``` text
Don't break your streak!
```

### Rule

**Notify because something changed, not because you want another
session.**

------------------------------------------------------------------------

# 37. Ethical Engagement Rules

RiverKin should optimize for:

``` text
VALUE
not
TIME SPENT
```

Success metrics should therefore include:

-   Meaningful discoveries
-   Completed journeys
-   Saved places
-   Useful contributions
-   Successful navigation
-   Return through genuine interest
-   User-reported satisfaction

Avoid optimizing solely for:

-   Session length
-   Notification opens
-   Infinite scrolling
-   Daily streak pressure
-   Repeated reward collection

------------------------------------------------------------------------

# 38. Psychology-to-UI Mapping

  Psychology                 RiverKin UI
  -------------------------- ----------------------------------------
  Goal gradient              Route / river completion
  Curiosity                  Progressive discovery
  Identity                   Explorer / Keeper profiles
  Competence                 Clear milestones
  Autonomy                   Multiple exploration paths
  Relatedness                Community discoveries
  Recognition                Saved places / recent activity
  Peak-end                   Strong journey completion
  Cognitive load reduction   Progressive disclosure
  Hick's Law                 Fewer primary choices
  Fitts's Law                Large primary controls
  Von Restorff               Strategic blue/gold contrast
  Zeigarnik effect           Meaningful unfinished journeys
  Social proof               Useful community activity
  Direct manipulation        1:1 map gestures
  Spatial consistency        Source-anchored sheets and transitions

------------------------------------------------------------------------

# 39. The RiverKin Design Test

Before shipping a screen, ask:

### Psychology

-   What should the user notice first?
-   What emotion should they feel?
-   What decision are we asking them to make?
-   Is the decision actually necessary?
-   Does the interaction increase agency or reduce it?
-   Is the reward meaningful?
-   Are we creating curiosity or manipulation?

### UX

-   Can the user understand the screen without instructions?
-   Is the primary action obvious?
-   Can they recover from mistakes?
-   Does every interaction provide immediate feedback?
-   Does motion explain what changed?

### Visual

-   Is there enough whitespace?
-   Is blue doing the important work?
-   Is gold being used selectively?
-   Is maroon establishing identity rather than visual noise?
-   Is anything decorative competing with the content?

### Ethical

-   Would we still use this pattern if the user knew exactly why it was
    designed?
-   Are we helping the user accomplish something or merely keeping them
    engaged?
-   Can the user leave easily?
-   Can the user disable notifications?
-   Does the product respect reduced motion and accessibility
    preferences?

------------------------------------------------------------------------

# 40. Final Design Philosophy

**RiverKin should feel like a place, not an app.**

The visual system creates recognition.

The interaction system creates physicality.

The psychology creates meaning.

The product loop creates return.

The combination should produce:

``` text
BEAUTY
   +
CLARITY
   +
DISCOVERY
   +
AGENCY
   +
PROGRESS
   +
MEANING
   =
RIVERKIN
```

The goal is not to make people spend more time inside RiverKin.

The goal is to make the time they spend there **worth coming back for**.
