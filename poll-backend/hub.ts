import { Poll, ReqCreatePoll } from "./type_defs.ts";
import { v4 } from "https://deno.land/std@0.95.0/uuid/mod.ts";
import { PollRoom } from "./poll_room.ts";
import { WebSocketClient } from "https://deno.land/x/websocket@v0.1.1/lib/websocket.ts";

export type PollRooms = Map<string, PollRoom>;

export class Hub {
  pollRooms: PollRooms = new Map();

  createPoll(poll: ReqCreatePoll) {
    const options = poll.options.map((opt) => ({ count: 0, option: opt }));

    const id = v4.generate();
    const newPoll: Poll = {
      question: poll.question,
      options,
      id,
    };

    const pollRoom = new PollRoom(newPoll);
    this.pollRooms.set(id, pollRoom);
    return pollRoom;
  }
  // When we subscribe we should push pollInfo to client immediately
  subscribe(id: string, ws: WebSocketClient) {
    const pr = this.pollRooms.get(id);
    if (pr) {
      pr.addCon(ws);
      return pr.poll;
    }
    return { error: "No poll found with that id" };
  }
  unsubscribe(id: string, ws: WebSocketClient) {
    const pr = this.pollRooms.get(id);
    if (pr) {
      pr.removeConn(ws);
    }
    return { status: 200 };
  }
}
