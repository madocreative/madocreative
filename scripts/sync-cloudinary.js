#!/usr/bin/env node

const fs = require('fs/promises');
const { existsSync, readdirSync } = require('fs');
const path = require('path');
const dns = require('dns');
const dotenv = require('dotenv');
const { v2: cloudinary } = require('cloudinary');

dns.setDefaultResultOrder('ipv4first');

const envPaths = [
  path.join(process.cwd(), '.env.local'),
  path.join(process.cwd(), '.env'),
];

const vercelDir = path.join(process.cwd(), '.vercel');
if (existsSync(vercelDir)) {
  for (const fileName of readdirSync(vercelDir)) {
    if (fileName.endsWith('.local')) {
      envPaths.push(path.join(vercelDir, fileName));
    }
  }
}

for (const envPath of envPaths) {
  if (existsSync(envPath)) {
    dotenv.config({ path: envPath, override: false });
  }
}

const DEFAULT_PREFIX = 'mado-creatives';
const DEFAULT_OUT_DIR = path.join(process.cwd(), 'backups', 'cloudinary');
const RESOURCE_TYPES = ['image', 'video', 'raw'];

function parseArgs(argv) {
  const options = {
    prefix: DEFAULT_PREFIX,
    outDir: DEFAULT_OUT_DIR,
    types: [...RESOURCE_TYPES],
    max: null,
    dryRun: false,
  };

  for (const arg of argv) {
    if (arg.startsWith('--prefix=')) {
      options.prefix = arg.slice('--prefix='.length).trim() || DEFAULT_PREFIX;
      continue;
    }

    if (arg.startsWith('--out=')) {
      options.outDir = path.resolve(process.cwd(), arg.slice('--out='.length).trim());
      continue;
    }

    if (arg.startsWith('--types=')) {
      options.types = arg
        .slice('--types='.length)
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
      continue;
    }

    if (arg.startsWith('--max=')) {
      const parsed = Number(arg.slice('--max='.length));
      options.max = Number.isFinite(parsed) && parsed > 0 ? parsed : null;
      continue;
    }

    if (arg === '--dry-run') {
      options.dryRun = true;
    }
  }

  return options;
}

function ensureCloudinaryConfig() {
  const required = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ];

  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing Cloudinary env vars: ${missing.join(', ')}`);
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

function getAssetExtension(asset) {
  if (asset.format) {
    return String(asset.format).replace(/^\./, '');
  }

  try {
    const pathname = new URL(asset.secure_url).pathname;
    const ext = path.extname(pathname).replace(/^\./, '');
    return ext || 'bin';
  } catch {
    return 'bin';
  }
}

function getAssetOutputPath(asset, outDir) {
  const publicIdPath = asset.public_id.split('/').join(path.sep);
  const ext = getAssetExtension(asset);
  const resourceDir = path.join(outDir, asset.resource_type);

  return path.join(resourceDir, `${publicIdPath}.${ext}`);
}

async function listResources(resourceType, prefix, max) {
  const assets = [];
  let nextCursor;

  do {
    const remaining = max ? Math.max(max - assets.length, 0) : 500;
    if (remaining === 0) break;

    const response = await cloudinary.api.resources({
      type: 'upload',
      prefix,
      resource_type: resourceType,
      max_results: Math.min(500, remaining || 500),
      next_cursor: nextCursor,
      context: true,
      tags: true,
      metadata: true,
    });

    assets.push(...(response.resources || []));
    nextCursor = response.next_cursor;
  } while (nextCursor);

  return assets;
}

async function downloadAsset(asset, outDir) {
  const targetPath = getAssetOutputPath(asset, outDir);
  await fs.mkdir(path.dirname(targetPath), { recursive: true });

  const response = await fetch(asset.secure_url);
  if (!response.ok) {
    throw new Error(`Failed to download ${asset.secure_url}: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  await fs.writeFile(targetPath, Buffer.from(arrayBuffer));

  return targetPath;
}

async function writeManifest(outDir, manifest) {
  await fs.mkdir(outDir, { recursive: true });
  const manifestPath = path.join(outDir, 'manifest.json');
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  return manifestPath;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  ensureCloudinaryConfig();

  const manifest = {
    syncedAt: new Date().toISOString(),
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    prefix: options.prefix,
    outDir: options.outDir,
    dryRun: options.dryRun,
    assets: [],
    totals: {
      assetCount: 0,
      bytes: 0,
    },
  };

  console.log(`Cloudinary sync starting for prefix "${options.prefix}"`);
  console.log(`Output folder: ${options.outDir}`);
  if (options.dryRun) {
    console.log('Dry run enabled. No files will be downloaded.');
  }

  for (const resourceType of options.types) {
    if (!RESOURCE_TYPES.includes(resourceType)) {
      throw new Error(`Unsupported resource type "${resourceType}". Use image, video, or raw.`);
    }

    const resources = await listResources(resourceType, options.prefix, options.max);
    console.log(`Found ${resources.length} ${resourceType} asset(s).`);

    for (const asset of resources) {
      const localPath = getAssetOutputPath(asset, options.outDir);
      const entry = {
        resourceType: asset.resource_type,
        publicId: asset.public_id,
        folder: asset.folder || '',
        format: asset.format || null,
        bytes: asset.bytes || 0,
        secureUrl: asset.secure_url,
        createdAt: asset.created_at || null,
        localPath,
      };

      if (!options.dryRun) {
        await downloadAsset(asset, options.outDir);
      }

      manifest.assets.push(entry);
      manifest.totals.assetCount += 1;
      manifest.totals.bytes += entry.bytes;
      console.log(`${options.dryRun ? 'Planned' : 'Saved'} ${entry.publicId} -> ${entry.localPath}`);
    }
  }

  const manifestPath = await writeManifest(options.outDir, manifest);
  console.log(`Manifest written to ${manifestPath}`);
  console.log(`Finished ${options.dryRun ? 'planning' : 'syncing'} ${manifest.totals.assetCount} asset(s).`);
}

main().catch((error) => {
  console.error('Cloudinary sync failed.');
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exit(1);
});
