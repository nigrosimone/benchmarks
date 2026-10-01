import pkgJson from '../package.json' with { type: 'json' }
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

const require = createRequire(import.meta.url);

// fork test only: express, the first of the table, node-http as reference, and fulmine.js
const packages = {
  '0http': { hasRouter: true, package: '0http' },
  express: { hasRouter: true },
  fulmine: { hasRouter: true, package: 'fulmine.js' },
  'node-http': { version: process.version },
}

const _choices = []
Object.keys(packages).forEach(pkg => {
  if (!packages[pkg].version) {
    const module = pkgJson.dependencies[pkg] ? pkg : packages[pkg].package
    const version = require(resolve(`node_modules/${module}/package.json`)).version
    packages[pkg].version = version
  }
  _choices.push(pkg)
})

export const choices = _choices.sort()
export function list(extra = false) {
  return _choices
    .map(c => {
      return extra === !!packages[c].extra
        ? Object.assign({}, packages[c], { name: c })
        : null
    })
    .filter(c => c)
}
export function info(module) {
  return packages[module]
}
