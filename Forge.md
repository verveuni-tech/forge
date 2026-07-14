Most gym apps are **logging apps**.

I think we should build a **training coach**.

The app shouldn't just remember what you lifted. It should actively tell you **what to do today** based on your previous performance.

---

# **Product Vision**

**Forge: The easiest workout tracker that thinks like an experienced gym partner.**

Every time you open the app, it already knows:

* Today's workout  
* Previous workout  
* Recommended weight  
* Recommended reps  
* Whether you're progressing  
* Whether you should deload  
* Which exercises are plateauing

No calculations by the user.

---

# **Core Principles**

## **1\. Zero Friction Logging**

The user should almost never type.

Example:

Bench Press

Recommended

72.5kg

Target

6–8 reps

────────────

Set 1

72.5     8

Save

\+ Set

Weight already filled.

Reps already focused.

One tap.

---

## **2\. Recommendations First**

Instead of

Previous

70 × 8

Show

Today's Recommendation

72.5kg

Target

6–8 reps

Reason

Completed all sets at target reps last session.

Every recommendation should explain *why*.

---

# **Progressive Overload Engine**

This will become the heart of the app.

For every exercise we'll store:

* Last weight  
* Last reps  
* Target rep range  
* Training volume  
* Best set  
* Estimated 1RM  
* Plateau history  
* Deload history

Then calculate

Increase weight

Maintain weight

Decrease weight

Increase reps

Deload

instead of making the user guess.

---

# **Example Logic**

### **Bench**

Previous

70kg

8

8

8

Result

Recommendation

72.5kg

Reason

Reached upper rep target  
for every set.

---

### **Squats**

Previous

65kg

5

5

4

Recommendation

Stay

65kg

Reason

Target not yet achieved.

---

### **Shoulder Press**

Previous

22.5

6

5

5

Last 3 sessions

22.5

6

5

5

22.5

6

5

5

22.5

6

5

5

Recommendation

Plateau detected.

Keep weight

Reduce volume

or

Take a deload.

---

# **Weekly Coach**

Instead of only showing graphs

Every week

Weekly Report

You completed

5 workouts

Bench improved

\+5kg

Squat improved

\+10kg

Back volume

↑18%

Shoulders

No progress  
for 3 weeks.

Suggestion

Increase recovery  
or reduce volume.

---

# **Recovery System**

Every exercise tracks

Last trained

Days ago

Recovery score

Suggested readiness

Example

Chest

2 days ago

Recovered

✓ Ready

---

# **Muscle Volume**

Very few apps calculate this well.

Example

Chest

14 sets

Target

12–18

✓

Rear Delts

4 sets

Target

10

⚠ Increase volume

Now the user isn't just progressing in weight, but also balancing overall training.

---

# **Personal Records**

Separate section

Bench

80kg

Deadlift

160kg

Squat

110kg

Pullups

12 reps

Dip

\+30kg

Automatically detected.

---

# **Dashboard**

Instead of

Hello Mohit

I'd rather show

Today's Workout

Push

6 exercises

Estimated

65 min

Below

Next Exercise

Bench

72.5kg

6–8 reps

Then

Weekly Progress

█████████

82%

# **Development Plan**

I would break the project into milestones:

### **Phase 1 — Foundation**

* Vite \+ React \+ TypeScript  
* Tailwind \+ shadcn/ui  
* Neon PostgreSQL \+ Drizzle ORM  
* PWA setup  
* Responsive mobile-first layout  
* Exercise library  
* Workout split templates

### **Phase 2 — Workout Logging**

* Start workout  
* Log sets with minimal taps  
* Auto-fill previous weights  
* Rest timer  
* Workout history

### **Phase 3 — Progressive Overload Engine**

* Rep range rules  
* Automatic weight recommendations  
* Plateau detection  
* Deload suggestions  
* Estimated 1RM  
* Personal records

### **Phase 4 — Analytics**

* Strength progress charts  
* Weekly volume by muscle group  
* Exercise progression  
* Session summaries  
* Weekly coaching report

### **Phase 5 — Advanced Features**

* Recovery tracking  
* Body weight tracking  
* Progress photos  
* Exercise notes  
* Cloud sync  
* AI coaching layer

By keeping the recommendation engine as a separate module from the UI and database, we can continually improve the coaching logic without rewriting the rest of the application. That separation will make the app much easier to maintain and expand over time.

# **Tech stack:** 

| Layer | Technology | Why |
| ----- | :---: | :---: |
| Frontend | React \+ Vite \+ TypeScript | Fast development, great DX |
| UI | Tailwind \+ shadcn/ui | Clean, consistent components |
| Icons | Lucide React | Lightweight and modern |
| Routing | React Router | Simple and reliable |
| Forms | React Hook Form \+ Zod | Fast, type-safe forms |
| Database | Neon PostgreSQL | Free tier, standard PostgreSQL, future-proof |
| ORM | Drizzle ORM | Excellent TypeScript support |
| Auth | None initially | Personal app, unnecessary complexity |
| Charts | Recharts | Workout progress visualization |
| State | Zustand | Lightweight |
| Date | date-fns | Workout history and analytics |
| Deployment | Vercel | Easy deployment and PWA support |

# 

# **Design Language – Forge**

**Design Principle:** *The interface should feel engineered, not decorated.*

Every component exists because it helps the user make a faster, smarter training decision. Motion, shape, spacing, and color all communicate hierarchy and state.

---

# **1\. Core Philosophy**

The application is **not a fitness app**.

It is a **training instrument**.

The experience should feel closer to using a Garmin watch, Apple Health, or a professional dashboard than a bodybuilding app.

### **Keywords**

* Precise  
* Calm  
* Premium  
* Intelligent  
* Lightweight  
* Fluid  
* Purposeful  
* Data-driven

Avoid:

* Gaming aesthetics  
* Neon gradients  
* Aggressive reds  
* Heavy shadows  
* Generic SaaS cards

---

# **2\. Visual Identity**

## **Theme**

Light-first.

Bright.

Airy.

Minimal.

Lots of whitespace.

Cards should appear as floating physical objects rather than boxes.

---

## **Design Inspiration**

* Apple Health  
* Apple Wallet animations  
* Liquid Glass  
* VisionOS  
* Linear  
* Arc Browser  
* Nothing OS  
* Dieter Rams ("Less, but better.")

---

# **3\. Color System**

## **Background**

Canvas

\#F7F9FC

---

Surface

\#FFFFFF

---

Elevated Surface

rgba(255,255,255,0.75)

Backdrop Blur

---

## **Primary**

Blue

\#2563EB

Used only for

* Active states  
* Primary CTA  
* Selection  
* Focus

---

## **Success**

\#22C55E

Used for

* Personal Records  
* Progress  
* Completed workout  
* Positive recommendations

---

## **Warning**

\#F59E0B

Used for

* Plateau  
* Missed targets  
* Recovery

---

## **Error**

\#EF4444

Used sparingly.

---

## **Neutral**

\#64748B

Supporting text.

---

# **4\. Typography**

## **Font**

**Inter**

Reasons

* Extremely readable  
* Excellent number rendering  
* Modern  
* Clean

---

### **Hierarchy**

Display

40

Dashboard numbers

---

H1

30

---

H2

24

---

H3

20

Exercise names

---

Body

16

---

Caption

13

---

Label

12

---

# **5\. Geometry System**

**Most apps use one card style.**

Tempo uses multiple geometries.

Every object has an identity.

---

## **Workout Cards**

Purpose

Interactive.

Organic.

One clipped corner.

Feels directional.

╭──────────────╮

│ Bench Press  │

│              │

│          ╲   │

╰───────────╲──╯

---

## **Recommendation Card**

Soft capsule.

Floating.

Centered.

Feels like advice.

---

## **Statistics Cards**

Hexagonal influence.

Slightly angular.

Feels engineered.

---

## **Progress Cards**

Wide.

Low height.

Graph-first.

---

## **Floating Elements**

Completely pill-shaped.

Inspired by VisionOS.

---

## **Coach Messages**

Speech bubble.

Soft.

Glass.

---

# **6\. Shape Rules**

No component should exist only as

Rounded Rectangle

Every important UI element gets its own silhouette.

The silhouette becomes part of the brand.

Users should recognize components even without colors.

---

# **7\. Liquid Glass Philosophy**

Glass is **functional**.

Never decorative.

Allowed only on:

* Bottom navigation  
* Floating buttons  
* Dialogs  
* Recommendation cards  
* Expanded exercise card

Never use glass for:

* Lists  
* Tables  
* Inputs  
* Charts

---

# **8\. Motion Language**

Every animation communicates hierarchy.

Nothing should bounce randomly.

---

## **Durations**

Fast

150ms

---

Medium

250ms

---

Complex

400ms

---

## **Curves**

Spring.

Natural.

Never linear.

---

# **Motion Rules**

Cards

Expand.

Never fade in.

---

Dialogs

Rise from bottom.

---

Recommendations

Slide horizontally.

---

Charts

Grow upward.

---

Numbers

Count upward.

---

Completed Set

Tiny scale

↓

Checkmark

↓

Collapse

---

# **9\. Layout Philosophy**

Everything aligns to an **8px grid**.

Spacing feels generous.

Breathing room is important.

---

Padding

Screen

20

---

Cards

16

---

Sections

32

---

Between Elements

12

---

# **10\. Component Language**

Rather than generic UI primitives, build a dedicated design system.

Instead of:

Card

Button

Dialog

Input

Create domain-specific components:

WorkoutCard

RecommendationPanel

CoachBubble

ExerciseTimeline

WorkoutDock

MetricBadge

ProgressModule

MuscleChip

WeightSelector

RepWheel

RestTimerBubble

WorkoutSummary

PRBadge

RecoveryIndicator

VolumeGraph

SessionHeader

Every component should solve a specific problem, not just display content.

---

# **11\. Interaction Philosophy**

Every interaction should reduce friction.

Examples:

Opening workout

Card expands.

Not page navigation.

---

Selecting exercise

Card morphs.

Not modal.

---

Saving set

Inline.

No popup.

---

Next exercise

Automatically opens.

No tapping Back.

---

Recommendation

Already visible.

Never hidden.

---

# **12\. Input Philosophy**

Avoid typing.

Everything should be selectable.

Examples

Weight

\[-\]

72.5

\[+\]

---

Reps

Wheel picker.

---

Exercise

Search \+ Categories.

---

Workout

Preloaded templates.

---

Muscle Groups

Chips.

---

Sets

Auto-generated.

---

# **13\. Data Visualization**

No rainbow charts.

Minimal.

One primary color.

Lots of whitespace.

Show trends.

Not decoration.

Examples

* Estimated 1RM  
* Volume  
* Weekly Progress  
* Muscle Balance  
* PR Timeline

---

# **14\. Workout Focus Mode**

Once a workout starts:

Hide

* Settings  
* Analytics  
* Navigation  
* Home

Only show:

* Current Exercise  
* Previous Performance  
* Recommendation  
* Sets  
* Rest Timer  
* Next Exercise

The app transforms into a lifting companion.

---

# **15\. Accessibility**

Minimum touch targets

48×48

High contrast.

Readable typography.

One-handed navigation.

Large numeric inputs.

Support dynamic text scaling.

---

# **16\. Brand Feel**

If the UI were described in one sentence:

**"A precision instrument for strength training that feels calm, intelligent, and effortless to use."**

---

# **17\. Non-Negotiable Rules**

1. No generic shadcn cards.  
2. Every major component has its own recognizable shape.  
3. Motion must communicate state, not decorate transitions.  
4. Glass is used sparingly and only where it enhances hierarchy.  
5. The recommendation engine is the visual focal point of every workout.  
6. Users should almost never type.  
7. Every screen should answer the question: **"What should I do next?"**  
8. White space is a feature, not empty space.  
9. The UI should feel premium in both light and dark modes, with light mode as the primary experience.  
10. If a design choice doesn't make logging workouts faster or recommendations clearer, it should be removed.

## **One additional recommendation**

Before writing any UI code, create a **Design Token System**. This becomes the single source of truth for the entire application.

// Colors

primary

success

warning

danger

surface

canvas

glass

// Radius

xs

sm

md

lg

pill

// Spacing

1

2

3

4

6

8

12

// Shadows

surface

floating

glass

// Motion

fast

normal

slow

spring

// Blur

glass

heavy

Every component should consume these tokens instead of hard-coded values. That way, if you later refine the visual identity, the entire application evolves consistently rather than becoming a collection of one-off styles.

Excellent. **Forge** is a much stronger name for the positioning we've discussed. It conveys building, refinement, and long-term progress rather than just tracking workouts.

Below are three documents you can paste directly into your project.

---

# **`Screens.md`**

## **Primary Navigation**

Home  
Workout  
Progress  
Records  
Settings

The navigation is intentionally minimal. Every screen should support the user's primary goal: completing today's workout and improving over time.

---

# **Screen 1 — Splash**

### **Purpose**

Initialize the app.

Check:

* Database  
* User  
* Workout Split  
* Last Active Workout

### **Actions**

* Continue workout (if one exists)  
* Go to Home

---

# **Screen 2 — Home**

The command center.

Displays:

* Today's Workout  
* Current Streak  
* Next Exercise  
* Weekly Progress  
* Recovery Status  
* Recent PR  
* Coach Recommendation

Primary CTA

Start Workout

---

# **Screen 3 — Workout Focus Mode**

This is the most important screen in the app.

Everything unrelated disappears.

Contains

* Exercise Timeline  
* Current Exercise  
* Recommendation Card  
* Previous Performance  
* Weight Selector  
* Rep Wheel  
* Logged Sets  
* Rest Timer  
* Next Exercise Button

Bottom navigation disappears.

---

# **Screen 4 — Exercise Detail**

Shows historical data for a single exercise.

Contains

* Progress Chart  
* Personal Record  
* Estimated 1RM  
* Weekly Volume  
* Previous Sessions  
* Progress Trend  
* Coach Insights

---

# **Screen 5 — Workout Summary**

Appears immediately after completing a workout.

Displays

* Workout Duration  
* Total Volume  
* Sets Completed  
* Exercises Completed  
* PRs Achieved  
* Recovery Estimate  
* Coach Summary

CTA

Finish

---

# **Screen 6 — Progress**

High-level analytics.

Contains

* Weekly Progress  
* Strength Progress  
* Muscle Volume  
* Recovery  
* Volume Trends  
* Consistency  
* Monthly Comparison

---

# **Screen 7 — Records**

Displays

* Current PRs  
* Historical PR Timeline  
* Estimated 1RM  
* Longest Streak  
* Biggest Progression

---

# **Screen 8 — History**

Calendar view.

Each workout opens its complete log.

Contains

* Date  
* Split  
* Duration  
* Exercises  
* Volume

---

# **Screen 9 — Workout Templates**

Contains

* Push Pull Legs  
* Upper Lower  
* Arnold  
* Bro Split  
* Full Body  
* Custom

---

# **Screen 10 — Exercise Library**

Searchable.

Filterable.

Grouped by

* Chest  
* Back  
* Legs  
* Shoulders  
* Arms  
* Core

---

# **Screen 11 — Coach**

Displays recommendations.

Examples

* Increase Bench  
* Deload Legs  
* Chest Plateau  
* Improve Pull Volume  
* Recovery Suggestions

---

# **Screen 12 — Settings**

Contains

* Units  
* Theme  
* Weight Increment  
* Rest Timer  
* Progression Method  
* Backup  
* Export

---

# **Screen 13 — Onboarding**

One-time setup.

Collect

* Name  
* Units  
* Workout Split  
* Experience Level  
* Goal

---

# **Screen 14 — Create Custom Workout**

Allows

* Add Exercises  
* Reorder  
* Sets  
* Rep Ranges  
* Rest Time

---

# **Screen 15 — Search Overlay**

Floating search.

Search

* Exercises  
* History  
* Records

Without leaving current screen.

---

---

# **`UserFlows.md`**

## **First Launch**

Splash

↓

Onboarding

↓

Select Workout Split

↓

Home

---

## **Daily Workout**

Home

↓

Start Workout

↓

Workout Focus Mode

↓

Complete Exercise

↓

Next Exercise

↓

Workout Summary

↓

Home

---

## **Resume Workout**

Splash

↓

Workout Detected

↓

Resume

↓

Workout Focus Mode

---

## **View Progress**

Home

↓

Progress

↓

Exercise Detail

---

## **View History**

Home

↓

History

↓

Workout Details

---

## **Change Split**

Settings

↓

Workout Templates

↓

Apply

↓

Home

---

## **Create Workout**

Workout Templates

↓

Custom Workout

↓

Save

↓

Home

---

## **View Coach Recommendation**

Home

↓

Coach Card

↓

Coach Screen

↓

Exercise Detail

---

## **View PR**

Home

↓

Records

↓

Exercise Detail

---

# **Navigation Rules**

During a workout

NO navigation

NO settings

NO analytics

NO history

Only

Workout

↓

Summary

↓

Home

---

---

# **`InteractionPrinciples.md`**

# **Forge Interaction Principles**

These principles govern every interaction within Forge.

---

## **Principle 1**

### **One Thumb First**

Every primary interaction should be comfortably reachable with one hand.

No important controls belong in the top-right corner.

---

## **Principle 2**

### **No Keyboard During Workouts**

Typing interrupts training.

Every workout interaction should use:

* Stepper  
* Wheel  
* Chips  
* Slider  
* Presets

Instead of text fields.

---

## **Principle 3**

### **Recommendations Are Always Visible**

The recommendation engine is Forge's defining feature.

It should never be hidden behind a modal or secondary screen.

Every exercise begins with:

What should I lift today?

---

## **Principle 4**

### **Motion Preserves Context**

Nothing should suddenly appear.

Cards expand.

Panels slide.

Elements morph.

Users should always understand where they came from.

---

## **Principle 5**

### **Remove Unnecessary Decisions**

Forge should remember:

* Previous weight  
* Previous reps  
* Rest timer  
* Workout order  
* Last exercise  
* Increment preference

The user confirms decisions rather than recreating them.

---

## **Principle 6**

### **Every Screen Has One Primary Action**

Examples

Home

→ Start Workout

Workout

→ Save Set

Summary

→ Finish Workout

Progress

→ Explore Details

Avoid multiple competing calls to action.

---

## **Principle 7**

### **Workout Mode Is Sacred**

When a workout starts,

Forge becomes a dedicated lifting companion.

Hide:

* Settings  
* History  
* Analytics  
* Records  
* Navigation

Surface only what helps complete the workout.

---

## **Principle 8**

### **Information Follows Importance**

Every exercise should present information in this order:

1. Recommendation  
2. Current Progress  
3. Previous Performance  
4. Logged Sets  
5. Historical Analytics

Never reverse this hierarchy.

---

## **Principle 9**

### **Data Should Explain Itself**

Instead of showing:

72.5 kg

Show:

Recommended: 72.5 kg

Instead of:

8%

Show:

Strength increased by 8% this month

Context is mandatory.

---

## **Principle 10**

### **Celebrate Progress Quietly**

Forge rewards consistency, not hype.

A new PR should feel satisfying through subtle motion and positive feedback, not loud animations or excessive effects.

---

## **Principle 11**

### **Every Interaction Reduces Friction**

Ask before adding any interaction:

Does this make logging faster?

If not, remove it.

---

## **Principle 12**

### **Build Trust Through Predictability**

The recommendation engine must behave consistently.

Given the same workout history, it should always produce the same recommendation and explain why. Users should feel they understand the system rather than guessing its logic.

---

## **Principle 13**

### **The App Thinks Ahead**

Forge anticipates the next action.

Examples:

* Pre-fill the next weight.  
* Auto-start the rest timer after saving a set.  
* Highlight the next exercise.  
* Suggest weight increases only when appropriate.  
* Resume unfinished workouts automatically.

The interface should feel like a training partner that stays one step ahead, reducing friction without taking control away from the user.

