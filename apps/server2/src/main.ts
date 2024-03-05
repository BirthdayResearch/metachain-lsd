import { AppModule } from "./AppModule";
import { MetachainLsdServerApp } from "./MetachainLsdServerApp";

async function bootstrap() {
  const app = new MetachainLsdServerApp(AppModule);
  await app.start();
}

void bootstrap();
