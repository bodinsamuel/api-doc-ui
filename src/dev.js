import main from './main';

// Loading the file here allow us to have hot reload on yaml change :)
import fullspec from 'json-loader!@/../static/swagger2/petstore.json';
// import fullspec from 'json-loader!yaml-loader!@/../static/swagger2/fullspec.yaml';
// import fullspec from 'raw-loader!@/../static/raml/typhon.raml';

main({
  file: '/static/swagger2/petstore.json',
});
