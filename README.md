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

# How to use?

## Functions

### default

▸ **default**(`url`, `timeout?`, `requestOptions?`): `Promise`<`string` \| `number` \| `Error`\>

Check if a URL is reachable

**`Example`**

```ts
try {
  const statusCode = await isReachable("https://learnaws.io");
  // statusCode = 200
} catch (error) {
  const { message } = error;
  // Unable to resolve given URL, got status 404 or
  // Request timed out while requesting the provided URL
}
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `url` | `string` | `undefined` | URL of the website |
| `timeout` | `number` | `2000` | Cancel request after given time |
| `requestOptions?` | `RequestOptions` | `undefined` | Request options for HTTP Request |

#### Returns

`Promise`<`string` \| `number` \| `Error`\>

Promise object with status code or error

#### Defined in

[index.ts:24](https://github.com/ShivamJoker/reachy-url/blob/3630a09/index.ts#L24)
