//|-----------------------------------------------------------------------------
//|            This source code is provided under the Apache 2.0 license      --
//|  and is provided AS IS with no warranty or guarantee of fit for purpose.  --
//|                See the project's LICENSE.md for details.                  --
//|           Copyright Refinitiv 2024.       All rights reserved.            --
//|-----------------------------------------------------------------------------

// Example Code Disclaimer:
// ALL EXAMPLE CODE IS PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS FOR ILLUSTRATIVE PURPOSES ONLY. REFINITIV MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF THE EXAMPLE CODE, OR THE INFORMATION, CONTENT, OR MATERIALS USED IN CONNECTION WITH THE EXAMPLE CODE. YOU EXPRESSLY AGREE THAT YOUR USE OF THE EXAMPLE CODE IS AT YOUR SOLE RISK.

import { Session,Delivery } from '@refinitiv-data/data';

export class GenericCFSFile {
    session: Session.Session;
    cfs_api_version: string;

    constructor(session:any, version = 'v1'){
        this.session = session;
        this.cfs_api_version = version;
    }

    /*
    * Step 2: Listing the packageId using the Bucket Name
    * 
    * To request the CFS Bulk data, the first step is to send an HTTP ```GET``` request to the RDP 
    * ```/file-store/v1/packages?bucketName={bucket-name}``` endpoint to list all package Ids under the input ```bucket-name```.
    * 
    */

    listPackageIds = async (bucket_name = '') => {

        if(bucket_name.length === 0){
            throw new Error('Received invalid (None or Empty) argument');
        }

        let response:any = {};
        try{
            const param: Delivery.EndpointRequestDefinitionParams = {
                url: `/file-store/${this.cfs_api_version}/packages`,
                method: Delivery.EndpointRequest.Method.GET,
                queryParameters: { 'bucketName' : bucket_name}
            };
           
            const def = Delivery.EndpointRequest.Definition(param);
            response = await def.getData(this.session);
        }
        catch (err) {
            console.log(`Failed to request RDP /file-store/${this.cfs_api_version}/packages`);
            console.log(err);
            throw new Error(`Failed to request RDP /file-store/${this.cfs_api_version}/packages`);
        } 
        return response;
    }

    /*
    * Step 3: Listing the Filesets of the Bulk ESG Data with the packageId
    *
    * The next step is calling the CFS API with the bucket name and package Id to list all FileSets using **the package Id**.
    *
    * API endpoint is ```/file-store/v1/file-sets?bucket={bucket-name}&packageId={packageId}```
    */
    listBucket_FileSets = async (bucket_name = '', package_id = '') => {

        if(bucket_name.length === 0 || package_id.length === 0){
            throw new Error('Received invalid (None or Empty) arguments');
        }

        let response:any = {};
        try{
            const param: Delivery.EndpointRequestDefinitionParams = {
                url: `/file-store/${this.cfs_api_version}/file-sets`,
                method: Delivery.EndpointRequest.Method.GET,
                queryParameters: { 
                    'bucket' : bucket_name,
                    'packageId': package_id}
            };
           
            const def = Delivery.EndpointRequest.Definition(param);
            response = await def.getData(this.session);
        }
        catch (err) {
            console.log(`Failed to request RDP /file-store/${this.cfs_api_version}/file-sets`);
            console.log(err);
            throw new Error(`Failed to request RDP /file-store/${this.cfs_api_version}/file-sets`);
        } 
        return response;
    }

    /*
    * Step 4: Get the file URL on AWS S3
    * 
    * The last step is downloading the FIle using File ID with the RDP ```/file-store/v1/files/{file ID}/stream``` endpoint.
    * 
    */
    getBucket_FileURL = async (file_id = '') => {

        if(file_id.length === 0){
            throw new Error('Received invalid (None or Empty) argument');
        }

        let response:any = {};
        
        try{
            const param = {
                url: `/file-store/${this.cfs_api_version}/files/{file_id}/stream`,
                method: Delivery.EndpointRequest.Method.GET,
                pathParameters: { 'file_id': file_id},
                queryParameters: { 'doNotRedirect' : 'true'}
            };
    
            const def = Delivery.EndpointRequest.Definition(param);
            response = await def.getData(this.session);
        }
        catch (err) {
            console.log(`Failed to request RDP /file-store/${this.cfs_api_version}/files/${file_id}/stream`);
            console.log(err);
            throw new Error(`Failed to request RDP /file-store/${this.cfs_api_version}/files/${file_id}/stream`);
        } 
        return response;
    }

    /*
    * Step 5: Downloading the file
    * 
    * You need to replace the escaped character ```%3A``` with ```_``` (underscore) character before loading the file.
    * 
    */
   
    downloadFile = async (file_url = '') => {

        if(file_url.length === 0){
            throw new Error('Received invalid (None or Empty) argument');
        }

        let response:any = {};
        try{
            response = await fetch(file_url, {
                method: 'GET'
            });
        }
        catch (err) {
            console.log(`Failed to request file from ${file_url}`);
            console.log(err);
            throw new Error(`Failed to request file from ${file_url}`);
        } 
        return response;
    }   
}