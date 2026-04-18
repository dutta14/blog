---
title: Building voice on a phone with bad signal
date: November 12, 2019
excerpt: The assumption baked into every voice assistant I had ever used was that the connection was good.
---

The assumption baked into every voice assistant I had ever used was that the connection was good. That the audio would make it through clean, that the server would respond in under two hundred milliseconds, that the pipeline from "Alexa" to answer would be a straight line. That assumption was built for a different country.

When we shipped Alexa Hands-Free in India, we spent weeks studying failure modes that our tools weren't designed to measure. Calls dropped mid-wake-word. Buffers filled up and then didn't drain. A phone on a crowded train in Mumbai was doing something fundamentally different from a phone on a suburban WiFi network in Seattle, and the difference mattered every single time. I remember sitting in a review meeting looking at a graph of latency spikes across Indian cities and realizing we were essentially redesigning the product from the middle.

What stays with me about that period is not the technical problem. It's the weight of knowing that the people on the other end of the bad signal were not hypothetical. They were real, and they were waiting.
