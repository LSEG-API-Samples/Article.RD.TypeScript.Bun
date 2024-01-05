//|-----------------------------------------------------------------------------
//|            This source code is provided under the Apache 2.0 license      --
//|  and is provided AS IS with no warranty or guarantee of fit for purpose.  --
//|                See the project's LICENSE.md for details.                  --
//|           Copyright Refinitiv 2024.       All rights reserved.            --
//|-----------------------------------------------------------------------------

// Example Code Disclaimer:
// ALL EXAMPLE CODE IS PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS FOR ILLUSTRATIVE PURPOSES ONLY. REFINITIV MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF THE EXAMPLE CODE, OR THE INFORMATION, CONTENT, OR MATERIALS USED IN CONNECTION WITH THE EXAMPLE CODE. YOU EXPRESSLY AGREE THAT YOUR USE OF THE EXAMPLE CODE IS AT YOUR SOLE RISK.

export {};
let username: string = Bun.env.RDP_USERNAME || '';
let password: string = Bun.env.RDP_PASSWORD || '';
let app_key: string = Bun.env.RDP_APP_KEY || '';

const rdp_host: string = 'https://api.refinitiv.com';
const rdp_auth: string = '/auth/oauth2/v1/token';

let access_token: string = '';
let refresh_token: string = '';
let expires_in: number = 0;

let login_payload: string = `grant_type=password&username=${username}&client_id=${app_key}&password=${password}&takeExclusiveSignOnControl=True&scope=trapi`;

let authen_url: string = rdp_host + rdp_auth;

const auth_resp = await fetch(authen_url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams(login_payload)
});

if (!auth_resp.ok){
    console.log('Authenticaion Failed');
    const status_text = await auth_resp.text();
    console.log(`HTTP error!: ${auth_resp.status} ${status_text}`);
    process.exitCode = 1;
} else {
    console.log('Authentication Granted');
    //Parse response to JSON
    const auth_response:any = await auth_resp.json();
    access_token= auth_response.access_token;
    refresh_token = auth_response.refresh_token;
    expires_in = parseInt(auth_response.expires_in);
}

const package_id: string = '4e94-6d63-fea034dc-90e2-de33895bd4e9';
const green_revenue_url: string = `${rdp_host}/file-store/v1/file-sets?bucket=bulk-greenrevenue&packageId=${package_id}`;

const green_revenue_resp = await fetch(green_revenue_url, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
    }
});

if (!green_revenue_resp.ok){
    console.log('Request Green Revenue Failed');
    const status_text = await green_revenue_resp.text();
    console.log(`HTTP error!: ${green_revenue_resp.status} ${status_text}`);
    process.exitCode = 1;
} else {
    console.log('Request Green Revenue Granted');
    //Parse response to JSON
    const green_revenue_response = await green_revenue_resp.json();
    console.log(green_revenue_response);
}



