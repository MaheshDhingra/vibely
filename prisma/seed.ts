import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Users
  const userAlice = await prisma.user.create({
    data: {
      clerkId: 'clerk_alice123',
      username: 'alice',
      email: 'alice@example.com',
      name: 'Alice Wonderland',
      bio: 'Explorer of digital realms',
      profileImage: 'https://example.com/alice.jpg',
      password: 'hashed_password', // Only if needed
    },
  });

  const userBob = await prisma.user.create({
    data: {
      clerkId: 'clerk_bob456',
      username: 'bob',
      email: 'bob@example.com',
      name: 'Bob Builder',
      bio: 'Constructing dreams one block at a time',
      profileImage: 'https://example.com/bob.jpg',
      password: 'hashed_password', // Only if needed
    },
  });

  // Create a Hashtag
  const hashtagNature = await prisma.hashtag.create({
    data: {
      tag: 'nature',
    },
  });

  // Create a Post for Alice
  const post1 = await prisma.post.create({
    data: {
      caption: 'Enjoying a beautiful sunset!',
      imageUrl: 'https://example.com/sunset.jpg',
      user: {
        connect: { id: userAlice.id },
      },
      hashtags: {
        connect: [{ id: hashtagNature.id }],
      },
    },
  });

  // Create a Comment from Bob on Alice's post
  await prisma.comment.create({
    data: {
      content: 'Amazing view!',
      post: {
        connect: { id: post1.id },
      },
      user: {
        connect: { id: userBob.id },
      },
    },
  });

  // Create a Like from Bob on Alice's post
  await prisma.like.create({
    data: {
      post: {
        connect: { id: post1.id },
      },
      user: {
        connect: { id: userBob.id },
      },
    },
  });

  // Create a Story for Alice (expires in 24 hours)
  const story1 = await prisma.story.create({
    data: {
      imageUrl: 'https://example.com/story1.jpg',
      caption: 'Morning vibes',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      user: {
        connect: { id: userAlice.id },
      },
    },
  });

  // Create a Highlight for Alice and connect the story
  const highlight1 = await prisma.highlight.create({
    data: {
      title: 'My Stories',
      coverUrl: 'https://example.com/cover.jpg',
      user: {
        connect: { id: userAlice.id },
      },
      stories: {
        connect: [{ id: story1.id }],
      },
    },
  });

  // Create a Direct Message from Alice to Bob
  await prisma.message.create({
    data: {
      sender: { connect: { id: userAlice.id } },
      receiver: { connect: { id: userBob.id } },
      content: 'Hey Bob, check out my new post!',
    },
  });

  // Create a Reel for Bob with a hashtag
  const reel1 = await prisma.reel.create({
    data: {
      videoUrl: 'https://example.com/reel1.mp4',
      caption: 'Quick build time-lapse!',
      user: { connect: { id: userBob.id } },
      hashtags: {
        connect: [{ id: hashtagNature.id }],
      },
    },
  });

  // Add a ReelLike for the reel from Alice
  await prisma.reelLike.create({
    data: {
      reel: { connect: { id: reel1.id } },
      user: { connect: { id: userAlice.id } },
    },
  });

  // Create a Follow (Bob follows Alice)
  await prisma.follow.create({
    data: {
      follower: { connect: { id: userBob.id } },
      following: { connect: { id: userAlice.id } },
    },
  });

  // Create a Notification for Bob (e.g., new like on his reel)
  await prisma.notification.create({
    data: {
      type: 'like',
      message: 'Alice liked your reel!',
      user: { connect: { id: userBob.id } }, // recipient
      actorId: userAlice.id, // who triggered it
    },
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
