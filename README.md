# Experimenting Bun JavaScript Runtime with Data Library - TypeScript

## Overview

[Bun](https://bun.sh/) is a new JavaScript runtime built from scratch using the [Zig](http://ziglang.org/) programming language. Bun aims to be *a drop-in replacement for [Node.js](https://nodejs.org/en/)* with faster startup and run time, more optimized API, and provides a complete toolkit for JavaScript/TypeScript developers.

Bun [just released version 1.0](https://www.youtube.com/watch?v=BsnCpESUEqM) ("production-ready") on September 2023 (the current version is 1.0.7, as of November 2023).

One of Bun features is the [Node.js compatibility](https://bun.sh/docs/runtime/nodejs-apis). Most [NPM](https://www.npmjs.com/) modules intended to work with Node.js will work with Bun out of the box. This is a good opportunity to test [Data Library for TypeScript](https://developers.lseg.com/en/api-catalog/refinitiv-data-platform/refinitiv-data-library-for-typescript) with Bun runtime to consume data from [Data Platform APIs (RDP)](https://developers.lseg.com/en/api-catalog/refinitiv-data-platform/refinitiv-data-platform-apis) as an experimental project.

This example project shows how to implement a console [TypeScript](https://www.typescriptlang.org) application to retrieve financial data using ease-of-use [Data Library for TypeScript](https://developers.lseg.com/en/api-catalog/refinitiv-data-platform/refinitiv-data-library-for-typescript) on Bun runtime.  The project is implemented and run in a controlled environment such as [Docker](https://www.docker.com/) and [devcontainer](https://code.visualstudio.com/docs/remote/containers) using the [Bun Docker Image](https://hub.docker.com/r/oven/bun).

**Note**:
Please be informed that this demo project aims for Development and POC purposes only. 

## <a id="bun_intro"></a>What is Bun?

[To be done]

## <a id="rdp_lib"></a>Introduction to the Data Library for TypeScript

The Data Library for TypeScript is an ease-of-use API defining a set of uniform interfaces providing the developer access to the Refinitiv Data Platform.  The APIs are designed to provide consistent access through multiple access channels, spanning multiple programming languages that target both Professional Developers and Financial Coders.  Developers can choose to access content from the desktop, within a desktop container, through their deployed streaming services, or directly to the cloud.  The interfaces encompass a set of unified Web APIs providing access to both streaming (over WebSockets) and non-streaming (HTTP REST) data available within the platform.

![Figure-1](images/rdlib_image.png "Data Library Diagram") 

The RDP Library are available in the following programming languages:
- [Python](https://developers.lseg.com/en/api-catalog/refinitiv-data-platform/refinitiv-data-library-for-python)
- [TypeScript/JavaScript](https://developers.lseg.com/en/api-catalog/refinitiv-data-platform/refinitiv-data-library-for-typescript)
- [.NET](https://developers.lseg.com/en/api-catalog/refinitiv-data-platform/refinitiv-data-library-for--net)

For more deep detail regarding the RDP Libraries, please refer to the following articles and tutorials:
- [Quickstart](https://developers.lseg.com/en/api-catalog/refinitiv-data-platform/refinitiv-data-library-for-typescript/quick-start).
- [Documentation](https://developers.lseg.com/en/api-catalog/refinitiv-data-platform/refinitiv-data-library-for-typescript/documentation).
- [Tutorials](https://developers.lseg.com/en/api-catalog/refinitiv-data-platform/refinitiv-data-library-for-typescript/tutorials).
- [GitHub](https://github.com/LSEG-API-Samples/Example.DataLibrary.TypeScript).

### Disclaimer

This project is based on RD Library TypeScript versions **3.12-0-beta** using the Platform Session only. The method signatures, data formats, etc are subject to change.

## <a id="prerequisite"></a>Prerequisite

Before I am going further, there is some prerequisite, dependencies, and libraries that the project is needed.

### Access to the RDP with the your desire Bulk file permission

This project uses RDP access credentials with the CFS Bulk file, Pricing History, and News permission.

Please contact your LSEG representative to help you with the RDP account and services.

### Internet Access

This demonstration connects to RDP on AWS via a public internet.

### Docker Desktop

This project uses [Docker Desktop](https://www.docker.com/products/docker-desktop/) for containerization. 

### Visual Studio Code (Optional)

Optionally, you can use the [Visual Studio Code](https://code.visualstudio.com/) with [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension to run and debug the example code.

## how to run

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src\rdlib_workflow.ts
```

This project was created using `bun init` in bun v1.0.7. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
