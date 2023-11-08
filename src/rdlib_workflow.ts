// tslint:disable-next-line: no-implicit-dependencies
import zlib from 'zlib';
import fs from 'fs';
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
		
		// open the session
		await session.open();
		
		console.log('Session successfully opened');

        const bulkFile = new GenericBulkFile(session);

        // step 2 - get file id from bucket name

        const package_id: string = process.env.RDP_PACKAGE_ID || '';
        const bucket_name: string = process.env.RDP_BUCKET_NAME || '';

        let response:any = await bulkFile.listBucket_FileID(bucket_name, package_id);
        if(response.data['value'].length === 0){
            console.log('No data received');
            process.exit(1);
        }
        //console.log(`Received data: ${JSON.stringify(response.data, null, ' ')}`);
        console.log(`Received data: ${JSON.stringify(response.data['value'][0], null, ' ')}`);

        const file_id: string = response.data['value'][0]['files'][0];
        console.log(file_id);

        //step 3 - get file stream (content) from file id

        response = await bulkFile.getBucket_FileURL(file_id);
        console.log(`Received data: ${JSON.stringify(response.data['url'], null, ' ')}`);

        const file_url: string = response.data['url'];
        const zip_filename:string = file_url.split('?')[0].split("/").slice(-1)[0].replaceAll('%3A','_');
        
        //step 4 - download file
        console.log(`Downloading ${zip_filename}`);

        const file_response = await bulkFile.downloadFile(file_url);

        if (!file_response.ok){
            console.log('Requestion Green Revenue File Failed');
            const status_text = await file_response.text();
            console.log(`HTTP error!: ${file_response.status} ${status_text}`);
            process.exit(1);
        } else {
            console.log('Requestion Green Revenue File Success');
            const zipdata: any = await file_response.blob();
            await Bun.write(zip_filename, zipdata);
            console.log(`Downloading ${zip_filename} success`);
        }

        const file_name: string = zip_filename.split('.gz')[0];

        // //step 5 - unzip file
        // console.log(`Unzipping ${zip_filename}`);
        // fs.createReadStream(zip_filename).pipe(zlib.createGunzip()).pipe(fs.createWriteStream(file_name));
        // console.log(`Unzipping ${zip_filename} to ${file_name} success`);

        // //step 6 - read file
        // await Bun.sleep(3000); // sleep for a while to wait for the bulk file is fully written on disk
        // console.log(await Bun.file(file_name).text());

        console.log('End program');
		
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