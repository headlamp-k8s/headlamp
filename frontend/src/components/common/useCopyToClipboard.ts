/*
 * Copyright 2025 The Kubernetes Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useEffect, useRef, useState } from 'react';

/**
 * Internal sentinel error: the async text supplier resolved to nothing
 * copyable, so the in-flight clipboard write must be abandoned without
 * touching the clipboard and without surfacing an error to the caller.
 */
class NothingToCopyError extends Error {
  constructor() {
    super('Nothing to copy');
  }
}

/**
 * Copy-to-clipboard behavior shared by CopyButton and menu-style call sites
 * (e.g. the mobile cluster menu in TopBar, which must render a single
 * MenuItem rather than nesting one component inside another).
 *
 * This lives in its own module, outside the components/common/Resource barrel,
 * so it is NOT part of window.pluginLib: it is an internal sharing point, not
 * a supported plugin API. Import it directly from here.
 */
export function useCopyToClipboard(
  text: string | (() => Promise<string | null | undefined>) | undefined,
  callbacks?: { onCopied?: () => void; onError?: (err: unknown) => void }
): { copied: boolean; copy: () => Promise<void> } {
  const [copied, setCopied] = useState(false);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => clearTimeout(resetTimeoutRef.current);
  }, []);

  function reportSuccess() {
    setCopied(true);
    callbacks?.onCopied?.();
    resetTimeoutRef.current = setTimeout(() => setCopied(false), 1500);
  }

  async function copy() {
    clearTimeout(resetTimeoutRef.current);

    const textPromise: Promise<string | null> =
      typeof text === 'function'
        ? Promise.resolve(text()).then(t => t || null)
        : Promise.resolve(text || null);

    // Safari (a supported platform per docs/platforms.md) requires the
    // clipboard operation to *start* while the click's user activation is
    // still live. When `text` is async (backend-backed copies await IndexedDB
    // and a network request), awaiting it before writeText() starts the write
    // too late and Safari rejects with NotAllowedError. ClipboardItem accepts
    // a promise for the blob, so write() can start synchronously in the click
    // handler while the text is still being resolved.
    if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
      let nothingToCopy = false;
      const blobPromise = textPromise.then(t => {
        if (!t) {
          // Reject rather than write an empty Blob: an empty write would
          // clobber whatever the user already has on the clipboard, and the
          // documented behavior for missing content is a silent no-op.
          nothingToCopy = true;

          throw new NothingToCopyError();
        }

        return new Blob([t], { type: 'text/plain' });
      });
      // The rejection is surfaced through clipboard.write() below; mark it
      // handled so no unhandled-rejection noise appears if write() resolves
      // without consuming the promise (non-spec implementations/tests).
      blobPromise.catch(() => undefined);

      try {
        await navigator.clipboard.write([new ClipboardItem({ 'text/plain': blobPromise })]);
        reportSuccess();
      } catch (err) {
        if (nothingToCopy || err instanceof NothingToCopyError) {
          return;
        }
        setCopied(false);
        console.error('Failed to copy to clipboard:', err);
        callbacks?.onError?.(err);
      }
      return;
    }

    // Environments without ClipboardItem (jsdom, older browsers): the write
    // still follows the click closely enough there.
    try {
      const copyText = await textPromise;
      if (!copyText) {
        return;
      }
      await navigator.clipboard.writeText(copyText);
      reportSuccess();
    } catch (err) {
      setCopied(false);
      console.error('Failed to copy to clipboard:', err);
      callbacks?.onError?.(err);
    }
  }

  return { copied, copy };
}
