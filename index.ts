import { parse } from "url";
import http, { RequestOptions } from "http";
import https from "https";

// taken from https://stackoverflow.com/a/68415816/5748481

/**
Check if a URL is reachable
@param {string} url - URL of the website
@param {number} timeout - Cancel request after given time
@param {RequestOptions} requestOptions - Request options for HTTP Request
@returns {Promise} Promise object with status code or error

@example
try {
  const statusCode = await isReachable("https://learnaws.io");
  // statusCode = 200
} catch (error) {
  const { message } = error;
  // Unable to resolve given URL, got status 404 or
  // Request timed out while requesting the provided URL
}
*/
const isReachable = (
  url: string,
  timeout: number = 2000,
  requestOptions?: RequestOptions
): Promise<string | number | Error> => {
  return new Promise((resolve, reject) => {
    const { host, protocol, pathname } = parse(url);

    if (!host) {
      reject(Error("Invalid URL"));
    }

    const isHttps = protocol === "https:";

    const options: RequestOptions = {
      host,
      timeout,
      method: "HEAD",
      path: pathname,
      port: isHttps ? 443 : 80,
      ...requestOptions,
    };

    const network = isHttps ? https : http;

    const req = network.request(options, (res) => {
      const statusCode = res.statusCode ?? 404;
      const isStatusOk = statusCode < 400;

      if (isStatusOk) {
        return resolve(statusCode);
      }

      reject(
        Error(`Unable to resolve given URL, got status ${res.statusCode}`)
      );
    });

    req.end();

    req.on("timeout", () => {
      req.destroy(Error("Request timed out while requesting the provided URL"));
    });

    req.on("error", (err) => {
      reject(err);
    });
  });
};

export default isReachable;

console.time("took");

isReachable("https://learnaws.io").then((d) => {
  console.log(d);

  console.timeEnd("took");
});
