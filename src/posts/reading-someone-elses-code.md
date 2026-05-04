---
title: Reading someone else's code
date: November 22, 2025
excerpt: It was my second Monday at Meta, nine in the morning, and the coffee next to my monitor had gone cold while I stared at a diff with four hundred files in it.
tags: career, big-tech
---

It was my second Monday at Meta, nine in the morning, and the coffee next to my monitor had gone cold while I stared at a diff with four hundred files in it. The naming convention was consistent in the way that suggested a single person had designed it, probably two or three engineers ago, and the person who inherited it had mostly respected it except in the files that dealt with authentication, where something had clearly gone wrong around the time they migrated to a new framework, and nobody had gone back to fix it because nobody goes back to fix naming conventions when the thing is working.

Every time I have joined a new company, this is the actual first day. The real onboarding. You sit in front of someone else's code and you read it the way an archaeologist reads a site, layer by layer, trying to figure out what was here before and why it changed and who made the decision and whether they are still around to ask. The onboarding documents tell you how the system is supposed to work. The code tells you how it actually works. These are rarely the same thing.

At Amazon, my first week involved a codebase that had comments dated three years before I joined. Some of the comments referenced tickets that no longer existed in the tracking system. One comment said "temporary fix, revisit in Q2" with no year attached, and I later learned it had been there for eighteen months. I found a function named handleEdgeCase that was two hundred lines long and handled what appeared to be the main case. I read it three times before I understood what it did, and when I finally did, I felt a quiet respect for whoever wrote it, because the problem it solved was genuinely hard and the solution, while difficult to read, was correct.

At Samsung, the code was cleaner and more cautious, the way code tends to be when it ships on hardware that cannot be patched easily. The engineers who had written it expected to maintain it for years, and you could feel that expectation in the structure, in the way things were separated and named and documented. At Microsoft, the code carried the weight of backward compatibility, years of it, layers of abstraction built to ensure that something written in 2015 would still work in 2024. Reading it was like reading a house that had been renovated four times, where you could see where the original walls used to be if you looked carefully.

What I have learned from doing this across four companies is that code is autobiography. The style tells you whether the team values clarity or speed. The comments tell you what they are afraid of. The test coverage tells you what has broken before. The folder structure tells you how they think about boundaries, which is really how they think about responsibility, which is really how the team is organized even when the org chart says something different.

The most useful thing you can do in your first two weeks at a new company is read the code without judgment. Understand the decisions that led to what is in front of you, made by people who had constraints you do not yet know about, on timelines you did not experience, with information you do not have. The code is always a reasonable response to a situation you were not in.

I finished that diff at Meta around noon. The coffee was cold. I made a new cup and opened the next file. It was a test file with seven hundred lines and no description, and I thought, here is someone who was very thorough and very tired, and I liked them immediately.
