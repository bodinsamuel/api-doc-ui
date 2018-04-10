import slugify from 'slugify';

class NormalizerError extends Error {
  constructor(message) {
    super(`[Normalizer] ${message}`);
    Error.captureStackTrace(this, NormalizerError);
  }
}

export default async (spec) => {
  // Check tags
  // Put the main one to handle non tagged endpoint
  if (!spec.tags || spec.tags.length <= 0) {
    spec.tags = [{ name: 'global', description: '' }];
  }

  for (let path in spec.paths) {
    for (let verb in spec.paths[path]) {
      const final = spec.paths[path][verb];
      final.__verb = verb;
      final.__path = path;
      final.__slug = slugify(path, { lower: true });

      // If a path is tagged but tag has no global definition we push it
      if (
        final.tags &&
        final.tags.length > 0 &&
        !spec.tags.find((tag) => tag.name === final.tags[0])
      ) {
        spec.tags.push({
          name: final.tags[0],
          description: '',
          __slug: slugify(final.tags[0], { lower: true }),
        });
      }

      // If no tag we simply put a global one, to easily identify them
      if (!final.tags || final.tags.length <= 0) {
        final.tags = ['global'];
      }

      // Move description to summary if needed
      // Some spec/dev put only a short description but summary is more suited for this
      if (
        !final.summary &&
        final.description &&
        final.description.length <= 75
      ) {
        final.summary = final.description;
        final.description = null;
      }
    }
  }

  return spec;
};
