# Front-end Candidate Assignment

You are building a GIF picker that allows users to search for a GIF and
copy or share it to their favorite chat program.

It should use [GIPHY's API](https://developers.giphy.com/) to generate
GIFs. The API is limited to 42 requests per hour, 1000 per day. You need
to make a free account, go to your developer dashboard, create an app,
and that will provide you with the API key necessary.

## Requirements

  - GIFs should render using the MP4 format
  - App should load in under 1.5s
  - It should work in the most modern browsers
  - Enough styling that the app is usable and presentable
  - Use your modern UI framework of choice Aurelia/React/Vue/etc.
  - An AJAX/Fetch library as well as a utility library for things like
    encoding query parameters or debouncing/throttling is acceptable. No
    other libraries or plugins are acceptable.
  - A publicly available URL where the app will live through a service
    like [now](https://zeit.co/now),
    [netlify](https://www.netlify.com/), [surge](https://surge.sh/),
    [codepen](https://codepen.io/#), [glitch](https://glitch.com/), or
    similar.

## Features

Features are listed in priority, some are more difficult than others.
Accomplish as many as you feel comfortable.

**Core**

  - A user should have a clear way to search for GIFs.
  - A user should be able to make their own queries to search for GIFs.
  - A user should be able to easily copy the GIF URL to a chat program.

**Nice to Have**

  - A user should get results shortly after they're finshed typing.
  - A user should be able to cycle through many GIFs for each search
    query.
  - A user should be alerted when the API limit is reached.
  - A user should be able to see previous results even after the API
    limit is reached.
  - A user should be able to see 3 random gifs before searching.