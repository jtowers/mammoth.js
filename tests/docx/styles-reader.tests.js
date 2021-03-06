var assert = require("assert");

var readStylesXml = require("../../lib/docx/styles-reader").readStylesXml;
var XmlElement = require("../../lib/xmlreader").Element;
var test = require("../testing").test;


describe('readStylesXml', function() {
    test('paragraph style is null if no style with that ID exists', function() {
        var styles = readStylesXml({
            root: new XmlElement("w:styles", {}, [])
        });
        assert.equal(styles.findParagraphStyleById("Heading1"), null);
    });
    
    test('paragraph style can be found by ID', function() {
        var styles = readStylesXml({
            root: new XmlElement("w:styles", {}, [
                paragraphStyleElement("Heading1", "Heading 1")
            ])
        });
        assert.equal(styles.findParagraphStyleById("Heading1").styleId, "Heading1");
    });
    
    test('character style can be found by ID', function() {
        var styles = readStylesXml({
            root: new XmlElement("w:styles", {}, [
                characterStyleElement("Heading1Char", "Heading 1 Char")
            ])
        });
        assert.equal(styles.findCharacterStyleById("Heading1Char").styleId, "Heading1Char");
    });
    
    test('paragraph and character styles are distinct', function() {
        var styles = readStylesXml({
            root: new XmlElement("w:styles", {}, [
                paragraphStyleElement("Heading1", "Heading 1"),
                characterStyleElement("Heading1Char", "Heading 1 Char")
            ])
        });
        assert.equal(styles.findCharacterStyleById("Heading1"), null);
        assert.equal(styles.findParagraphStyleById("Heading1Char"), null);
    });
    
    test('character and table styles are distinct', function() {
        var styles = readStylesXml({
            root: new XmlElement("w:styles", {}, [
                styleElement("table", "Heading1", "Heading 1"),
            ])
        });
        assert.equal(styles.findCharacterStyleById("Heading1"), null);
    });
    
    test('styles include names', function() {
        var styles = readStylesXml({
            root: new XmlElement("w:styles", {}, [
                paragraphStyleElement("Heading1", "Heading 1")
            ])
        });
        assert.equal(styles.findParagraphStyleById("Heading1").name, "Heading 1");
    });
});

function paragraphStyleElement(id, name) {
    return styleElement("paragraph", id, name);
}

function characterStyleElement(id, name) {
    return styleElement("character", id, name);
}

function styleElement(type, id, name) {
    return new XmlElement("w:style", {"w:type": type, "w:styleId": id}, [
        new XmlElement("w:name", {"w:val": name}, [])
    ]);
}
