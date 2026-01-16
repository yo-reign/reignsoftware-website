---
title: Hello World
description: Welcome to the reignsoftware blog. This is our first post where we share our vision and what you can expect from us.
date: '2025-01-15'
published: true
tags:
  - announcement
  - meta
author: reignsoftware
---

Welcome to the reignsoftware blog! We're excited to finally have a space to share our thoughts, discoveries, and learnings as we build software.

## What to Expect

This blog will cover a range of topics including:

- **Technical deep-dives** into the technologies we use and love
- **Project updates** on what we're building
- **Lessons learned** from real-world software development
- **Industry insights** and our take on emerging trends

## Our Philosophy

At reignsoftware, we believe in building software that is:

1. **Fast** - Performance is a feature, not an afterthought
2. **Robust** - Reliability under all conditions
3. **Beautiful** - Great UX isn't optional

> "Good software is like a good joke. If you have to explain it, it's not that good."

## A Quick Code Example

Here's a simple example of how we structure our Svelte components:

```svelte
<script lang="ts">
	let count = $state(0);

	function increment() {
		count++;
	}
</script>

<button onclick={increment}>
	Count: {count}
</button>
```

And some TypeScript for good measure:

```typescript
interface User {
	id: string;
	name: string;
	email: string;
}

async function fetchUser(id: string): Promise<User> {
	const response = await fetch(`/api/users/${id}`);
	return response.json();
}
```

## Stay Tuned

We have a lot planned for this blog. Follow along as we share our journey of building better software.

---

_Thanks for reading! Feel free to reach out if you have any questions or topics you'd like us to cover._
