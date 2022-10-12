import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket } from "dgram";
import { EventsService } from "./events.service";

@WebSocketGateway({ cors: { origin: "*" } })
export class EventsGateway {
  @WebSocketServer()
  server: Socket;

  constructor(private readonly eventsService: EventsService) {}

  @SubscribeMessage("events")
  handleEvent(@MessageBody() data: string): string {
    console.log(data);

    this.server.emit("hello", data);

    return data;
  }
}
