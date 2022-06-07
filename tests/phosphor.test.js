const phosphor = require('./../src/phosphor');
const vue = require("vue");

jest.mock('vue');

const counter = {
   template: 'template 1',
   $: {
      type: {
         name: 'Counter'
      }
   }
};

const counterNoCache = {
   template: 'template 2',
   noCache: true,
   $: {
      type: {
         name: 'Counter'
      }
   }
};

test('Props as object are added to component when not provided', () => {
   const renderFunction = jest.fn(function () {});
   vue.compile.mockReturnValue(renderFunction);
   const component = phosphor(counter);
   expect(component.props).toEqual({
      template: String, noCache: Boolean
   });
});

test('Props as object are added and overwritten existing keys', () => {
   const renderFunction = jest.fn(function () {});
   vue.compile.mockReturnValue(renderFunction);
   const counterClone = Object.assign({}, counter);
   counterClone.props = { template: 123, noCache: String };
   const component = phosphor(counterClone);
   expect(component.props).toEqual({
      template: String, noCache: Boolean
   });
});


test('Props as array are added when there are exising array props', () => {
   const renderFunction = jest.fn(function () {});
   vue.compile.mockReturnValue(renderFunction);
   const counterClone = Object.assign({}, counter);
   counterClone.props = [1,2,3,4,'template'];
   const component = phosphor(counterClone);
   expect(component.props).toContain('template');
   expect(component.props).toContain('noCache');
});

test('Render Counter component twice', () => {
   const renderFunction = jest.fn(function () {});
   vue.compile.mockReturnValue(renderFunction);
   const theSameComponent = Object.assign({}, counter);
   theSameComponent.template = 'template 2';
   phosphor(counter).render();
   phosphor(theSameComponent).render();
   expect(vue.compile.mock.calls.length).toBe(1);
   expect(vue.compile.mock.calls[0][0]).toBe(counter.template);
   expect(vue.compile.mock.calls[0][1]).toEqual({ delimiters: ['{', '}'] });
});

test('Render Counter component twice without cache', () => {
   const renderFunction = jest.fn(function () {});
   vue.compile.mockReturnValue(renderFunction);
   phosphor(counter).render();
   phosphor(counterNoCache).render();
   expect(vue.compile.mock.calls.length).toBe(2);
   expect(vue.compile.mock.calls[0][0]).toBe(counter.template);
   expect(vue.compile.mock.calls[0][1]).toEqual({ delimiters: ['{', '}'] });
   expect(vue.compile.mock.calls[1][0]).toBe(counterNoCache.template);
   expect(vue.compile.mock.calls[1][1]).toEqual({ delimiters: ['{', '}'] });
});
