import app from "./setupServer";
import isReachable from "../index";
import { beforeAll, expect, test } from "vitest";

const makeURL = (path: string) => {
  return isReachable(`http://localhost/${path}`, 20, { port: 6969 });
};

beforeAll(() => {
  app.listen(6969);
});

test("URL should be reachable", async () => {
  await expect(makeURL("reachable")).resolves.toEqual(200);
});

test("URL should be unreachable", async () => {
  await expect(makeURL("unreachable")).rejects.toThrowError(
    "Unable to resolve given URL, got status 404"
  );
});
test("URL should timeout", async () => {
  await expect(makeURL("timeout")).rejects.toThrowError(
    "Request timed out while requesting the provided URL"
  );
});
test("URL should be invalid", async () => {
  await expect(isReachable("http:")).rejects.toThrowError("Invalid URL");
});
