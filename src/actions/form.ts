"use server";

import { connectToDb } from "@/dbConnection/connectToDb";
import Form from "@/models/form.model";
import { currentUser } from "@clerk/nextjs";
import { formSchema, formSchemaType } from "./schemas/form.schema";

class UserNotFoundErr extends Error {}

export async function GetFormStats() {
  await connectToDb();
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  const stats = await Form.aggregate([
    {
      $match: {
        userId: user.id,
      },
    },
    {
      $group: {
        _id: null,
        visits: { $sum: "$visits" },
        submissions: { $sum: "$submissions" },
      },
    },
  ]);

  const { visits = 0, submissions = 0 } = stats.length > 0 ? stats[0] : {};

  let submissionRate = 0;
  if (visits > 0) {
    submissionRate = (submissions / visits) * 100;
  }

  const bounceRate = 100 - submissionRate;

  return {
    visits,
    submissions,
    submissionRate,
    bounceRate,
  };
}

export async function CreateForm(data: formSchemaType) {
  const validation = formSchema.safeParse(data);
  if (!validation.success) {
    throw new Error("form not valid");
  }

  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  const { name, description } = data;

  const form = await Form.create({
    userId: user.id,
    name,
    description,
  });

  if (!form) {
    throw new Error("something went wrong");
  }

  return form._id;
}
