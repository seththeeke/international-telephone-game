import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import LanguageGraphInfrastructureStack = require('../lib/language-graph-infra-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new LanguageGraphInfrastructureStack.LanguageGraphInfrastructureStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
