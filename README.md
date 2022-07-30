# reachy-url
Zero dependency nodejs library for checking if URL is reachable or not

# Installation

```sh
pnpm install reachy-url
```

```sh
yarn add reachy-url
```

```sh
npm install reachy-url
```

# Usage
```js
try {
  const statusCode = await isReachable("https://learnaws.io");
  // statusCode = 200
} catch (error) {
  const { message } = error;
  // Unable to resolve given URL, got status 404 or
  // Request timed out while requesting the provided URL
}

```
