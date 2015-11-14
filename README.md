# ember-cli-deploy-html-manifest [![Build Status](https://travis-ci.org/arenoir/ember-cli-deploy-html-manifest.svg?branch=master)](https://travis-ci.org/arenoir/ember-cli-deploy-html-manifest)


> An ember-cli-deploy plugin to add a versioned manifest attribute to the html element of the index.html page.

<hr/>
**WARNING: This plugin is only compatible with ember-cli-deploy versions >= 0.5.0**
<hr/>

This plugin creates a html cache manifest file and updates the `manifest` attribute on the `html` tag of the index.html page.  It versions the manifest file using the [ember-cli-deploy-revision-data][3] plugin.

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
  filename: 'manifest.appcache',
  prependPath: 'https://mycdn.com/',
  excludePaths: ['index.html'],
  includePaths: ['/mobile/'],
  network: ['*']
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

### filename
  The name of the manifest file to be created and refrenced in the html tag `manifest` attribute.

*Default:* `'manifest.appcache'`

### manifestRoot

  A funtion that returns the root path to the the manifest file. Is refrenced in the html tag `manifest` attribute.
  
*Default:* 
```javascript
  manifestRoot(context) {
    var revisionKey = context.revisionData && context.revisionData.revisionKey;

    return '/_rev/' + revisionKey;
  }
```

### excludePaths

  An array of paths not to be included in the cache manifest.

*Default:*  ```['index.html']```
  

### includePaths
  A list of paths to be added to the cache manifest file. 

*Default:* ```['/']```

### network
  A list of paths to be added to the NETWORK section of the cache manifest. 

*Default:* ```['*']```


## Prerequisites

The following properties are expected to be present on the deployment `context` object:

- `distDir`                     (provided by [ember-cli-deploy-build][2])
- `revisionData`                (provided by [ember-cli-deploy-revision-data][3])

## Running Tests

- `npm test`

[1]: http://ember-cli.github.io/ember-cli-deploy/plugins "Plugin Documentation"
[2]: https://github.com/ember-cli-deploy/ember-cli-deploy-build "ember-cli-deploy-build"
[3]: https://github.com/ember-cli-deploy/ember-cli-deploy-revision-data "ember-cli-deploy-revision-data"
