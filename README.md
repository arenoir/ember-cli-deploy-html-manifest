# ember-cli-html-manifest

> An ember-cli-deploy plugin to add a versioned manifest attribute to the html element of the index.html page.

<hr/>
**WARNING: This plugin is only compatible with ember-cli-deploy versions >= 0.5.0**
<hr/>

This plugin updates the html tag manifest attribute of a html file, presumably index.html.


## Quick Start
To get up and running quickly, do the following:

- Ensure [ember-cli-deploy-build][4] is installed and configured.

- Install this plugin

```bash
$ ember install ember-cli-deploy-redis
```

- Place the following configuration into `config/deploy.js`

```javascript
ENV.html-manifest {
  
}
```

- Run the pipeline

```bash
$ ember deploy
```

## Installation
Run the following command in your terminal:

```bash
ember install ember-cli-deploy-html-manifest
```

## ember-cli-deploy Hooks Implemented

For detailed information on what plugin hooks are and how they work, please refer to the [Plugin Documentation][2].

- `configure`
- `didPrepare`

## Configuration Options


### buildManifestPath

  A funtion that returns the path to the the manifest file.

  ```javascript
  buildManifestPath(context) {
    var revisionKey = context.revisionData && context.revisionData.revisionKey;

    return `/_rev/${revisionKey}/manifest.appcache`;
  }
  ```

## Running Tests

- `npm test`

[2]: http://ember-cli.github.io/ember-cli-deploy/plugins "Plugin Documentation"
[4]: https://github.com/ember-cli-deploy/ember-cli-deploy-build "ember-cli-deploy-build"
