import { db } from "@/server/db";
import { users } from "@/server/db/schema";

export default async function Home() {
  const data = await db.select().from(users).all();
  console.log(data);
  return <div>Hello TdA</div>;
}
