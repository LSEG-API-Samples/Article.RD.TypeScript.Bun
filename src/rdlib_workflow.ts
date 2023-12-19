// tslint:disable-next-line: no-implicit-dependencies
import { Session } from '@refinitiv-data/data';

import {GenericBulkFile} from './genericBulk.ts';

const session = Session.Platform.Definition({
    appKey: process.env.RDP_APP_KEY || ''!,
    userName: process.env.RDP_USERNAME || ''!,
    password: process.env.RDP_PASSWORD || ''!,
    takeSignOnControl: true,
}).getSession();

// rest of the code remains unchanged for each session type
(async () => {
	try {
		console.log('Opening the session...');
		
        /*
        * Step 1: Authentication with RDP APIs.
        *
        */
		// open the session
		await session.open();
		
		console.log('Session successfully opened');

        const bulkFile = new GenericBulkFile(session);

        let response:any = null;

        /*
        * Step 2: Listing the packageId using the Bucket Name
        * 
        * To request the CFS Bulk data, the first step is to send an HTTP ```GET``` request to the RDP 
        * ```/file-store/v1/packages?bucketName={bucket-name}``` endpoint to list all package Ids under the input ```bucket-name```.
        * 
        */
        // const bucket_name: string = process.env.RDP_BUCKET_NAME || '';
        const bucket_name: string = 'bulk-ESG';

        response = await bulkFile.listPackageIds(bucket_name);
        if(response.data['value'].length === 0){
            console.log('No data received');
            process.exit(1);
        }
        console.log(`Received data: ${JSON.stringify(response.data['value'][0], null, ' ')}`);

        /*
        * Step 3: Listing the Filesets of the Bulk ESG Data with the packageId
        *
        * The next step is calling the CFS API with the buket name and package Id to list all FileSets using **the package Id**.
        *
        * API endpint is ```/file-store/v1/file-sets?bucket={bucket-name}&packageId={packageId}```
        */
        // const package_id: string = process.env.RDP_PACKAGE_ID || '';
        const package_id: string = '4173-aec7-8a0b0ac9-96f9-48e83ddbd2ad';
        response = await bulkFile.listBucket_FileSets(bucket_name, package_id);
        if(response.data['value'].length === 0){
            console.log('No data received');
            process.exit(1);
        }
        //console.log(`Received data: ${JSON.stringify(response.data, null, ' ')}`);
        console.log(`Received data: ${JSON.stringify(response.data['value'][0], null, ' ')}`);

        const file_id: string = response.data['value'][0]['files'][0];
        console.log(file_id);

        /*
        * Step 4: Get the file URL on AWS S3
        * 
        * The last step is downloading the FIle using File ID with the RDP ```/file-store/v1/files/{file ID}/stream``` endpoint.
        * 
        */

        response = await bulkFile.getBucket_FileURL(file_id);
        console.log(`Received data: ${JSON.stringify(response.data['url'], null, ' ')}`);

        /*
        * Step 5: Downloading the file
        * 
        * You need to replace the escaped character ```%3A``` with ```_``` (underscore) character before loading the file.
        * 
        */

        const file_url: string = response.data['url'];
        const zip_filename:string = file_url.split('?')[0].split("/").slice(-1)[0].replaceAll('%3A','_');
        
        console.log(`Downloading ${zip_filename}`);

        const file_response = await bulkFile.downloadFile(file_url);

        if (!file_response.ok){
            console.log('Requesting File Failed');
            const status_text = await file_response.text();
            console.log(`HTTP error!: ${file_response.status} ${status_text}`);
            process.exit(1);
        } else {
            console.log('Requesting File Success');
            const zipdata: any = await file_response.blob();
            await Bun.write(zip_filename, zipdata);
            console.log(`Downloading ${zip_filename} success`);
        }

        const file_name: string = zip_filename.split('.gz')[0];

        await Bun.sleep(1000); // sleep for a while to wait for the bulk file is fully written on disk
        
	} 
	catch (err) {
		console.log('Session failed to open !');
		console.log(err);
	} 
	finally {
		console.log('Closing the session...');
		await session.close();
	}
})();