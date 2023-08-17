### Installation

NPM

```
npm i @smartlook/circular-deps-detector
```

YARN

```
yarn add @smartlook/circular-deps-detector
```

PNPM

```
pnpm add @smartlook/circular-deps-detector
```

### Usage

Add this line to your scripts in `package.json`

```
"detect-circular-deps": "detect-circular-deps --config ./circular-deps-config.json"
```

Then create a new JSON file `circular-deps-config.json` with the following content:

| Property         | Type                | Description                                                             |
| ---------------- | ------------------- | ----------------------------------------------------------------------- |
| `projectName`    | string              | Your project name                                                       |
| `rootDir`        | string              | root directory to scan                                                  |
| `tsConfig`       | string              | path to your TS config file                                             |
| `entryPoint`     | string              | path to the entry point file                                            |
| `outputFile`     | string              | path to output report file (JSON)                                       |
| `ignorePatterns` | string[] (optional) | array of regexp patterns (valid parameter of JavaScript `new RegExp()`) |

Example:

```
{
	"projectName": "My App",
	"rootDir": "./src",
	"tsConfig": "./tsconfig.json",
	"entryPoint": "./src/index.ts",
	"outputFile": "./circular-deps-report.json",
	"ignorePatterns": [
		"/src/libs/.*",
		"/src/services/utils/.*",
	]
}

```
