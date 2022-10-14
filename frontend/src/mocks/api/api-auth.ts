import { PostSignInDto } from "dto/users/users.dto";
import { PostSignInResDto } from "dto/users/users.res.dto";
import { mockUser } from "mocks/data/users";
import { User } from "models/users.model";
import { rest } from "msw";

//Record<string, never> means {}, empty object
export const authApis = [
  rest.post<PostSignInDto, PostSignInResDto>(
    `${process.env.API_URL}/login`,
    async (req, res, ctx) => {
      const { email, password } = (await req.body) as PostSignInDto;
      return res(ctx.json(mockUser));
    },
  ),
];
