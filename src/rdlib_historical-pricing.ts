//|-----------------------------------------------------------------------------
//|            This source code is provided under the Apache 2.0 license      --
//|  and is provided AS IS with no warranty or guarantee of fit for purpose.  --
//|                See the project's LICENSE.md for details.                  --
//|           Copyright Refinitiv 2024.       All rights reserved.            --
//|-----------------------------------------------------------------------------

// Example Code Disclaimer:
// ALL EXAMPLE CODE IS PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS FOR ILLUSTRATIVE PURPOSES ONLY. REFINITIV MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF THE EXAMPLE CODE, OR THE INFORMATION, CONTENT, OR MATERIALS USED IN CONNECTION WITH THE EXAMPLE CODE. YOU EXPRESSLY AGREE THAT YOUR USE OF THE EXAMPLE CODE IS AT YOUR SOLE RISK.

import { HistoricalPricing, Session } from '@refinitiv-data/data';

const session = Session.Platform.Definition({
    appKey: Bun.env.RDP_APP_KEY || ''!,
    userName: Bun.env.RDP_USERNAME || ''!,
    password: Bun.env.RDP_PASSWORD || ''!,
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