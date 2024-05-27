# quartz-builder

This is a dowstream fork of the quartz website builder.

This fork does the following:

- Provides a convenient way to build quartz vaults 'out-of-tree' (i.e. not needing the quartz source tree cloned or placing your notebook in the `content` directory).

- Automatically builds a public Docker image for every tagged release of Quartz.

- Supplies a means of overriding the quartz config files from within your obsidian vault (`.obsidian/quartz/quartz.config|layout.ts`).

Build the docs using the following command:

```bash
docker run -v ./<VAULT_DIR>:/in -v ./<OUTPUT_DIR>:/out bojit/quartz:latest build
```

Run dev mode using the following command:

```bash
docker run -v ./<VAULT_DIR>:/in -v ./<OUTPUT_DIR>:/out -p 8080:8080 -p 3001:3001 -it bojit/quartz:latest build --serve
```

## Rebuilding the image

The builder files are layed out deliberately to avoid conflicts with upstream default branch activity. As such, the build command is a little strange.

```bash
docker build -t quartz -f builder/Dockerfile .
```
