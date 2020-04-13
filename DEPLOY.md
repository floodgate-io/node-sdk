# Deployment Guide

1. Run tests

```bash
npm run test
```

2. Commit changes to Git

3. Create new package version number

```bash
npm version <patch | minor | major>
```

4. Build package

```bash
npm run build
```

5. Publish package to npmjs.com

```bash
npm publish --access public
```
