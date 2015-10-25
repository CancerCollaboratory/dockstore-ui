# dockstore.ui

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.12.1.

## Grunt

See [this](http://blog.teamtreehouse.com/getting-started-with-grunt) guide for an intro to grunt.

## Build & development

Here's what I had to do to get this to work on my mac:

```
sudo npm install -g grunt
sudo npm install -g grunt-cli
npm install grunt --save-dev
npm install time-grunt
npm install
mkdir bower_components
bower install
sudo gem install compass
grunt
grunt serve
```

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.
