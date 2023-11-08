import { HistoricalPricing, Session } from '@refinitiv-data/data';

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

        const pricing1: any = HistoricalPricing.Summaries.Definition({
            universe: 'IBM.N',
            interval: HistoricalPricing.Summaries.IntradayInterval.ONE_MINUTE,
            fields: ['TRDPRC_1', 'HIGH_1', 'LOW_1', 'OPEN_PRC', 'NUM_MOVES'],
            count: 10
        });

        const response: any = await pricing1.getData(session);
        if (response.data.table){
            console.log('Historical pricing intraday summaries');
			console.table(response.data.table);
        } else {
            console.log('No data received');
        }

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