# Experimenting Bun JavaScript Runtime with Data Library - TypeScript
- version: 1.0
- Last update: January 2024
- Environment: VS Code Devcontainer, Docker
- Prerequisite: [Prerequisite](#prerequisite)

Example Code Disclaimer:
ALL EXAMPLE CODE IS PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS FOR ILLUSTRATIVE PURPOSES ONLY. REFINITIV MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF THE EXAMPLE CODE, OR THE INFORMATION, CONTENT, OR MATERIALS USED IN CONNECTION WITH THE EXAMPLE CODE. YOU EXPRESSLY AGREE THAT YOUR USE OF THE EXAMPLE CODE IS AT YOUR SOLE RISK.

## <a id="overview"></a>Overview

[Bun](https://bun.sh/) is a new JavaScript runtime that aims to be *a drop-in replacement for [Node.js](https://nodejs.org/en/)* with faster startup and run time, more optimized API, and provides a complete toolkit for JavaScript/TypeScript developers.

Bun [just released version 1.0](https://www.youtube.com/watch?v=BsnCpESUEqM) ("production-ready") on September 2023 (the current version is 1.0.21, as of January 2024).

One of Bun features is the [Node.js compatibility](https://bun.sh/docs/runtime/nodejs-apis). Most [NPM](https://www.npmjs.com/) modules intended to work with Node.js will work with Bun out of the box. This is a good opportunity to test [Data Library for TypeScript](https://developers.lseg.com/en/api-catalog/refinitiv-data-platform/refinitiv-data-library-for-typescript) with Bun runtime to consume data from [Data Platform APIs (RDP)](https://developers.lseg.com/en/api-catalog/refinitiv-data-platform/refinitiv-data-platform-apis) as an experimental project.

This example project shows how to implement a console [TypeScript](https://www.typescriptlang.org) application to retrieve financial data using ease-of-use [Data Library for TypeScript](https://developers.lseg.com/en/api-catalog/refinitiv-data-platform/refinitiv-data-library-for-typescript) on Bun runtime.  The project is implemented and run in a controlled environment such as [Docker](https://www.docker.com/) and [devcontainer](https://code.visualstudio.com/docs/remote/containers) using the [Bun Docker Image](https://hub.docker.com/r/oven/bun).

**Note**:
- Please be informed that this demo project aims for Development and POC purposes only. The Data Library for TypeScript/JavaScript is not tested and qualified with Bun runtime.
- This project uses Bun version 1.0.21.

## <a id="bun_intro"></a>What is Bun?

[Bun](https://bun.sh/) is an all-in-one JavaScript runtime and toolkit designed for speed, complete with a bundler, test runner, and Node.js-compatible package manager. Bun is built from scratch using the [Zig](http://ziglang.org/) programming language. Unlike Node.js and [Deno](https://deno.com/) that use Chromium's [V8](https://v8.dev/), Bun uses [WebKit] (https://webkit.org/)'s [JavaScriptCore](https://docs.webkit.org/Deep%20Dive/JSC/JavaScriptCore.html) as the JavaScript Engine.

The three major design goals of Bun are as follows:
- **Speed**: Bun starts fast and runs fast. It extends JavaScriptCore, the performance-minded JS engine built for Safari. 
- **Elegant APIs**: Bun provides a minimal set of highly-optimized APIs for performing common tasks, like starting an HTTP server and writing files.
- **Cohesive DX**: Bun is a complete toolkit for building JavaScript apps, including a package manager, test runner, and bundler.

Bun is designed as a drop-in replacement for Node.js. It natively implements hundreds of Node.js and Web APIs, including ```fs```, ```path```, ```Buffer``` and much more to improve performance and developers productivity.

![figure-01](images/01_bun_benchmark.png "Bun benchmark")

Benchmark result from [Bun](https://bun.sh/) website.

For more detail about Bun runtime, please check the following resources:
- [Bun Guide](https://bun.sh/guides).
- [Bun Document](https://bun.sh/docs).

This project was created using `bun init` command in bun v1.0.21. 

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

This project is based on RD Library TypeScript versions **3.13-1-beta** using the Platform Session only. The method signatures, data formats, etc are subject to change.

## <a id="prerequisite"></a>Prerequisite

Before I am going further, there is some prerequisite, dependencies, and libraries that the project is needed.

### Access to the RDP with the your Historical-Pricing, News and CFS file permissions

This project uses RDP access credentials with the CFS file, Pricing History, and News permissions.

Please contact your LSEG representative to help you with the RDP account and services.

### Internet Access

This demonstration connects to RDP on AWS via a public internet.

### Docker Desktop

This project uses [Docker Desktop](https://www.docker.com/products/docker-desktop/) for containerization. 

### Visual Studio Code (Optional)

Optionally, you can use the [Visual Studio Code](https://code.visualstudio.com/) with [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension to run and debug the example code.

## <a id="development_detail"></a>Development Detail

Please check the [Article.md](./Article.md) document page.

## <a id="how_to_run"></a>How to run the demo application

The first step is to unzip or download the example project folder into a directory of your choice, then set up Python or Postman environments based on your preference.

### Running as VS Code DevContainer

1. Start a Docker desktop or Docker engine on your machine.
2. Install the [VS Code - Remote Development extension pack](https://aka.ms/vscode-remote/download/extension).
3. Once the extension installation process is success, create a ```devcontainer.env``` file in the ```.devcontainer``` folder with the following content
    ``` INI
    RDP_USERNAME=<Your RDP Username>
    RDP_PASSWORD=<Your RDP Password>
    RDP_APP_KEY=<Your RDP App key>
    ```
4. Open the VS Code Command Palette with the ```F1``` key, and then select the **Remote-Containers: Reopen in Container** command.
5. Once this build is completed, VS Code automatically connects to the container, and automatics initializes the project for developers.  Now VS Code is ready for running and testing the Project inside this devcontainer.
6. To run the RD - Library content layer examples:

    ```bash
    bun run src/rdlib_historical-pricing.ts

    bun run src/rdlib_news.ts
    ```
7. To run the RD - Library Delivery layer examples:

    ```bash
    bun run src/rdlib_cfsWorkflow.ts
    ```

    or

    ```bash
    bun start
    ```
### Running as Docker Container

1. Start a Docker desktop or Docker engine on your machine.
2. create a ```.env``` file in the project folder with the following content
    ``` INI
    RDP_USERNAME=<Your RDP Username>
    RDP_PASSWORD=<Your RDP Password>
    RDP_APP_KEY=<Your RDP App key>
    ```
3. Build a Docker image with the following command:
    ```bash
    docker build . -t bun_datalibrary_ts
    ```
4. Once this build is completed, run a Docker container with the following command:
    ```bash
    docker run -it --name bun_datalibrary_ts --env-file .env -v <full path to outputCFS folder>:/app/outputCFS bun_datalibrary_ts
    ```
5. To stop and delete a Docker container, press ``` Ctrl+C``` (or run ```docker stop bun_datalibrary_ts```) then run the following command:
    ```bash
    docker rm bun_datalibrary_ts
    ```
6. To delete a Docker bun_datalibrary_ts image, run the following command:
    ```bash
    docker rmi bun_datalibrary_ts
    ```
## <a id="conclusion"></a>Conclusion

Before I finish, let me just say while the [Node.js](https://nodejs.org/en) is still a de factor platform for the JavaScript/TypeScript application development, [Bun](https://bun.sh/) is a good alternative platform for JavaScript/TypeScript developers. It provides a fast runtime, simplify APIs, well written document, and all-in-one toolkit (development, runtime, test, and bundler) for developers. The Node.js-compatible package manager is also a killer feature that makes Node.js developers feel right-at-home when using Bun.

This leads to how easy to use Bun with the easy-to-use [Data Library for TypeScript](https://developers.lseg.com/en/api-catalog/refinitiv-data-platform/refinitiv-data-library-for-typescript). When combining the library development experience with Bun runtime and toolset, developers can create applications that connect and consume data from Refinitiv Data Platform (RDP) easier and faster when comparing to using Node.js.

However, please be noticed that the Data Library for TypeScript is not qualified with Bun runtime yet. But this Prove of Concept (POC) project shows that once the Bun becomes a *mainstream* platform, developers can start using it with the Data Library with confident. 

## <a id="references"></a>References

That brings me to the end of my Bun - RD TypeScript project. For further details, please check out the following resources:

* [Data Library for TypeScript page](https://developers.lseg.com/en/api-catalog/refinitiv-data-platform/refinitiv-data-library-for-typescript) on the [LSEG Developer Community](https://developers.lseg.com/) website.
* [Data Libraries Family page](https://developers.lseg.com/en/api-catalog/refinitiv-data-platform/refinitiv-data-libraries).
* [Getting started with Data Library for TypeScript](https://developers.lseg.com/en/api-catalog/refinitiv-data-platform/refinitiv-data-library-for-typescript/quick-start).
* [Data Library for TypeScript Tutorials](https://developers.lseg.com/en/api-catalog/refinitiv-data-platform/refinitiv-data-library-for-typescript/tutorials).
* [Data Library for TypeScript Examples](https://github.com/LSEG-API-Samples/Example.DataLibrary.TypeScript).
* [Bun Official website](https://bun.sh/).
* [Bun Official Documents](https://bun.sh/docs).
* [Bun Official Guides](https://bun.sh/guides).
* [Bun Official Guides: Install TypeScript declarations for Bun](https://bun.sh/guides/runtime/typescript).
* [Bun Official Guides: Containerize a Bun application with Docker](https://bun.sh/guides/ecosystem/docker).
* [How To Dockerize A Bun App](https://dev.to/code42cate/how-to-dockerize-a-bun-app-38e4) blog post.


For any questions related to Data Library for TypeScript, please use the [Developers Community Q&A page](https://community.developers.refinitiv.com/) page.

