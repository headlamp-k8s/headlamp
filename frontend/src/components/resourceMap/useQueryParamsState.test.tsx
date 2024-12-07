import { act, renderHook } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { useQueryParamsState } from './useQueryParamsState';

describe('useQueryParamsState', () => {
  it('should initialize with the initial state if no query param is present', () => {
    const history = createMemoryHistory();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Router history={history}>{children}</Router>
    );

    const { result } = renderHook(() => useQueryParamsState('test', 'initial'), { wrapper });

    expect(result.current[0]).toBe('initial');
    expect(history.length).toBe(1); // make sure it's replaced and not appended
  });

  it('should initialize with the query param value if present', () => {
    const history = createMemoryHistory();
    history.replace('?test=value');

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Router history={history}>{children}</Router>
    );

    const { result } = renderHook(() => useQueryParamsState('test', 'initial'), { wrapper });

    expect(result.current[0]).toBe('value');
    expect(history.length).toBe(1);
  });

  it('should update the query param value', () => {
    const history = createMemoryHistory();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Router history={history}>{children}</Router>
    );

    const { result } = renderHook(() => useQueryParamsState<string>('test', 'initial'), {
      wrapper,
    });

    act(() => {
      result.current[1]('new-value');
    });

    expect(history.location.search).toBe('?test=new-value');
    expect(result.current[0]).toBe('new-value');
    expect(history.length).toBe(2);
  });

  it('should remove the query param if the new value is undefined', () => {
    const history = createMemoryHistory();
    history.replace('?test=value');

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Router history={history}>{children}</Router>
    );

    const { result } = renderHook(() => useQueryParamsState('test', 'initial'), { wrapper });

    act(() => {
      result.current[1](undefined);
    });

    expect(history.location.search).toBe('');
    expect(result.current[0]).toBeUndefined();
    expect(history.length).toBe(2);
  });

  it('should replace the query param value if replace option is true', () => {
    const history = createMemoryHistory();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Router history={history}>{children}</Router>
    );

    const { result } = renderHook(() => useQueryParamsState<string>('test', 'initial'), {
      wrapper,
    });

    act(() => {
      result.current[1]('new-value', { replace: true });
    });

    expect(history.location.search).toBe('?test=new-value');
    expect(result.current[0]).toBe('new-value');
    expect(history.length).toBe(1);
  });
});
