# Experimenting Bun JavaScript Runtime with Data Library - TypeScript

## Overview

[Bun](https://bun.sh/) is a new JavaScript runtime that aims to be *a drop-in replacement for [Node.js](https://nodejs.org/en/)* with faster startup and run time, more optimized API, and provides a complete toolkit for JavaScript/TypeScript developers.

Bun [just released version 1.0](https://www.youtube.com/watch?v=BsnCpESUEqM) ("production-ready") on September 2023 (the current version is 1.0.7, as of November 2023).

One of Bun features is the [Node.js compatibility](https://bun.sh/docs/runtime/nodejs-apis). Most [NPM](https://www.npmjs.com/) modules intended to work with Node.js will work with Bun out of the box. This is a good opportunity to test [Data Library for TypeScript](https://developers.lseg.com/en/api-catalog/refinitiv-data-platform/refinitiv-data-library-for-typescript) with Bun runtime to consume data from [Refinitiv Data Platform (RDP)](https://developers.lseg.com/en/api-catalog/refinitiv-data-platform/refinitiv-data-platform-apis) as an experimental project.

This example project shows how to implement a console [TypeScript](https://www.typescriptlang.org) application to retrieve financial data using ease-of-use [Data Library for TypeScript](https://developers.lseg.com/en/api-catalog/refinitiv-data-platform/refinitiv-data-library-for-typescript) on Bun runtime.  

**Note**:
Please be informed that this demo project aims for Development and POC purposes only. 

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

This project was created using `bun init` in bun v1.0.18. 

## Step 1: Setting Up Bun Development environment.

To avoid messing up my office machine (I am looking at you ZScaler), this project is implemented and run in a controlled environment such as [Docker](https://www.docker.com/) and [VS Code devcontainer](https://code.visualstudio.com/docs/remote/containers) using the [Bun Docker Image](https://hub.docker.com/r/oven/bun).

The first step is creating a file name ```devcontainer.json``` in the ```.devcontainer``` folder in the VS Code project as follows:

```json
{
    "name": "BUN RD TypeScript",
    "image": "oven/bun:1.0.18",
    "customizations": {
        "vscode": {
            "extensions": ["oven.bun-vscode"],
            "settings": {
                "bun.debugTerminal.enabled": true,
                "bun.runtime": "/usr/local/bin/bun"
            }
        }
      },
    "shutdownAction":"stopContainer"
}
```

Then open the VS Code Command Palette with the ```F1``` key, and then select the **Remote-Containers: Reopen in Container** command.

![Alt text](images/02_reopenincontainer.png)

Once this build is completed, VS Code automatically connects to the Bun container and you get a ready-to-use Bun development environment. 

![Alt text](images/03_bun_docker.png)

The next step is creating an empty Bun project with the interactive [bun init](https://bun.sh/docs/cli/init) command.

![Alt text](images/04_bun_init.png)

You see that Bun simplify how you can create a development project with minimal interactive questions and gives you all necessary project files such as ```package.json```, ```.gitignore```, ```README.md```, ```tsconfig.json```.

Now you can start write the TypeScript source code in the project.

```TypeScript
//index.ts
(async () => {
    console.log('Hello Bun...');
})();
```

And run the application with the following command:

```bash
$#bun run index.ts 

Hello Bun...
```
This Bun development environment is ready for implementing the RDP application like the following example

```TypeScript
//index.ts
(async () => {
    let username: string = 'RDP User-ID/Machine-ID';
    let password: string = 'RDP Password';
    let app_key: string = 'RDP App Key'

    const rdp_host: string = 'https://api.refinitiv.com';
    const rdp_auth: string = '/auth/oauth2/v1/token';
    let authen_url: string = rdp_host + rdp_auth;

    let access_token: string = '';
    let refresh_token: string = '';
    let expires_in: number = 0;

    let login_payload: string = `grant_type=password&username=${username}&client_id=${app_key}&password=${password}&takeExclusiveSignOnControl=True&scope=trapi`;

    const auth_resp = await fetch(authen_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(login_payload)
    });
    
    if (!auth_resp.ok){
        console.log('Authentication Failed');
        const status_text = await auth_resp.text();
        console.log(`HTTP error!: ${auth_resp.status} ${status_text}`);
    } else {
        console.log('Authentication Granted');
        //Parse response to JSON
        const auth_response:any = await auth_resp.json();
        access_token= auth_response.access_token;
        refresh_token = auth_response.refresh_token;
        expires_in = parseInt(auth_response.expires_in);
    }

    // Continue Request RDP data using access_token
})();
```
Result:

![Alt text](images/05_bun_pure_rdp_result.png)

Let's leave this core RDP HTTP APIs application implementation there. I am going to use the Data Library for TypeScript to connect and consume data from RDP instead.

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

## Step 2: Installing Data Library for TypeScript.

[To be done]