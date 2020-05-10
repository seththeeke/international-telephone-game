#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LanguageGraphInfrastructureStack } from '../lib/language-graph-infra-stack';

const app = new cdk.App();
new LanguageGraphInfrastructureStack(app, 'LanguageGraphInfrastructureStack');
