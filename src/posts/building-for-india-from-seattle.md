---
title: Building for India from Seattle
date: April 15, 2019
excerpt: The apartment in Fremont where I lived in 2019 had a kitchen window that faced east, and some mornings I would stand there with coffee and a phone and be on a call with the partner team in Hyderabad while the light came up over Lake Union.
tags: building
---

The apartment in Fremont where I lived in 2019 had a kitchen window that faced east, and some mornings I would stand there with coffee and a phone and be on a call with the partner team in Hyderabad while the light came up over Lake Union in the distance. The time difference was eleven and a half hours. I had learned to schedule the calls for seven-thirty my time, which was seven in the evening there, which was the end of their day and the beginning of mine.

We were shipping Alexa Hands-Free on Android in India, and the gap between "shipping to India" and "shipping for India" was something I thought about constantly. The product had been built in Seattle, by people who had trained language models on American English data, tested on American English speakers, with hardware assumptions calibrated for American network conditions. Indian 4G networks in 2019 were fast in Mumbai and Bangalore and genuinely unreliable in the tier-two cities where a lot of the real growth was happening. The voice recognition for Indian-accented English required new data, which required a collection effort that required people to go to those cities, which required budget and time that had to be argued for in rooms where everyone was thinking about the US first.

We did the work. We collected the data, we tuned the models, we reduced the latency threshold assumptions, and we worked with partners who knew the market in ways I was learning from a distance. The product that shipped in India was adapted, imperfectly and genuinely, and the imperfections were specific: the places where Seattle's model of the user did not quite map to the person in Pune asking a question about cricket scores. I think about those gaps whenever I am building something now, that the distance between the builder and the person using the thing is not just geographic, and closing it requires more than good intentions.
