import prisma from "../database/prisma.js";

const postSelect = {
  id: true,
  title: true,
  content: true,
  userId: true,
};

export function findAllPosts() {
  return prisma.post.findMany({
    select: postSelect,
    orderBy: { id: "asc" },
  });
}

export function findPostById(id) {
  return prisma.post.findUnique({
    where: { id },
    select: postSelect,
  });
}

export function findPostsByUserId(userId) {
  return prisma.post.findMany({
    where: { userId },
    select: postSelect,
    orderBy: { id: "asc" },
  });
}

export function createPost({ title, content, userId }) {
  return prisma.post.create({
    data: { title, content, userId },
    select: postSelect,
  });
}

export function updatePost(id, { title, content }) {
  return prisma.post.update({
    where: { id },
    data: { title, content },
    select: postSelect,
  });
}

export function deletePost(id) {
  return prisma.post.delete({
    where: { id },
    select: postSelect,
  });
}
