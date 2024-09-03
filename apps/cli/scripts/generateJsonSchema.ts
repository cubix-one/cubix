const tsj = require('ts-json-schema-generator');
const fs = require('node:fs');
const path = require('node:path');

/** @type {import('ts-json-schema-generator/dist/src/Config').Config} */
const config = {
  path: path.resolve(__dirname, '../src/types/cubixConfig.ts'),
  tsconfig: path.resolve(__dirname, '../tsconfig.json'),
  type: 'ICubixConfig',
  expose: 'export',
  jsDoc: 'extended',
  strictTuples: true,
};

const outputPath = path.resolve(__dirname, '../../../dist/apps/cli/cubix-config-schema.json');

const schema = tsj.createGenerator(config).createSchema(config.type);
const schemaString = JSON.stringify(schema, null, 2);

fs.writeFileSync(outputPath, schemaString);

console.log(`Schema JSON gerado em: ${outputPath}`);
