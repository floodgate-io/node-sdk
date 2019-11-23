# Deployment Guide

1. Commit changes to Git

2. Create new package version number

```
npm version <patch | minor | major>
```
3. Build package

```
npm run build
```

4. Publish package to npmjs.com

```
npm publish --access public
```