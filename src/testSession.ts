import { Session } from '@refinitiv-data/data';

const session = Session.Platform.Definition({
    appKey: process.env.RDP_APP_KEY || ''!,
    userName: process.env.RDP_USERNAME || ''!,
    password: process.env.RDP_PASSWORD || ''!,
    takeSignOnControl: true,
}).getSession();

(async () => {
    try {
		console.log('Opening the session...');
		
		// open the session
		await session.open();
		
		console.log('Session successfully opened');		
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