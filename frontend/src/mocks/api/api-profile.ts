import { mockProfile } from "mocks/data/profile";
import { rest } from "msw";

export const profileApis = [
  rest.get(`${process.env.API_URL}/profiles`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.delay(2000), ctx.json(mockProfile));
  }),
  rest.get(`${process.env.API_URL}/profiles/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const profileId = Number(id);
    return res(ctx.status(200), ctx.delay(2000), ctx.json(mockProfile));
  }),
];
