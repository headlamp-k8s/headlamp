import helpers from './index';

describe('getAppUrl', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const windowSpy = jest.spyOn(window, 'window', 'get') as jest.MockInstance<any, any>;

  test('dev mode', () => {
    jest.spyOn(helpers, 'isDevMode').mockImplementation(() => true);
    jest.spyOn(helpers, 'isElectron').mockImplementation(() => false);
    expect(helpers.getAppUrl()).toBe('http://localhost:4466/');
  });
  test('dev mode and isElectron', () => {
    jest.spyOn(helpers, 'isDevMode').mockImplementation(() => true);
    jest.spyOn(helpers, 'isElectron').mockImplementation(() => true);
    expect(helpers.getAppUrl()).toBe('http://localhost:4466/');
  });
  test('isElectron, not dev mode', () => {
    jest.spyOn(helpers, 'isDevMode').mockImplementation(() => false);
    jest.spyOn(helpers, 'isElectron').mockImplementation(() => true);
    expect(helpers.getAppUrl()).toBe('http://localhost:4466/');
  });

  test('base-url is set through headlampBaseUrl variable', () => {
    jest.spyOn(helpers, 'isDevMode').mockImplementation(() => true);
    jest.spyOn(helpers, 'isElectron').mockImplementation(() => false);

    windowSpy.mockImplementation(() => ({
      headlampBaseUrl: '/headlamp',
    }));
    expect(helpers.getAppUrl()).toBe('http://localhost:4466/headlamp/');
  });

  test('isElectron does not use a base-url set', () => {
    jest.spyOn(helpers, 'isDevMode').mockImplementation(() => false);
    jest.spyOn(helpers, 'isElectron').mockImplementation(() => true);

    windowSpy.mockImplementation(() => ({
      headlampBaseUrl: '/headlamp',
    }));
    expect(helpers.getAppUrl()).toBe('http://localhost:4466/');
  });

  test('base-url is used without dev mode and without isElectron, uses window.location.origin', () => {
    jest.spyOn(helpers, 'isDevMode').mockImplementation(() => false);
    jest.spyOn(helpers, 'isElectron').mockImplementation(() => false);

    windowSpy.mockImplementation(() => ({
      headlampBaseUrl: '/headlamp',
      location: {
        origin: 'http://example.com:4466',
      },
    }));
    expect(helpers.getAppUrl()).toBe('http://example.com:4466/headlamp/');
  });

  test('When headlampBaseUrl is set to "." it uses no base-url', () => {
    // This can happen with the Create React App build process which optimizes the "./" to "."
    jest.spyOn(helpers, 'isDevMode').mockImplementation(() => false);
    jest.spyOn(helpers, 'isElectron').mockImplementation(() => false);

    windowSpy.mockImplementation(() => ({
      headlampBaseUrl: '.',
      location: {
        origin: 'http://example.com:4466',
      },
    }));
    expect(helpers.getAppUrl()).toBe('http://example.com:4466/');
  });
});
