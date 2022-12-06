import { fireEvent } from "@testing-library/react";
import {
  friendListStub,
  makeFriendListStub,
  usersStub,
} from "server/stubs/users.stub";
import { FakeMouseEvent } from "test-utils/fakeEvent";
import Canvas from "./Canvas";
import { NODE_RADIUS, UserNode } from "./node";

describe("Canvas", () => {
  it("test Canvas", async () => {
    const divElement = document.createElement("div");
    const canvasElement = divElement.appendChild(
      document.createElement("canvas"),
    );
    const canvas = new Canvas(canvasElement);
    canvas.setSize(800, 800);
    canvas.setCurrentUser(usersStub[0]);
    canvas.setFriendList(friendListStub);
    canvas.setCenterNode(usersStub[0].id);
    canvas.setFriendNodes(usersStub[0].id);
    canvas.nodes?.forEach(
      node => (node.journey = jest.fn().mockResolvedValue(true)),
    );
    await canvas.startNodeJourney();
    canvas.render();

    // Hover center node
    canvas.centerNode!.isNotSearched = true;
    fireEvent(
      canvasElement,
      new FakeMouseEvent("mousemove", {
        offsetX: canvasElement.width / 2,
        offsetY: canvasElement.height / 2,
      }),
    );
    canvas.centerNode!.isNotSearched = false;
    canvas.touchedNode = undefined;
    fireEvent(
      canvasElement,
      new FakeMouseEvent("mousemove", {
        offsetX: canvasElement.width / 2,
        offsetY: canvasElement.height / 2,
      }),
    );
    fireEvent(
      canvasElement,
      new FakeMouseEvent("mousemove", {
        offsetX: canvasElement.width / 2 + NODE_RADIUS * 6,
        offsetY: canvasElement.height / 2,
      }),
    );
    fireEvent(
      canvasElement,
      new FakeMouseEvent("mousemove", {
        offsetX: canvasElement.width / 2 + NODE_RADIUS * 6,
        offsetY: canvasElement.height / 2,
      }),
    );
    fireEvent(
      canvasElement,
      new FakeMouseEvent("mousemove", {
        offsetX: 0,
        offsetY: 0,
      }),
    );

    // Click one-chon node
    fireEvent(
      canvasElement,
      new FakeMouseEvent("mousedown", {
        offsetX: canvasElement.width / 2 + NODE_RADIUS * 6,
        offsetY: canvasElement.width / 2,
      }),
    );
    fireEvent(
      canvasElement,
      new FakeMouseEvent("mousedown", {
        offsetX: canvasElement.width / 2,
        offsetY: canvasElement.width / 2,
      }),
    );

    // Hover expand
    canvas.oneChonNodes[0].radius =
      canvas.oneChonNodes[0].originalRadius *
      canvas.oneChonNodes[0].EXPAND_RATE;
    canvas.render();

    // // Expand to one-chon graph
    canvas.setFriendNodes(friendListStub[0].id);
    const stub1 = makeFriendListStub(3, 0);
    canvas.setFriendList(stub1);
    canvas.setFriendNodes(stub1[0].id);

    // Cover branches
    canvas.setFriendList([]);
    await canvas.startNodeJourney();
    canvas.setFriendList(stub1);
    await canvas.startNodeJourney();

    const userNode1 = new UserNode(
      1,
      "name",
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      canvas,
      "",
      true,
    );
    canvas.drawUserNode(userNode1);
    const userNode2 = new UserNode(
      1,
      "name",
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      canvas,
      "",
      false,
    );
    userNode2.radius = userNode2.originalRadius * userNode2.EXPAND_RATE;
    canvas.drawUserNode(userNode2);
  });
});
