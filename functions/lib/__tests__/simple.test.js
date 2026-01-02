"use strict";
// A simple test file to verify the functions can be imported
describe('Firebase Functions', () => {
    it('should have exports', () => {
        // This test will pass if the module can be imported without errors
        expect(() => {
            require('../src/index');
        }).not.toThrow();
    });
});
//# sourceMappingURL=simple.test.js.map