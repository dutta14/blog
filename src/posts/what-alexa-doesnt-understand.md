---
title: What Alexa doesn't understand
date: November 3, 2018
excerpt: In late 2018, the most common failure mode in Alexa on Android was what the team called a false wake.
tags: ai-products
---

In late 2018, the most common failure mode in Alexa on Android was what the team called a false wake, a moment when the device thought it heard "Alexa" but hadn't. The user was not speaking to the device. They were watching television or talking to someone in the room or eating lunch. The device would interrupt. It would play the chime. It would wait. The user would look at the phone with an expression that ranged from mild annoyance to genuine alarm, and then the session would time out and the device would go quiet and nothing would have happened except that the user's trust had been reduced by some small measurable amount.

We tracked false wake rates carefully. There were weekly reviews where we looked at sample audio, played through headphones at a conference table, and tried to identify what pattern had triggered the detection. The system was making intuitive mistakes, hearing "extra" as "Alexa," hearing certain cadences in Hindi that resembled the English trigger word, hearing television dialogue that the model had not been trained to exclude. These were not bugs in the conventional sense. The model was doing what it had learned to do. What it had learned to do was not quite right for the distribution of sounds in the world.

What I learned in those months was something about the gap between benchmark performance and real-world behavior that is hard to feel from outside the building. The metrics in a paper are true. They are measured on a dataset collected in conditions, by people, with a distribution that differs from the actual world in ways that matter enormously at the tail. We improved the false wake rate over the following year through a combination of better training data and threshold tuning and hardware-level filtering. The rate came down. It never went to zero. Every voice product I have worked on since has had a version of this lesson somewhere inside it.
