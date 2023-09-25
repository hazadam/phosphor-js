const phosphor = require('./../src/phosphor');
const vue = require("vue");

jest.mock('vue');

const counter1 = {
   name: 'Counter',
   setup: props => props
};

const counter2 = {
   name: 'Counter',
   setup: props => props
};

function setupAndRender(component, props) {
   component.setup(Object.assign(
       {
          noCache: false
       },
       props
   ));

   return component.render();
}

test('Props as object are added to component when not provided', () => {
   const renderFunction = jest.fn(function () {});
   vue.compile.mockReturnValue(renderFunction);
   const component = phosphor(counter1);
   expect(component.props).toEqual({
      template: String, noCache: Boolean
   });
});

test('Props as object are added and overwritten existing keys', () => {
   const renderFunction = jest.fn(function () {});
   vue.compile.mockReturnValue(renderFunction);
   const counterClone = Object.assign({}, counter1);
   counterClone.props = { template: 123, noCache: String };
   const component = phosphor(counterClone);
   expect(component.props).toEqual({
      template: String, noCache: Boolean
   });
});


test('Props as array are added when there are exising array props', () => {
   const renderFunction = jest.fn(function () {});
   vue.compile.mockReturnValue(renderFunction);
   const counterClone = Object.assign({}, counter1);
   counterClone.props = [1,2,3,4,'template'];
   const component = phosphor(counterClone);
   expect(component.props).toContain('template');
   expect(component.props).toContain('noCache');
});

test('Render Counter component twice', () => {
   const renderFunction = jest.fn(function () {});
   vue.compile.mockReturnValue(renderFunction);
   const theSameComponent = Object.assign({}, counter1);
   setupAndRender(phosphor(counter1), {template: 'template 1'});
   setupAndRender(phosphor(theSameComponent), {template: 'template 2'});
   expect(vue.compile.mock.calls.length).toBe(1);
   expect(vue.compile.mock.calls[0][0]).toBe('template 1');
   expect(vue.compile.mock.calls[0][1]).toEqual({ delimiters: ['{', '}'] });
});

test('Render Counter component twice without cache', () => {
   const renderFunction = jest.fn(function () {});
   vue.compile.mockReturnValue(renderFunction);
   setupAndRender(phosphor(counter1), {noCache: false, template: 'template 1'});
   setupAndRender(phosphor(counter2), {noCache: true, template: 'template 2'});
   expect(vue.compile.mock.calls.length).toBe(2);
   expect(vue.compile.mock.calls[0][0]).toBe('template 1');
   expect(vue.compile.mock.calls[0][1]).toEqual({ delimiters: ['{', '}'] });
   expect(vue.compile.mock.calls[1][0]).toBe('template 2');
   expect(vue.compile.mock.calls[1][1]).toEqual({ delimiters: ['{', '}'] });
});
