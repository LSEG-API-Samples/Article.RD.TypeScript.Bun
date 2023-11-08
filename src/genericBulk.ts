import { Session,Delivery } from '@refinitiv-data/data';

export class GenericBulkFile {
    session: Session.Session;
    bulk_api_version: string;

    constructor(session:any, version = 'v1'){
        this.session = session;
        this.bulk_api_version = version;
    }

     // step 1 - get file id from bucket name and package id
    listBucket_FileID = async (bucket_name = '', package_id = '') => {
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

    //step 2 - get file stream (content) from file id
    getBucket_FileURL = async (file_id = '') => {
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

    //step 3 - download file
    downloadFile = async (file_url = '') => {
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

    listPackageId = async (bucket_name = '') => {
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
}