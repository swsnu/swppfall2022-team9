// IMPORTANT: everything related to dto, models, stubs should be relative imports
import { PostCreateProfileDto } from "../dto/profile/profile.dto";

import { Application } from "express";

import low from "lowdb";
import { Schema } from ".";
import { GetProfileResDto } from "../dto/profile/profile.res.dto";

export default function applyProfileApi(
  server: Application,
  db: low.LowdbSync<Schema>,
) {
  server.post<unknown, unknown, PostCreateProfileDto>(
    "/api/profile/",
    async req => {
      await db
        .get("profiles")
        .push({ ...req.body })
        .write();
    },
  );

  server.get<{ userId: number }, GetProfileResDto>(
    "/api/profile/:userId/",
    async (req, res) => {
      const profile = db.get("profiles").findLast().value();
      if (!profile) {
        res.status(404).json();
      } else {
        res.status(200).json({ ...profile, qualityTags: [{ name: "test" }] });
      }
    },
  );
}
