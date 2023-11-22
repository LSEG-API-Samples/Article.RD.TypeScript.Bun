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
    * Step 1: Listing the packageId using the Bucket Name
    * 
    * To request the CFS Bulk data, the first step is to send an HTTP ```GET``` request to the RDP 
    * ```/file-store/v1/file-sets?bucket={bucket-name}``` endpoint to list all FileSets under the input ```bucket-name```.
    * 
    */

     listPackageId = async (bucket_name = '') => {

        if(bucket_name.length === 0){
            throw new Error('Received invalid (None or Empty) argument');
        }

        let response:any = {};
        try{
            let param: Delivery.EndpointRequestDefinitionParams = {
                url: `/file-store/${this.bulk_api_version}/file-sets`,
                queryParameters: { 
                    'bucket' : bucket_name}
            };
           
            let def = Delivery.EndpointRequest.Definition(param);
            response = await def.getData(this.session);
        }
        catch (err) {
            console.log('Failed to request RDP /file-store/v1/file-sets');
            console.log(err);
            throw new Error('Failed to request RDP /file-store/v1/file-sets');
        } 
        return response;
    }

    /*
    * Step 2: Listing the Filesets of the Bulk ESG Data with the packageId
    *
    * The next step is calling the CFS API with the buket name and package Id to list all FileSets using **the package Id**.
    *
    * API endpint is ```/file-store/v1/file-sets?bucket={bucket-name}&packageId={packageId}```
    */
    listBucket_FileID = async (bucket_name = '', package_id = '') => {

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
            console.log('Failed to request RDP /file-store/v1/file-sets');
            console.log(err);
            throw new Error('Failed to request RDP /file-store/v1/file-sets');
        } 
        return response;
    }

    /*
    * Step 3: Get the Bulk file URL on AWS S3
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
            console.log('Failed to request RDP /file-store/v1/files/{file_id}/stream');
            console.log(err);
            throw new Error('Failed to request RDP /file-store/v1/files/{file_id}/stream');
        } 
        return response;
    }

    /*
    * Step 4: Downloading the file
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

    // //step 5 - Extract file
    // extractFile = async (zip_filename = '', file_name = '') => {
    //     //fs.createReadStream(zip_filename).pipe(zlib.createGunzip()).pipe(fs.createWriteStream(file_name));
    //     //await Bun.sleep(3000); // sleep for a while to wait for the bulk file is fully written on disk

    //     if(zip_filename.length === 0 || file_name.length === 0){
    //         throw new Error('Received invalid (None or Empty) arguments');
    //     }

    //     try{
    //             const unzip = zlib.createUnzip();
            
    //         fs.createReadStream(zip_filename).pipe(unzip).pipe(fs.createWriteStream(file_name)).on('close', (err:any)=> {
    //             if(err){
    //                 console.log(`Unzipping ${zip_filename} to ${file_name} error because ${err}`);
    //             } else {
    //                 console.log(`Unzipping ${zip_filename} to ${file_name} success`);
    //             }
                
    //         });
    //     }
    //     catch (err) {
    //         console.log(`Failed to unzip file`);
    //         console.log(err);
    //         throw new Error(`Failed to unzip file because ${err}`);
    //     }       
    // }

   
}