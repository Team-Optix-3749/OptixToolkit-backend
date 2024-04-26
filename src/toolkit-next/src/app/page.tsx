import { Suspense } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import { getMongoData } from "@/lib/mongo";
import { getUserDataWithUid } from "@/lib/firebase";
import { unixToFancyDate } from "@/lib/utils";

export default async function Page() {
  const getUsers = async function () {
    return await getMongoData(async (db) => {
      return db.collection("users").find({}).toArray();
    });
  };

  return (
    <section className="bg-bg-light size-full p-4">
      <section
        className="border sm:border-border lg:border-red-700 bg-background 
          rounded-sm h-full w-full min-w-[39rem] overflow-visible">
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Meeting Count</TableHead>
              <TableHead className="text-right">Last Check In</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(await getUsers())?.map(async (item: any) => {
              const userData = await getUserDataWithUid(item.uid);

              return (
                <TableRow key={item["_id"].toString()}>
                  <TableCell className="font-medium">
                    {userData.displayName || "None"}
                  </TableCell>
                  <TableCell>{userData.email || "None"}</TableCell>
                  <TableCell>
                    {(item.seconds / 60 / 60).toPrecision(2)}
                  </TableCell>
                  <TableCell>{item.meetingCount}</TableCell>
                  <TableCell className="text-right">
                    {item.lastCheckIn
                      ? unixToFancyDate(item.lastCheckIn)
                      : "Unknown"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </section>
    </section>
  );
}
