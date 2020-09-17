'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.posts.search(ctx.query);
    } else {
      entities = await strapi.services.posts.find(ctx.query);
    }

    let newEntities = [];
    for (let i = 0; i < entities.length; i++) {
      let relatedComments = await strapi.services.comments.find({postId: entities[i].id})

      let highlightedComments = relatedComments.map(comment => ({
        id: comment.id,
        content: comment.content,
        postId: comment.postId,
        user: {
          id: comment.user.id,
          username: comment.user.username,
        },
        createdAt: comment.createdAt,
      }));

      let newEntity = { ...entities[i], highlightedComments };
      newEntities.push(newEntity);
    }

    return newEntities.map(entity => sanitizeEntity(entity, { model: strapi.models.posts }));
  }
};
