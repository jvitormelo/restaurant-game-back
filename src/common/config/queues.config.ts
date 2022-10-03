import { BullModule } from "@nestjs/bull";
import { QueueName } from "../constants/queue-name.constant";

export const registerOrderQueue = () => {
  return BullModule.registerQueue({
    name: QueueName.ORDER,
  });
};

export const registerCookingOrderQueue = () => {
  return BullModule.registerQueue({
    name: QueueName.COOKING_ORDER,
  });
};
