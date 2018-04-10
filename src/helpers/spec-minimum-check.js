import Alt from 'altheia-async-data-validator';
import InternetValidator from 'altheia-async-data-validator/src/internet';
Alt.use(InternetValidator);

/**
 * Check minimal spec to display the documentation
 */
export default async (spec) => {
  const hasError = await Alt({
    swagger: Alt.string().in('2.0', '3.0'),
    host: Alt.internet().hostname(),
    info: Alt.object().schema({
      schema: Alt({
        description: Alt.string(),
        title: Alt.string(),
        version: Alt.string(),
        'x-logo': Alt.object().schema({
          schema: Alt({
            url: Alt.internet().url(),
          }),
          returnErrors: true,
        }),
      }).options({ required: true }),
      returnErrors: true,
    }),
    schemes: Alt.array().min(1),
    paths: Alt.object(),
  })
    .body(spec)
    .options({
      required: true,
    })
    .validate();

  return hasError;
};
