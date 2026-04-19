---
title: The hardware partner call
date: July 28, 2019
excerpt: The call came on a Friday afternoon in October 2019, which is the wrong time for a call of this kind.
tags: ai-products
---

The call came on a Friday afternoon in October 2019, which is the wrong time for a call of this kind. The partner was a hardware company building a smart speaker for the Indian market, and their engineering lead had been up for eighteen hours when he reached me. The wake word detection was failing. Not failing slowly, not degrading at the edges. Failing. Forty percent miss rate on their device in field testing. They were supposed to submit the final build in three weeks.

We pulled in three engineers that evening and started looking at the audio pipeline. The issue was in the microphone array configuration, or specifically in how our software was interpreting the signal coming from an array that was positioned differently from the reference hardware we had built against. The echo cancellation was eating the wake word. We had tested on our reference device. They had built their device to slightly different tolerances. The mismatch was invisible until someone was standing in a kitchen in Hyderabad saying "Alexa" to a speaker that was silently ignoring them.

We had a build with adjusted echo cancellation parameters to the partner team by Sunday. We had three more iterations over the next ten days. The final submission made the deadline by four days. In the end, this kind of work, the unscheduled Friday call, the weekend builds, the back-and-forth over something that should have been caught earlier, was where I felt most useful at Amazon. Not in the planning documents or the all-hands reviews. In the late Friday call where someone needed something fixed and you could either fix it or say it wasn't your problem, and I had learned from the people around me that the first answer was the right one.
