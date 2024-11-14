import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import HelloWorldViewVue from './HelloWorld.view.vue';

describe('HelloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount(HelloWorldViewVue, { props: { msg: 'Hello Vitest' } });
    expect(wrapper.text()).toContain('Hello Vitest');
  });
});
