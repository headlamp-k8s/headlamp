---
title: Contributing to Internationalization
linkTitle: Contributing
---

This section introduces some concepts for contributing translations, and is
especially important when submitting a new language.

**Important:** If you are adding a new language, keep in mind that while all
the specific Kubernetes components' names are translatable, it doesn't mean
that all of them should have a corresponding name in your language. Please,
refer to the [Kubernetes localized docs](https://kubernetes.io/docs/home/) in
your language (if they exist) in order to understand which components should
be translated and which should be left in the original form.

## Namespaces

[i18next namespaces](https://www.i18next.com/principles/namespaces)
are useful to keep things modular.

We have a namespace for each app section, and also some frequently used global parts.

### Frequent, and Glossary namespaces

Additionally we have some global namespaces for frequently used and
jargony technical words.

- frequent.json, Phrases reused many times, eg. 'save', 'cancel'
- glossary.json, Reusing these consistently inside texts like jargon words (Pods)

#### Technical Jargon words

For some technical/jargon terms there often isn't a good translation for
them. To find these ones, it can be good to look at existing documentation
like the k8s docs.

The word "Pods" is a good example of a technical word that is used in Spanish.
Maybe it could directly translate to "Vainas", but "Pods" is used instead.

- https://kubernetes.io/es/docs/concepts/workloads/pods/pod/
- https://kubernetes.io/docs/concepts/workloads/pods/pod/

## Number formatting

Numbers are formatted in a locale specific way. For example in 'en'
they are formatted like `1,000,000` but with 'de' they are formatted
like `1.000.000`.

Here is an example which can use number formatting:


```JavaScript
    return t('cluster:{{numReady, number}} / {{numItems, number}} Requested', {
      numReady: podsReady.length,
      numItems: items.length,
    });
```

Number formatting is being done with [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat).

## Date formatting

Here's an example of using date formatting:

```Javascript
    return t('appsection:When {{ date, date }}', {
      date: new Date(),
    });
```

## Adding a new component.

First choose the namespace (common, cluster, etc).
Then add a file for 'en' first. This is the fallback language.

See the src/i18n/locales/en/ folder for a complete list of namespaces.

## Adding a new language.

Create a folder using the locale code here: `src/i18n/locales/`.

Then run `make i18n`. This command parses the translatable strings in
the project and creates the corresponding catalog files.

Integrated components may need to be adjusted (MaterialUI/Monaco etc).

## Material UI

Some Material UI components are localized, and are configured
via a theme provider.

See the Material UI
[Localization Guide](https://material-ui.com/guides/localization/),
and also `src/i18n/ThemeProviderNexti18n.tsx` where integration is done.

## Storybook integration

TODO: not implmented. There's no working addons that let you set a language easily.

## Monaco editor integration

See `src/components/common/Resource/EditorDialog.tsx`

Note, that Monaco editor does not support pt, ta and other languages.
