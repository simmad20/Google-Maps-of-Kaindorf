"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_test_renderer_1 = require("react-test-renderer");
var ThemedText_1 = require("../ThemedText");
it("renders correctly", function () {
    var tree = react_test_renderer_1.default.create(<ThemedText_1.ThemedText>Snapshot test!</ThemedText_1.ThemedText>).toJSON();
    expect(tree).toMatchSnapshot();
});
