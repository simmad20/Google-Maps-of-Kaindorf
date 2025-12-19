"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EditScreenInfo;
var react_1 = require("react");
var react_native_1 = require("react-native");
var ExternalLink_1 = require("./ExternalLink");
var StyledText_1 = require("./StyledText");
var Themed_1 = require("./Themed");
var Colors_1 = require("@/constants/Colors");
function EditScreenInfo(_a) {
    var path = _a.path;
    return (<Themed_1.View>
      <Themed_1.View style={styles.getStartedContainer}>
        <Themed_1.Text style={styles.getStartedText} lightColor="rgba(0,0,0,0.8)" darkColor="rgba(255,255,255,0.8)">
          Open up the code for this screen:
        </Themed_1.Text>

        <Themed_1.View style={[styles.codeHighlightContainer, styles.homeScreenFilename]} darkColor="rgba(255,255,255,0.05)" lightColor="rgba(0,0,0,0.05)">
          <StyledText_1.MonoText>{path}</StyledText_1.MonoText>
        </Themed_1.View>

        <Themed_1.Text style={styles.getStartedText} lightColor="rgba(0,0,0,0.8)" darkColor="rgba(255,255,255,0.8)">
          Change any of the text, save the file, and your app will automatically update.
        </Themed_1.Text>
      </Themed_1.View>

      <Themed_1.View style={styles.helpContainer}>
        <ExternalLink_1.ExternalLink style={styles.helpLink} href="https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet">
          <Themed_1.Text style={styles.helpLinkText} lightColor={Colors_1.default.light.tint}>
            Tap here if your app doesn't automatically update after making changes
          </Themed_1.Text>
        </ExternalLink_1.ExternalLink>
      </Themed_1.View>
    </Themed_1.View>);
}
var styles = react_native_1.StyleSheet.create({
    getStartedContainer: {
        alignItems: 'center',
        marginHorizontal: 50,
    },
    homeScreenFilename: {
        marginVertical: 7,
    },
    codeHighlightContainer: {
        borderRadius: 3,
        paddingHorizontal: 4,
    },
    getStartedText: {
        fontSize: 17,
        lineHeight: 24,
        textAlign: 'center',
    },
    helpContainer: {
        marginTop: 15,
        marginHorizontal: 20,
        alignItems: 'center',
    },
    helpLink: {
        paddingVertical: 15,
    },
    helpLinkText: {
        textAlign: 'center',
    },
});
