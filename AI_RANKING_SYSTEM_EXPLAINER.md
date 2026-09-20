# How the AI Ranking System Works

## The short version

Statera does not let AI decide the ranking by itself. It combines:

- fixed rules, such as the issue category;
- information supplied by the worker;
- how long the issue has been open or inactive;
- AI analysis of the report's wording;
- other open reports that appear to describe the same incident; and
- relevant feedback previously provided by supervisors at the same site.

The result is a score that places the issue into one of four priority levels:

- **Low:** below 40
- **Medium:** 40–79
- **High:** 80–149
- **Critical:** 150 or more

## Does the AI summary use past reports?

The wording summary mainly explains the **current report**. For example, it may say that the wording suggests an immediate safety risk because it mentions a fire, injury, collapse, or electrical danger.

The AI does receive some limited context from the same site when a new report is submitted:

1. Up to 40 reports that are currently open.
2. Up to 20 recent supervisor feedback notes that include a written reason.

These are used for two specific purposes.

### Finding reports about the same incident

The AI compares the new report with open reports to identify different descriptions of the same real-world issue.

For example:

- “Pump 3 is leaking hydraulic oil.”
- “There is oil on the floor beside the number 3 pump.”

The wording is different, but the AI may recognise that both reports describe the same hazard. Reports are not matched merely because they share a category; the AI is instructed to match them only when they are very likely to refer to the same incident.

Closed reports are not included in this comparison. The current system is therefore not searching the full historical record for similar incidents from previous months or years.

### Applying previous supervisor guidance

Supervisors can say whether a ranking was correct and provide a reason. When a future report is submitted at that site, the AI can use relevant feedback to adjust its score.

For example, if supervisors have repeatedly explained that a particular type of report was being ranked too low, the AI may raise the score of a clearly similar new report.

This adjustment is limited to between **−20 and +20 points**. The AI is instructed to:

- apply feedback only when it is clearly relevant;
- prefer repeated, consistent guidance over one unclear comment;
- use no adjustment when there is no meaningful connection; and
- never lower an immediate-harm report merely because a piece of equipment was mentioned in earlier feedback.

Therefore, past information can influence a new ranking, but only through this restricted feedback mechanism. The AI is not given unrestricted access to every previous issue.

## What are “system signals”?

“System signals” means the pieces of information used to calculate the ranking. It does not simply mean “past data.”

The score is calculated as:

> **(category + age + dormancy + wording + supervisor feedback) × worker urgency × similar-report multiplier**

### 1. Category

Every report category has a fixed starting value. Examples include:

- Dangerous Occurrence: 50 points
- Unsafe Condition: 40 points
- Near-Miss Report: 35 points
- Fatigue / Wellness Concern: 30 points
- Equipment Issue: 25 points
- Procedure Clarification: 8 points

These are rules configured in the application. The AI does not learn or change these values.

### 2. Age

An open issue gains **2 points per day**, up to a maximum of 40 points.

This helps prevent unresolved issues from remaining at the bottom of the list indefinitely. Once an issue is closed, it stops ageing.

### 3. Dormancy

Dormancy means the amount of time since the issue was last updated:

- more than 3 days: +5 points
- more than 7 days: +15 points
- more than 14 days: +30 points

An ordinary ticket update resets the dormancy clock. Ranking feedback is deliberately not treated as ticket activity, so submitting feedback does not make a neglected issue appear active.

### 4. Wording

The AI examines the meaning and severity of the report description and awards between 0 and 20 points.

Examples:

- immediate harm, injury, fire, collapse, electrical shock, or emergency: up to 20;
- broken equipment, leaks, blockages, or serious risk language: around 10;
- a general safety concern without immediate danger: around 5;
- routine or unclear wording: 0.

The AI considers meaning, paraphrasing, slang, and negation. For example, “there is no fire” should not be treated as an urgent fire report.

If the AI service is unavailable, the application uses a simpler keyword-based fallback.

### 5. Supervisor feedback

Relevant feedback from earlier rankings at the same site can adjust the base score by −20 to +20 points.

This is the part of the system that can become more aligned with how a particular site expects reports to be ranked.

### 6. Worker urgency

The worker's own urgency selection multiplies the base score:

- Low: ×1
- Medium: ×2
- High: ×3

The worker's judgement therefore has a large effect, but it is not the only factor.

### 7. Similar open reports

If several open reports appear to describe the same incident, the score receives an additional multiplier.

For higher-risk categories:

- 2–3 related reports: ×1.5
- 4 or more: ×2

For lower-risk categories, the increase is smaller:

- 2–3 related reports: ×1.1
- 4 or more: ×1.2

This lets repeated reporting raise the visibility of a shared hazard without assuming that every report in the same category is a duplicate.

## What does “behaviour over time” mean?

In the current system, it mainly refers to how an **issue's ranking changes over time**, not to the AI continuously studying the mine.

Two factors change while an issue remains open:

1. **Age** increases as the issue remains unresolved.
2. **Dormancy** increases when nobody updates the issue.

This means an issue can move from Medium to High even though its original description has not changed. The system is recognising that an unresolved or neglected issue deserves more attention.

The score is recalculated whenever the relevant supervisor pages are viewed. The AI does not need to run again for age and dormancy to change.

## Does the AI adapt to a specific mine over time?

Only in a limited sense.

It does **not** train a separate AI model for each mine, and it does not quietly rewrite its own rules. Category values, thresholds, age points, dormancy points, and multipliers remain fixed in the application.

It can become more site-specific through supervisor feedback:

1. The system produces a ranking.
2. A supervisor marks it as correct or incorrect and can explain why.
3. That explanation is saved for the site.
4. When a later report is submitted, the AI receives recent feedback.
5. If the feedback is clearly relevant, the AI can adjust the new score.

This is better described as **giving the AI relevant examples and guidance** than as training it. The underlying AI model itself is not being retrained.

Feedback affects future submissions; it does not automatically go back and recalculate the report on which the feedback was given.

## When does each part update?

- **At submission:** The AI analyses the wording, creates the summary, checks for matching open reports, and considers recent supervisor feedback.
- **On later page views:** Age, dormancy, and the resulting total score are recalculated.
- **When another related report is submitted:** The similar-report group and multiplier can grow.
- **When a supervisor gives feedback:** The feedback becomes guidance for future reports at that site.
- **When the issue closes:** Age and dormancy stop increasing.

The wording summary and wording points are normally stored from the original submission. They are not regenerated every day.

## A simple example

Suppose a worker submits an Equipment Issue:

- Category: 25 points
- Open for 5 days: 10 points
- No update for only 2 days: 0 dormancy points
- Wording describes a broken, leaking pump: 10 points
- No relevant supervisor feedback: 0 points

The base score is:

> 25 + 10 + 0 + 10 + 0 = 45

If the worker selected Medium urgency:

> 45 × 2 = 90

A score of 90 gives the issue a **High** ranking.

If more workers later report the same pump leak, the similar-report multiplier may increase the score further.

## What the AI currently does not do

The current system does not:

- search all closed reports for long-term incident patterns;
- predict future incidents based on a mine's complete history;
- train a custom model for each mine;
- independently change the fixed scoring rules;
- use reports from another site when applying supervisor guidance; or
- make the final score entirely by itself.

## Overall

The ranking is a hybrid system. Fixed rules provide predictable behaviour, while AI handles tasks that benefit from language understanding and pattern recognition.

The AI is particularly useful for:

- understanding how serious the report's wording is;
- recognising the same incident described in different words; and
- applying relevant supervisor guidance to future reports.

Age and dormancy then keep the ranking responsive after submission, ensuring that unresolved or neglected issues rise in priority over time.
