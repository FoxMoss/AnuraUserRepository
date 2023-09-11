import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Redis } from "npm:ioredis";

interface appInfo {
  name: string;
  icon: string;
  desc: string;
  data: string;
}

const redis = new Redis();
const router = new Router();
router.get("/", (context) => {
  context.response.body = "Anura User Repository";
});
router.get("/list.json", async (context) => {
  const appList = await redis.lrange("aur:apps", 0, -1);
  const objList: appInfo[] = [];
  appList.forEach((element: string) => {
    objList.push(JSON.parse(element));
  });

  context.response.body = `{"apps":${JSON.stringify(objList)}}`;
  context.response.headers.set("Content-Type", "application/json");
});
router.get("/repo/:repoUrl", async (context) => {
  if (!(await redis.exists(`aur:apps:${context.params.repoUrl}`))) {
    context.response.body = "Repo does not exist.";
  }
});
router.get("/user/", (context) => {});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 4269 });
