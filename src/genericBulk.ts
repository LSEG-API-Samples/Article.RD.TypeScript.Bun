import zlib from 'zlib';
import fs from 'fs';
import { Session,Delivery } from '@refinitiv-data/data';
import { FileSystemRouter } from 'bun';

export class GenericBulkFile {
    session: Session.Session;
    bulk_api_version: string;

    constructor(session:any, version = 'v1'){
        this.session = session;
        this.bulk_api_version = version;
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
            let param: Delivery.EndpointRequestDefinitionParams = {
                url: `/file-store/${this.bulk_api_version}/packages`,
                queryParameters: { 
                    'bucketName' : bucket_name}
            };
           
            let def = Delivery.EndpointRequest.Definition(param);
            response = await def.getData(this.session);
        }
        catch (err) {
            console.log(`Failed to request RDP /file-store/${this.bulk_api_version}/packages`);
            console.log(err);
            throw new Error(`Failed to request RDP /file-store/${this.bulk_api_version}/packages`);
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
            let param: Delivery.EndpointRequestDefinitionParams = {
                url: `/file-store/${this.bulk_api_version}/file-sets`,
                queryParameters: { 
                    'bucket' : bucket_name,
                    'packageId': package_id}
            };
           
            let def = Delivery.EndpointRequest.Definition(param);
            response = await def.getData(this.session);
        }
        catch (err) {
            console.log(`Failed to request RDP /file-store/${this.bulk_api_version}/file-sets`);
            console.log(err);
            throw new Error(`Failed to request RDP /file-store/${this.bulk_api_version}/file-sets`);
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
            let param = {
                url: `/file-store/${this.bulk_api_version}/files/{file_id}/stream`,
                pathParameters: { 'file_id': file_id},
                queryParameters: { 
                    'doNotRedirect' : 'true'}
            };
    
            let def = Delivery.EndpointRequest.Definition(param);
            response = await def.getData(this.session);
        }
        catch (err) {
            console.log(`Failed to request RDP /file-store/${this.bulk_api_version}/files/${file_id}/stream`);
            console.log(err);
            throw new Error(`Failed to request RDP /file-store/${this.bulk_api_version}/files/${file_id}/stream`);
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
            response =await fetch(file_url, {
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