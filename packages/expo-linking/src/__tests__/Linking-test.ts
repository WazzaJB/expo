import Constants, { ExecutionEnvironment } from 'expo-constants';

import * as Linking from '../Linking';
import { QueryParams } from '../Linking.types';

describe('parse', () => {
  test.each<string>([
    'exp://127.0.0.1:19000/',
    'exp://127.0.0.1:19000/--/test/path?query=param',
    'exp://127.0.0.1:19000?query=param',
    'exp://exp.host/@test/test/--/test/path?query=param',
    'exp://exp.host/@test/test/--/test/path',
    'https://example.com/test/path?query=param',
    'https://example.com/test/path',
    'https://example.com:8000/test/path',
    'https://example.com:8000/test/path+with+plus',
    'https://example.com/test/path?query=do+not+escape',
    'https://example.com/test/path?missingQueryValue=',
    'custom:///?shouldBeEscaped=x%252By%2540xxx.com',
    'custom:///test/path?foo=bar',
    'custom:///',
    'custom://',
    'custom://?hello=bar',
    'invalid',
  ])(`parses %p`, url => {
    expect(Linking.parse(url)).toMatchSnapshot();
  });
});

describe(Linking.createURL, () => {
  const consoleWarn = console.warn;
  const manifest = Constants.__rawManifest_TEST;
  const executionEnvironment = Constants.executionEnvironment;
  describe('queries', () => {
    beforeEach(() => {
      console.warn = jest.fn();
      Constants.executionEnvironment = ExecutionEnvironment.StoreClient;
      Constants.__rawManifest_TEST = {
        ...Constants.__rawManifest_TEST,
        scheme: 'demo',
      };
    });

    afterEach(() => {
      console.warn = consoleWarn;
      Constants.executionEnvironment = executionEnvironment;
      Constants.__rawManifest_TEST = manifest;
    });

    test.each<QueryParams>([
      { shouldEscape: '%2b%20' },
      { escapePluses: 'email+with+plus@whatever.com' },
      { emptyParam: '' },
      { undefinedParam: undefined },
      { lotsOfSlashes: '/////' },
    ])(`makes url %p`, queryParams => {
      expect(Linking.createURL('some/path', { queryParams })).toMatchSnapshot();
    });

    test.each<string>(['path/into/app', ''])(`makes url %p`, path => {
      expect(Linking.createURL(path)).toMatchSnapshot();
    });
  });
  describe('bare', () => {
    beforeEach(() => {
      console.warn = jest.fn();
      Constants.executionEnvironment = ExecutionEnvironment.Bare;
      Constants.__rawManifest_TEST = {
        ...Constants.__rawManifest_TEST,
        hostUri: null,
        scheme: 'demo',
      };
    });

    afterEach(() => {
      console.warn = consoleWarn;
      Constants.executionEnvironment = executionEnvironment;
      Constants.__rawManifest_TEST = manifest;
    });

    test.each<QueryParams>([
      { shouldEscape: '%2b%20' },
      { escapePluses: 'email+with+plus@whatever.com' },
      { emptyParam: '' },
      { undefinedParam: undefined },
      { lotsOfSlashes: '/////' },
    ])(`makes url %p`, queryParams => {
      expect(Linking.createURL('some/path', { queryParams })).toMatchSnapshot();
    });

    test.each<string>(['path/into/app', ''])(`makes url %p`, path => {
      expect(Linking.createURL(path)).toMatchSnapshot();
    });

    it(`uses triple slashes`, () => {
      expect(Linking.createURL('some/path', { isTripleSlashed: true })).toMatchSnapshot();
    });
  });
});
