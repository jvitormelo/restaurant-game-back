import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { restaurantMiddleware } from "./common/middlewares/restaurant.middleware";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // TODO
  // app.useGlobalPipes(new ValidationPipe({transform: true}));
  app.use(restaurantMiddleware);
  app.enableCors({
    origin: "*",
  });
  await app.listen(3333);
}

bootstrap();
