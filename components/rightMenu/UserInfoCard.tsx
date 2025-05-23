import { User } from "@prisma/client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/client";
import UserInfoCardInteraction from "./UserInfoCardInteraction";

const UserInfoCard = async ({ user }: { user: User }) => {
  const createdAtDate = new Date(user.createdAt);
  const formattedDate = createdAtDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let isBlocked = false;
  let isFollowing = false;
  let isFollowingSent = false;

  const { userId: currentUserId } = await auth();

  if (currentUserId) {
    const blockRes = await prisma.block.findFirst({
      where: {
        blockerId: currentUserId,
        blockedId: user.id,
      },
    });
    if (blockRes) {
      isBlocked = true;
    }
    isBlocked = false;

    const followRes = await prisma.follower.findFirst({
      where: {
        followerId: currentUserId,
        followingId: user.id,
      },
    });
    if (followRes) {
      isFollowing = true;
    }
    isFollowing = false;

    const blockReqRes = await prisma.followRequest.findFirst({
      where: {
        senderId: currentUserId,
        receiverId: user.id,
      },
    });
    if (blockReqRes) {
      isFollowingSent = true;
    }
    isFollowingSent = false;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">User Information</span>
        <Link href="/" className="text-blue-500 text-xs">
          See all
        </Link>
      </div>
      {/* Bottom */}
      <div className="flex flex-col gap-4 text-gray-500">
        <div className="flex items-center gap-2">
          <span className="text-xl text-black">
            {" "}
            {user.name && user.surname
              ? user.name + "" + user.surname
              : user.username}
          </span>
          <span className="text-sm">@{user.username}</span>
        </div>
        {user.description && <p>{user.description}</p>}

        {user.city && (
          <div className="flex items-center gap-2">
            <Image src="/map.png" alt="" width={16} height={16} />
            <span>
              Living in <b>{user.city}</b>{" "}
            </span>
          </div>
        )}

        {user.school && (
          <div className="flex items-center gap-2">
            <Image src="/school.png" alt="" width={16} height={16} />
            <span>
              Went to <b> {user.school}</b>{" "}
            </span>
          </div>
        )}

        {user.work && (
          <div className="flex items-center gap-2">
            <Image src="/work.png" alt="" width={16} height={16} />
            <span>
              Works at <b> {user.work}</b>{" "}
            </span>
          </div>
        )}
        <div className=" flex items-center justify-between">
          {user.website && (
            <div className="flex gap-1 items-center">
              <Image src="/link.png" alt="" width={16} height={16} />
              <Link href={user.website} className="text-blue-500 font-medium">
                {user.website}
              </Link>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Image src="/date.png" alt="" width={16} height={16} />
            <span>Joined {formattedDate}</span>
          </div>
        </div>
        <UserInfoCardInteraction
          userId={user.id}
          currentUserId={currentUserId}
          isUserBlocked={isBlocked}
          isFollowing={isFollowing}
          isFollowingSent={isFollowingSent}
        />
      </div>
    </div>
  );
};

export default UserInfoCard;
