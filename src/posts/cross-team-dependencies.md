---
title: Cross-team dependencies
date: May 18, 2023
excerpt: In the spring of 2023, there was a team whose timeline controlled ours.
tags: engineering-leadership
---

In the spring of 2023, there was a team whose timeline controlled ours. I will not name the team or the feature or the people involved, because none of that is the point and all of them were doing their best. The point is the situation, which was that we had a deliverable that required an API from another group, and that group had their own roadmap, their own stakeholders, their own pressures, and our deliverable was on their list but somewhere in the middle of a list that had things on top of it that mattered more to them than to us.

We had the meetings. The cross-team syncs, the weekly check-ins, the escalation review where both managers sat with a product leader who nodded and asked questions and did not make a decision. I do not say this with bitterness. Escalation is a real mechanism that sometimes works. This time it produced a month of waiting and one priority adjustment that moved our API from fourth to third on their list. That was progress. The timeline we had committed to was not survivable at third place.

What we did in the end was split the feature. We shipped the pieces that didn't depend on the other team's API, using a workaround that everyone on our team knew was a workaround, with the intention of revisiting it when the dependency resolved. The workaround became the product for fourteen months. The API eventually landed. We did the right revision. In the meantime, the feature worked, slightly awkwardly, and the users who used it did not notice the awkwardness, which is something I have thought about since. Sometimes the seam is invisible to everyone except the person who had to build around it.
