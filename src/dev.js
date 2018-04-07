import main from './main';

// Loading the file here allow us to have hot reload on yaml change :)
import fullspec from 'json-loader!yaml-loader!@/../static/swagger2/minimum.yaml';

main({
  file: fullspec,
});
