---
title: The difference between Microsoft and Meta
date: June 3, 2024
excerpt: The thing you notice first at Meta, coming from Microsoft, is the pace of the document culture.
tags: big-tech
---

The thing you notice first at Meta, coming from Microsoft, is the pace of the document culture. At Microsoft there is a layered system of review, approval, architecture discussions, and design documentation that accumulates before significant engineering work begins. At Meta the documentation follows the work. Engineers ship a version, the review happens in the diff, the argument is in the commit message and the code review thread. Neither approach is wrong. They are solutions to different organizational problems.

Microsoft builds software that runs in enterprise environments where a configuration mistake can affect forty thousand users in a regulated industry. The review layers exist because the cost of error is distributed and high. Meta builds consumer products at a scale where speed is itself a competitive advantage, and the cost of error is real but recoverable, and waiting for the full review cycle costs more than shipping and fixing does. I had to consciously adjust my instincts in the first three months, the part of me trained by years of enterprise product management that kept asking for documentation that Meta's process didn't require.

What I came to appreciate at Meta was the directness of the engineering culture. Feedback in code reviews was blunt and substantive and given without the social softening I had learned to apply at Microsoft, where the team was spread across four time zones and the review happened asynchronously in a context where tone was easy to misread. At Meta a code review comment that said "this doesn't handle the edge case at line 47" was just information. At Microsoft the same comment might have started with "I might be missing something, but." The directness was not unkindness. It was a different bet about how people learn, and I found, to my surprise, that I preferred it.
