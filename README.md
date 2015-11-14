# ember-cli-deploy-html-manifest [![Build Status](https://travis-ci.org/arenoir/ember-cli-deploy-html-manifest.svg?branch=master)](https://travis-ci.org/arenoir/ember-cli-deploy-html-manifest)


> An ember-cli-deploy plugin to add a versioned manifest attribute to the html element of the index.html page.

<hr/>
**WARNING: This plugin is only compatible with ember-cli-deploy versions >= 0.5.0**
<hr/>

This plugin updates or creates a `manifest` attribute on the `html` tag of the index.html page.  It versions the manifest file using the [ember-cli-deploy-revision-data][3] plugin. The default path is `/_rev/${revisionKey}/manifest.appcache` and can be customized using the `buildManifestPath` configuration option.

## Quick Start
To get up and running quickly, do the following:

- Ensure [ember-cli-deploy-build][1] and [ember-cli-deploy-revision-data][3] are installed and configured.

- Install this plugin

```bash
$ ember install ember-cli-deploy-html-manifest
```

- Place the following configuration into `config/deploy.js`

```javascript
ENV['html-manifest'] = {
  
}
```

- Run the pipeline

```bash
$ ember deploy
```


## ember-cli-deploy Hooks Implemented

For detailed information on what plugin hooks are and how they work, please refer to the [Plugin Documentation][1].

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

## Prerequisites

The following properties are expected to be present on the deployment `context` object:

- `distDir`                     (provided by [ember-cli-deploy-build][2])
- `revisionData`                (provided by [ember-cli-deploy-revision-data][3])

## Running Tests

- `npm test`

[1]: http://ember-cli.github.io/ember-cli-deploy/plugins "Plugin Documentation"
[2]: https://github.com/ember-cli-deploy/ember-cli-deploy-build "ember-cli-deploy-build"
[3]: https://github.com/ember-cli-deploy/ember-cli-deploy-revision-data "ember-cli-deploy-revision-data"
