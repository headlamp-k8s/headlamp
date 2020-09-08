export default function loadScripts(array: string[], callback: () => void) {
  var loader = function(src: string, handler: () => void) {
    const script: HTMLScriptElement = document.createElement('script');
    script.src = src;
    script.onload = (script as any).onreadystatechange = function() {
      (script as any).onreadystatechange = script.onload = null;
      handler();
    };
    const head = document.getElementsByTagName('head')[0];
    (head || document.body).appendChild(script);
  };
  (function run() {
    if (array.length !== 0) {
      loader(array.shift() as string, run);
    } else {
      callback && callback();
    }
  })();
}

