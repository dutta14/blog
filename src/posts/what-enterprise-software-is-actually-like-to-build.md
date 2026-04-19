---
title: What enterprise software is actually like to build
date: September 27, 2023
excerpt: Enterprise feedback doesn't come to you directly. It comes filtered through your PMs, who heard it from a partner, who heard it from a customer's IT department, three meetings removed from the actual problem.
---

Enterprise feedback doesn't come to you directly. It comes filtered through your PMs, who heard it from a partner, who heard it from a customer's IT department, three meetings removed from the actual problem. When a big enterprise partner has feedback, they provide it to our leadership through account teams and PMs, and by the time it reaches the engineers building the feature, it has been translated and summarized and reprioritized. You almost never hear the original sentence. You hear a requirement derived from it.

Enterprise software has a structure that consumer software doesn't, or not in the same way. The person who uses the product and the person who buys the product are almost never the same person. The person who buys it is thinking about security posture and license management and the conversation they will have with the CISO in the quarterly review. The person who uses it is thinking about whether the feature is fast enough that they'll use it instead of the old way. These are not incompatible goals. They require different conversations with different people in the same meeting.

What you learn over time is to read backward from the requirement to the actual pain. If the requirement is "audit logs must capture user-level action with a timestamp," the pain is a compliance team that got caught without the right records and had to explain it to someone. If the requirement is "changes must be announced fourteen days in advance," the pain is an IT administrator who had to field three hundred helpdesk tickets on a Monday because an update shipped on Friday. The requirement is clean. The story behind it is usually a bad afternoon for someone doing a job we never fully picture when we build.

I have never sat in a room with an enterprise customer the way people describe in case studies. But we hear from our PMs when something matters to a partner, and I have learned to take those signals seriously. The person who gave that feedback to our leadership, then to our account team, then to our PM, then to our planning doc, had a real problem. By the time it reaches us it looks like a specification. It started as a frustration.
