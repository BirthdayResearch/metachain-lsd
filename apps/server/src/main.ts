import { AppModule } from "./AppModule";
import { MarbleFiLsdServerApp } from "./MarbleFiLsdServerApp";

async function bootstrap() {
  const app = new MarbleFiLsdServerApp(AppModule);
  await app.start();
}

void bootstrap();
