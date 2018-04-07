class NormalizerError extends Error {
  constructor(message) {
    super(`[Normalizer] ${message}`);
    Error.captureStackTrace(this, NormalizerError);
  }
}

export default async (spec) => {
  return spec;
};
