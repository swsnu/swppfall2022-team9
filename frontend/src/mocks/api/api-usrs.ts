import { mockUser } from "mocks/data/users";
import { rest } from "msw";

export const usersApi = [
  rest.get(`${process.env.API_URL}/users`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.delay(2000), ctx.json(mockUser));
  }),
];
