import { parse } from "url";
import http from "http";

// taken from https://stackoverflow.com/a/68415816/5748481
/**
 * Check if a URL is reachable
 * @param {string} url - URL of the website
 * @param {number} [timeout=2000] - Cancel request after (default 2000ms)
 * @param {object} [requestOptions] - Optional request parameters for reqest
 * @returns {Promise} Promise object with status code or error
 */
const isReachable = (
  url: string,
  timeout?: number,
  requestOptions?: http.RequestOptions
): Promise<string | number | Error> => {
  return new Promise((resolve, reject) => {
    const host = parse(url).host;

    if (!host) {
      reject(Error("Invalid URL"));
    }

    const options: http.RequestOptions = {
      method: "HEAD",
      host,
      path: parse(url).pathname,
      port: 80,
      timeout: timeout ?? 2000,
      ...requestOptions,
    };

    const req = http.request(options, (res) => {
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
