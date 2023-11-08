import { News, Session } from '@refinitiv-data/data';

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

        const news1: any = News.Headlines.Definition({
            query: 'Thailand Prime Minister',
            sort: News.Headlines.SortDirection.NewToOld,
            count: 10
        });

        const headlines: any = await news1.getData(session);
        if (headlines.data.table){
            const storyID = headlines.data.table['0'].storyId;
			console.log(`Most recent news headline: ${storyID}`);

            if(typeof(storyID) === 'string'){
                const stDef = News.Story.Definition(storyID);
                const story: any = await stDef.getData(session);
                console.log(`News Story: ${JSON.stringify(story.data)}`);
            }

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