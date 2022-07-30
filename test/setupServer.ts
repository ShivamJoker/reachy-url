import polka from "polka";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const app = polka();
app
  .head("/reachable", (_, res) => {
    res.statusCode = 200;
    res.end("You found me!");
  })
  .head("/unreachable", (_, res) => {
    res.statusCode = 404;
    res.end("Go away! Nothing is here.");
  })
  .head("/timeout", async (_, res) => {
    await sleep(5000);
    res.end("You waited too long.");
  });

export default app;
