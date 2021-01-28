#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { EventBridgeStack } from '../lib/event-bridge-stack';

const app = new cdk.App();

new EventBridgeStack(app, 'EventBridgeStack');
