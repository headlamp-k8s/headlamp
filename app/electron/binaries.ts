import { execSync } from 'child_process';
import crypto from 'crypto';
import { app } from 'electron';
import fs from 'fs';
import https from 'https';
import path from 'path';
import { pipeline } from 'stream';
import { extract as tarExtract } from 'tar';
import { promisify } from 'util';
import { createGunzip } from 'zlib';

// Helper to handle async/await for streams
const streamPipeline = promisify(pipeline);

/**
 * Interface for a versioned binary manifest
 */
export interface BinaryManifest {
  /** The name of the binary */
  name: string;
  /** The display name of the binary (for user interfaces) */
  displayName: string;
  /** Current version of the binary */
  version: string;
  /** URL templates for different platforms - use {version} as placeholder */
  urls: {
    /** URL for Windows platform */
    win?: {
      /** Download information for x64 architecture */
      x64?: {
        /** URL for Intel architecture */
        url: string;
        /** SHA256 checksum for the binary */
        checksum?: string;
      };
      /** Download information for ARM architecture */
      arm64?: {
        /** URL for ARM architecture */
        url: string;
        /** SHA256 checksum for the binary */
        checksum?: string;
      };
    };
    /** URL for macOS platform */
    mac?: {
      /** Download information for x64 architecture */
      x64?: {
        /** URL for Intel architecture */
        url: string;
        /** SHA256 checksum for the binary */
        checksum?: string;
      };
      /** Download information for ARM architecture */
      arm64?: {
        /** URL for ARM architecture */
        url: string;
        /** SHA256 checksum for the binary */
        checksum?: string;
      };
    };
    /** URL for Linux platform */
    linux?: {
      /** Download information for x64 architecture */
      x64?: {
        /** URL for Intel architecture */
        url: string;
        /** SHA256 checksum for the binary */
        checksum?: string;
      };
      /** Download information for ARM architecture */
      arm64?: {
        /** URL for ARM architecture */
        url: string;
        /** SHA256 checksum for the binary */
        checksum?: string;
      };
      /** Download information for ARMv7 architecture */
      armv7l?: {
        /** URL for ARMv7 architecture */
        url: string;
        /** SHA256 checksum for the binary */
        checksum?: string;
      };
    };
  };
  /** Additional files that should be extracted from archives */
  additionalFiles?: string[];
  /** Path to the binary within the extracted archive */
  pathInArchive?: string;
  /** Is the download an archive that needs extraction? */
  isArchive?: boolean;
  /** Archive type (supported: 'tar.gz', 'zip') */
  archiveType?: 'tar.gz' | 'zip';
  /** Custom installation function if standard installation doesn't work */
  customInstall?: (
    downloadPath: string,
    installPath: string,
    platform: string,
    arch: string
  ) => Promise<boolean>;
}

/**
 * Known binary manifests
 */
export const BINARY_MANIFESTS: { [key: string]: BinaryManifest } = {
  minikube: {
    name: 'minikube',
    displayName: 'Minikube',
    version: 'v1.32.0',
    urls: {
      win: {
        x64: {
          url: 'https://github.com/kubernetes/minikube/releases/download/{version}/minikube-windows-amd64.exe',
          checksum: '25650839f34526ee0f85fd4faa2d5b327f6127caac3de82e1f905adc3aad29df',
        },
        arm64: {
          url: 'https://github.com/kubernetes/minikube/releases/download/{version}/minikube-windows-arm64.exe',
        },
      },
      mac: {
        x64: {
          url: 'https://github.com/kubernetes/minikube/releases/download/{version}/minikube-darwin-amd64',
          checksum: 'c905fb3900fb91c97bf994640cdb651e879022d17861f2a391d7cc10d9e48976',
        },
        arm64: {
          url: 'https://github.com/kubernetes/minikube/releases/download/{version}/minikube-darwin-arm64',
          checksum: '2dcc8e680d123a9950edd7cb3f87f2244b1d6e27d326aac32396b9879b2f809e',
        },
      },
      linux: {
        x64: {
          url: 'https://github.com/kubernetes/minikube/releases/download/{version}/minikube-linux-amd64',
          checksum: '1acbb6e0358264a3acd5e1dc081de8d31c697d5b4309be21cba5587cd59eabb3',
        },
        arm64: {
          url: 'https://github.com/kubernetes/minikube/releases/download/{version}/minikube-linux-arm64',
          checksum: '43ebbe2bde03cddcdd71f8287e51497380ec5e0f2a4897283a08c237c4340307',
        },
        armv7l: {
          url: 'https://github.com/kubernetes/minikube/releases/download/{version}/minikube-linux-arm',
          checksum: 'f400ae7157b1d29e84c11f39e844f86383e6a460c2c864d1a9af6b2ada17073f',
        },
      },
    },
  },
  kubectl: {
    name: 'kubectl',
    displayName: 'kubectl',
    version: 'v1.32.2',
    urls: {
      win: {
        x64: {
          url: 'https://dl.k8s.io/release/{version}/bin/windows/amd64/kubectl.exe',
          checksum: '3fd1576a902ecf713f7d6390ae01799e370883e0341177ee09dbdc362db953e3',
        },
      },
      mac: {
        x64: {
          url: 'https://dl.k8s.io/release/{version}/bin/darwin/amd64/kubectl',
          checksum: 'b814c523071cd09e27c88d8c87c0e9b054ca0cf5c2b93baf3127750a4f194d5b',
        },
        arm64: {
          url: 'https://dl.k8s.io/release/{version}/bin/darwin/arm64/kubectl',
          checksum: 'a110af64fc31e2360dd0f18e4110430e6eedda1a64f96e9d89059740a7685bbd',
        },
      },
      linux: {
        x64: {
          url: 'https://dl.k8s.io/release/{version}/bin/linux/amd64/kubectl',
          checksum: 'ab209d0c5134b61486a0486585604a616a5bb2fc07df46d304b3c95817b2d79f',
        },
        arm64: {
          url: 'https://dl.k8s.io/release/{version}/bin/linux/arm64/kubectl',
          checksum: '6c2c91e760efbf3fa111a5f0b99ba8975fb1c58bb3974eca88b6134bcf3717e2',
        },
        armv7l: {
          url: 'https://dl.k8s.io/release/{version}/bin/linux/arm/kubectl',
          checksum: 'f990c878e54e5fac82eac7398ef643acca9807838b19014f1816fa9255b2d3d9',
        },
      },
    },
    // Note: checksums should be updated when changing versions
  },
};

/**
 * Binary manager for handling downloads and installations of binaries
 */
export class BinaryManager {
  private binDirectory: string;

  /**
   * Create a new binary manager
   */
  constructor() {
    // Store binaries in the user data directory
    this.binDirectory = path.join(app.getPath('userData'), 'external-tools', 'bin');
    this.ensureBinDirectoryExists();
  }

  /**
   * Ensure the binary directory exists
   */
  private ensureBinDirectoryExists(): void {
    if (!fs.existsSync(this.binDirectory)) {
      fs.mkdirSync(this.binDirectory, { recursive: true });
    }
  }

  /**
   * Get the binary directory path
   * @returns The path to the binary directory
   */
  public getBinDirectory(): string {
    return this.binDirectory;
  }

  /**
   * Check if a binary is installed
   * @param name The name of the binary
   * @returns True if the binary is installed, false otherwise
   */
  public isBinaryInstalled(name: string): boolean {
    const binaryPath = this.getBinaryPath(name);
    let isInstalled = fs.existsSync(binaryPath);

    if (!isInstalled) {
      // Check if the binary is in the system PATH
      isInstalled = this.isBinaryInSystemPath(name);
    }

    return isInstalled;
  }

  /**
   * Check if a binary is installed
   * @param name The name of the binary
   * @returns True if the binary is installed, false otherwise
   */
  public isBinaryInstalledByHeadlamp(name: string): boolean {
    const binaryPath = this.getBinaryFromHeadlampPath(name);
    return fs.existsSync(binaryPath);
  }

  /**
   * Get the path to a binary
   * @param name The name of the binary
   * @returns The path to the binary
   */
  public getBinaryPath(name: string): string {
    const exeSuffix = process.platform === 'win32' ? '.exe' : '';
    return path.join(this.binDirectory, `${name}${exeSuffix}`);
  }

  /**
   * Get the path to a binary that Headlamp has installed.
   * @param name The name of the binary
   * @returns The path to the binary
   */
  public getBinaryFromHeadlampPath(name: string): string {
    const exeSuffix = process.platform === 'win32' ? '.exe' : '';
    return path.join(this.binDirectory, `${name}${exeSuffix}`);
  }

  /**
   * Get the URL for a binary based on the current platform and architecture
   * @param manifest The binary manifest
   * @returns The URL for the binary or null if not available for this platform
   */
  private getBinaryUrl(manifest: BinaryManifest): string | null {
    const platform = process.platform;
    const arch = process.arch;

    let urlData: { url: string; checksum?: string } | undefined;

    if (platform === 'win32' && manifest.urls.win) {
      urlData = manifest.urls.win[arch as 'x64' | 'arm64'];
    } else if (platform === 'darwin' && manifest.urls.mac) {
      urlData = manifest.urls.mac[arch as 'x64' | 'arm64'];
    } else if (platform === 'linux' && manifest.urls.linux) {
      urlData = manifest.urls.linux[arch as 'x64' | 'arm64' | 'armv7l'];
    }

    if (!urlData || !urlData.url) {
      return null;
    }

    return urlData.url.replace('{version}', manifest.version);
  }

  /**
   * Get the checksum for a binary based on the current platform and architecture
   * @param manifest The binary manifest
   * @returns The checksum for the binary or null if not available
   */
  private getBinaryChecksum(manifest: BinaryManifest): string | undefined {
    const platform = process.platform;
    const arch = process.arch;

    let urlData: { url: string; checksum?: string } | undefined;

    if (platform === 'win32' && manifest.urls.win) {
      urlData = manifest.urls.win[arch as 'x64' | 'arm64'];
    } else if (platform === 'darwin' && manifest.urls.mac) {
      urlData = manifest.urls.mac[arch as 'x64' | 'arm64'];
    } else if (platform === 'linux' && manifest.urls.linux) {
      urlData = manifest.urls.linux[arch as 'x64' | 'arm64' | 'armv7l'];
    }

    return urlData?.checksum;
  }

  /**
   * Download a binary
   * @param manifest The binary manifest
   * @returns Promise resolving to the path of the downloaded file
   */
  public async downloadBinary(manifest: BinaryManifest): Promise<string> {
    const url = this.getBinaryUrl(manifest);
    if (!url) {
      throw new Error(`No URL available for ${manifest.name} on this platform and architecture`);
    }

    // Create temp directory for downloads if it doesn't exist
    const tempDir = path.join(app.getPath('temp'), 'headlamp-downloads');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Determine file extension
    const urlPath = new URL(url).pathname;
    const extension = path.extname(urlPath) || (process.platform === 'win32' ? '.exe' : '');

    const downloadPath = path.join(tempDir, `${manifest.name}-${manifest.version}${extension}`);

    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(downloadPath);

      const handleResponse = (response: any) => {
        console.log(`Downloading ${manifest.name} from ${url}...`);
        // Handle redirects
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          console.log(`Following redirect from ${url} to ${response.headers.location}`);

          // Create a new request to the redirect URL
          const redirectRequest = response.headers.location.startsWith('https://')
            ? https.get(response.headers.location, handleResponse)
            : https.get(url, handleResponse); // If relative URL, stick with original base

          redirectRequest.on('error', reject);
          return;
        }

        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download ${manifest.name}: ${response.statusCode}`));
          return;
        }

        streamPipeline(response, file)
          .then(() => resolve(downloadPath))
          .catch(err => {
            // Try to delete the file if it failed
            try {
              fs.unlinkSync(downloadPath);
            } catch (e) {
              console.warn(`Failed to delete incomplete download: ${downloadPath}`);
            }
            reject(err);
          });
      };

      https.get(url, handleResponse).on('error', err => {
        // Try to delete the file if it failed
        try {
          file.close();
          fs.unlinkSync(downloadPath);
        } catch (e) {
          console.warn(`Failed to delete incomplete download: ${downloadPath}`);
        }
        reject(err);
      });
    });
  }

  /**
   * Verify the binary checksum
   * @param filePath Path to the binary file
   * @param manifest The binary manifest
   * @returns Promise resolving to true if checksum matches, false otherwise
   */
  public async verifyChecksum(filePath: string, manifest: BinaryManifest): Promise<boolean> {
    const expectedChecksum = this.getBinaryChecksum(manifest);

    if (!expectedChecksum) {
      // No checksums available, skip verification
      console.warn(
        `No checksum available for ${manifest.name} on ${process.platform}-${process.arch}; continuing...`
      );
      return true;
    }

    return new Promise<boolean>((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);

      stream.on('error', reject);
      stream.on('data', chunk => hash.update(chunk));
      stream.on('end', () => {
        const fileChecksum = hash.digest('hex');
        console.log(`Checksum for ${manifest.name}: ${fileChecksum}`);
        if (fileChecksum !== expectedChecksum) {
          console.error(
            `Checksum mismatch for ${manifest.name}: expected ${expectedChecksum}, got ${fileChecksum}`
          );
          resolve(false);
        } else {
          console.log(`Checksum verified for ${manifest.name}`);
          resolve(true);
        }
      });
    });
  }

  /**
   * Install a binary from a downloaded file
   * @param downloadPath Path to the downloaded binary
   * @param manifest The binary manifest
   * @returns Promise resolving to the installed binary path
   */
  public async installBinary(downloadPath: string, manifest: BinaryManifest): Promise<string> {
    const destPath = this.getBinaryPath(manifest.name);

    // If custom install is provided, use it
    if (manifest.customInstall) {
      const success = await manifest.customInstall(
        downloadPath,
        destPath,
        process.platform,
        process.arch
      );

      if (!success) {
        throw new Error(`Custom installation of ${manifest.name} failed`);
      }

      return destPath;
    }

    // Handle archive extraction if needed
    if (manifest.isArchive) {
      switch (manifest.archiveType) {
        case 'tar.gz':
          await this.extractTarGz(downloadPath, manifest);
          break;
        case 'zip':
          // For future implementation
          throw new Error('ZIP extraction not yet implemented');
        default:
          throw new Error(`Unsupported archive type for ${manifest.name}`);
      }
      return destPath;
    }

    // Simple file copy for direct binaries
    fs.copyFileSync(downloadPath, destPath);

    // Make the binary executable on UNIX systems
    if (process.platform !== 'win32') {
      fs.chmodSync(destPath, 0o755);
    }

    return destPath;
  }

  /**
   * Extract a tar.gz file
   * @param archivePath Path to the tar.gz file
   * @param manifest The binary manifest
   */
  private async extractTarGz(archivePath: string, manifest: BinaryManifest): Promise<void> {
    const tempDir = path.join(app.getPath('temp'), `headlamp-extract-${Date.now()}`);

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Extract the archive
    try {
      const sourceStream = fs.createReadStream(archivePath);
      const gunzip = createGunzip();

      await new Promise<void>((resolve, reject) => {
        sourceStream
          .pipe(gunzip)
          .pipe(tarExtract({ cwd: tempDir }))
          .on('error', reject)
          .on('end', resolve);
      });

      // If pathInArchive is specified, use it to locate the binary
      if (manifest.pathInArchive) {
        let binaryPath = manifest.pathInArchive;

        // Replace platform and arch placeholders
        binaryPath = binaryPath
          .replace('{platform}', process.platform === 'win32' ? 'windows' : process.platform)
          .replace('{arch}', process.arch);

        const sourcePath = path.join(tempDir, binaryPath);
        const destPath = this.getBinaryPath(manifest.name);

        if (!fs.existsSync(sourcePath)) {
          console.warn(
            `Binary not found at expected path: ${sourcePath}, attempting to search for it`
          );

          // Try to find the binary by traversing the directory
          const foundFile = this.findBinaryInDirectory(tempDir, manifest.name);
          if (foundFile) {
            console.log(`Found binary at: ${foundFile}`);
            fs.copyFileSync(foundFile, destPath);
          } else {
            throw new Error(`Binary not found in archive: ${sourcePath}`);
          }
        } else {
          fs.copyFileSync(sourcePath, destPath);
        }

        // Make the binary executable on UNIX systems
        if (process.platform !== 'win32') {
          fs.chmodSync(destPath, 0o755);
        }
      }

      // Copy any additional files specified in the manifest
      if (manifest.additionalFiles) {
        for (const additionalFile of manifest.additionalFiles) {
          const sourcePath = path.join(tempDir, additionalFile);
          const destPath = path.join(this.binDirectory, path.basename(additionalFile));

          if (fs.existsSync(sourcePath)) {
            fs.copyFileSync(sourcePath, destPath);
          }
        }
      }
    } finally {
      // Clean up the temporary directory
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    }
  }

  /**
   * Find a binary in a directory by recursively traversing it
   * @param dir Directory to search
   * @param binaryName Name of the binary to find
   * @returns Path to the binary if found, null otherwise
   */
  private findBinaryInDirectory(dir: string, binaryName: string): string | null {
    const exeSuffix = process.platform === 'win32' ? '.exe' : '';
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        const foundInSubdir = this.findBinaryInDirectory(itemPath, binaryName);
        if (foundInSubdir) {
          return foundInSubdir;
        }
      } else if (item === binaryName || item === `${binaryName}${exeSuffix}`) {
        return itemPath;
      }
    }

    return null;
  }

  /**
   * Download and install a binary
   * @param name The name of the binary
   * @param force Force reinstall even if already installed
   * @returns Promise resolving to true if installation was successful
   */
  public async installBinaryByName(name: string, force: boolean = false): Promise<boolean> {
    const manifest = BINARY_MANIFESTS[name];

    if (!manifest) {
      throw new Error(`Unknown binary: ${name}`);
    }

    // Check if already installed
    if (this.isBinaryInstalledByHeadlamp(name) && !force) {
      return true;
    }

    try {
      // Download the binary
      console.log(`Downloading ${manifest.displayName}...`);
      const downloadPath = await this.downloadBinary(manifest);

      // Verify checksum if available
      const checksumAvailable = this.getBinaryChecksum(manifest);
      if (checksumAvailable) {
        console.log(`Verifying checksum for ${manifest.displayName}...`);
        const checksumValid = await this.verifyChecksum(downloadPath, manifest);

        if (!checksumValid) {
          throw new Error(`Checksum verification failed for ${manifest.name}`);
        }
      }

      // Install the binary
      console.log(`Installing ${manifest.displayName}...`);
      await this.installBinary(downloadPath, manifest);

      // Clean up the downloaded file
      try {
        fs.unlinkSync(downloadPath);
      } catch (err) {
        console.warn(`Failed to delete temporary download: ${downloadPath}`, err);
      }

      return true;
    } catch (error) {
      console.error(`Failed to install ${manifest.displayName}:`, error);
      return false;
    }
  }

  /**
   * Uninstall a binary
   * @param name The name of the binary to uninstall
   * @returns Promise resolving to true if uninstallation was successful
   */
  public async uninstallBinaryByName(name: string): Promise<boolean> {
    const manifest = BINARY_MANIFESTS[name];

    if (!manifest) {
      throw new Error(`Unknown binary: ${name}`);
    }

    // Check if it's installed
    if (!this.isBinaryInstalledByHeadlamp(name)) {
      return true; // Already not installed
    }

    try {
      const binaryPath = this.getBinaryPath(name);

      // Delete the binary file
      fs.unlinkSync(binaryPath);

      console.log(`Successfully uninstalled ${manifest.displayName}`);
      return true;
    } catch (error) {
      console.error(`Failed to uninstall ${manifest.displayName}:`, error);
      return false;
    }
  }

  /**
   * Check if a binary is available in the system PATH
   * @param name The name of the binary
   * @returns True if the binary is found in PATH, false otherwise
   */
  public isBinaryInSystemPath(name: string): boolean {
    try {
      if (process.platform === 'win32') {
        // In Windows, use where command to find executables in PATH
        execSync(`where ${name}`, { stdio: 'ignore' });
      } else {
        // In Unix-like systems, use which command
        execSync(`which ${name}`, { stdio: 'ignore' });
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get the path to the system binary
   * @param name The name of the binary
   * @returns The path to the binary in system or null if not found
   */
  public getSystemBinaryPath(name: string): string | null {
    try {
      let output: string;
      if (process.platform === 'win32') {
        // In Windows, use where command to find executables in PATH
        output = execSync(`where ${name}`).toString().trim();
      } else {
        // In Unix-like systems, use which command
        output = execSync(`which ${name}`).toString().trim();
      }

      // Return the first line (first match) if there are multiple
      return output.split(/\r?\n/)[0];
    } catch (error) {
      return null;
    }
  }

  /**
   * Check version of a system binary
   * @param name The name of the binary
   * @returns The version string or null if can't determine
   */
  public getSystemBinaryVersion(name: string): string | null {
    try {
      // Common version flag patterns
      const versionFlags = ['--version', '-v', 'version'];

      for (const flag of versionFlags) {
        try {
          const output = execSync(`${name} ${flag}`, { timeout: 2000 }).toString().trim();
          // Extract version pattern (typically looks like v1.2.3 or 1.2.3)
          const versionMatch = output.match(/v?(\d+\.\d+\.\d+)/i);
          if (versionMatch) {
            return versionMatch[0];
          }

          // If we got output but couldn't parse a version, just return the first line
          if (output) {
            return output.split(/\r?\n/)[0].substring(0, 20); // Limit length
          }
        } catch (err) {
          // Try next flag
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get available binaries for the current platform with system status
   * @returns Array of available binary manifests with additional status
   */
  public getAvailableBinaries(): (BinaryManifest & {
    installed: boolean;
    headlampInstalled: boolean;
    systemInstalled?: boolean;
    systemPath?: string;
    systemVersion?: string;
  })[] {
    const platform = process.platform;
    const arch = process.arch;

    const availableBinaries = Object.values(BINARY_MANIFESTS).filter(manifest => {
      if (platform === 'win32' && manifest.urls.win && manifest.urls.win[arch as 'x64' | 'arm64']) {
        return true;
      }
      if (
        platform === 'darwin' &&
        manifest.urls.mac &&
        manifest.urls.mac[arch as 'x64' | 'arm64']
      ) {
        return true;
      }
      if (
        platform === 'linux' &&
        manifest.urls.linux &&
        manifest.urls.linux[arch as 'x64' | 'arm64' | 'armv7l']
      ) {
        return true;
      }
      return false;
    });

    // Enhance with installation status
    return availableBinaries.map(binary => {
      const isHeadlampInstalled = this.isBinaryInstalledByHeadlamp(binary.name);
      const isInSystemPath = this.isBinaryInSystemPath(binary.name);
      const isInstalled = isHeadlampInstalled || isInSystemPath;

      const enhanced: {
        name: string;
        displayName: string;
        version: string;
        installed: boolean;
        headlampInstalled: boolean;
        systemInstalled?: boolean;
        systemPath?: string;
        systemVersion?: string;
      } & BinaryManifest = {
        ...binary,
        installed: isInstalled,
        headlampInstalled: isHeadlampInstalled,
      };

      // Only add system info if it's found in the system
      if (isInSystemPath) {
        enhanced.systemInstalled = true;
        enhanced.systemPath = this.getSystemBinaryPath(binary.name) ?? undefined;
        enhanced.systemVersion = this.getSystemBinaryVersion(binary.name) ?? undefined;
      }

      return enhanced;
    });
  }
}

/**
 * Global instance of the binary manager
 */
export const binaryManager = new BinaryManager();
