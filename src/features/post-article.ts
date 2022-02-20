import { Client, TextChannel } from 'discord.js';
import WOKCommands from 'wokcommands';
import { isWebUri } from 'valid-url';
import { extract } from 'article-parser';

const articleBotChannel = process.env.NODE_ENV === 'production' ? 'article-bot' : 'article-bot-test';

export default (client: Client, instance: WOKCommands) => {
	client.on('message', async (message) => {
		if (message.author.bot) {
			return;
		}
		const { guild } = message;
		if (!guild) {
			return;
		}

		const channel = guild.channels.cache.find((channel) => channel.name === articleBotChannel) as TextChannel;
		if (!channel) {
			return;
		}

		const urlFromPost = message.content.split(' ').find(isWebUri);
		if (!urlFromPost) {
			return;
		}

		const { url, title, description, links, image, author, source, published, ttr, content } = await extract(
			urlFromPost
		);

		// UNCOMMENT TO USE TEST DATA:

		// const { url, title, description, links, image, author, source, published, ttr, content } = {
		// 	url: 'https://www.vox.com/recode/22933594/pay-raise-price-inflation-employers-great-resignation',
		// 	title: 'Nice raise. Too bad about inflation.',
		// 	description: 'Higher prices mean your boss may need to give you more than just a small raise.',
		// 	links: ['https://www.vox.com/recode/22933594/pay-raise-price-inflation-employers-great-resignation'],
		// 	image:
		// 		'https://cdn.vox-cdn.com/thumbor/y9emO2Amg7Jj9Agvn5ub2YTQ278=/0x244:5446x2967/fit-in/1200x600/cdn.vox-cdn.com/uploads/chorus_asset/file/23247957/1363541825.jpg',
		// 	content:
		// 		'<div><div><p>You got a raise last year or switched jobs to get one. Congratulations! You’re one of the many Americans who saw their paychecks get bigger. Unfortunately, unless your wages or salary grew much higher than the national <a href="https://www.bls.gov/news.release/pdf/eci.pdf" target="_blank">average of 4.5 percent last year</a>, inflation likely canceled it out. That means that while you might be making more money, you can buy less stuff with it.</p><p>That’s bad news for you, but it’s also probably bad news for your boss. Employers are struggling to retain and attract workers <a href="https://www.vox.com/recode/22776112/quit-jobs-great-resignation-workers-union" target="_blank">amid the Great Resignation</a>, a broad term to describe the past couple of years, when workers have been quick to leave for better pay or greener pastures. If inflation continues apace, we could be trapped in a cycle of rising wages only to see those gains wiped out by inflation. If inflation calms down, as <a href="https://www.cnbc.com/video/2022/02/04/forecasters-expect-inflation-will-ease-because-the-economy-is-healing-says-cea-chair-rouse.html" target="_blank">economists expect</a>, the situation could lead to much-needed real wage gains for American workers.</p><p>For now, inflation is at a 40-year high, with prices on average <a href="https://www.bls.gov/news.release/cpi.htm" target="_blank">7.5 percent higher</a> than they were a year ago. That figure takes into account a whole basket of goods and services, so it will affect people differently based on what they purchase, but as a whole, price increases outpaced typical wage growth. Price hikes were especially high for things like fuel, meat, or cars and grew even faster than that average.</p><p>To put it another way, if you made $20 an hour in 2020 and worked 40 hours a week every week of the year, you would have earned $41,600. For the purposes of this thought experiment, let’s assume you paid no taxes or Social Security and purchased literally nothing else. That means your total wages would have been enough to purchase a new vehicle outright at the end of December 2020, when they cost $41,000 on average, <a href="https://mediaroom.kbb.com/2021-02-15-Average-New-Vehicle-Prices-Continue-to-Surpass-40-000-Up-More-Than-5-in-January-2021-According-to-Kelley-Blue-Book" target="_blank">according to Kelley Blue Book</a>.</p><p>Now, let’s say you got 5 percent raise to $21 an hour in 2021. If you worked the same amount — and again, no taxes, Social Security, or purchases — at the end of the year, you would have earned $43,680 but no longer would be able to afford a new vehicle, which now costs <a href="https://www.prnewswire.com/news-releases/strong-luxury-vehicle-sales-in-december-2021-drive-average-new-vehicle-prices-further-into-record-territory-according-to-kelley-blue-book-301458394.html" target="_blank">$47,000</a>. You made more money, but that money was worth less.</p><p>The headlines about <a href="https://www.vox.com/recode/22841490/work-remote-wages-labor-force-participation-great-resignation-unions-quits" target="_blank">worker power</a> and <a href="https://www.vox.com/recode/22748448/service-food-hotel-workers-pay-raise-resignation-jobs-wages-benefits" target="_blank">rising wages</a> obscure the fact that those wages have less buying power. While nominal hourly earnings — or the literal amount you’re paid — grew 5.7 percent on average in January 2022 compared with January 2021, real wages — or wages adjusted for the effects of inflation — <a href="https://www.bls.gov/news.release/pdf/realer.pdf" target="_blank">declined nearly 2 percent</a>.</p><p>Even front-line workers, who saw some of the biggest wage increases since the start of the pandemic, have seen at least half those gains wiped out by inflation, according to a <a href="https://www.brookings.edu/blog/the-avenue/2021/12/13/with-inflation-surging-big-companies-wage-upticks-arent-nearly-enough/" target="_blank">Brookings Institution analysis</a> of the largest and most profitable retail, grocery, and fast food companies.</p><p>Further compounding the situation, work has gotten worse for many since the onset of the pandemic. High rates of people quitting their jobs have meant that a smaller number of people are <a href="https://www.vox.com/recode/22904758/remote-work-innovation-workload" target="_blank">shouldering the workload</a> that used to be carried by a larger number of workers, contributing to high rates of burnout. That’s not to mention the added risks of the pandemic itself, creating more dangerous work environments and adding additional labor like making sure customers are wearing masks.</p><p>“No one thought when you’re signing up to be a cashier that that job would be deadly,” Molly Kinder, a Brookings fellow and author of the report, told Recode, talking about the dangers people working in front-line positions at places like grocery stores or pharmacies face by being exposed to the virus. Kinder said that one Kroger employee she’s been interviewing isn’t sure getting a raise is enough to offset the added stress.</p><p>“She’s gone on and on about how important a $15 wage is. Well, she finally gets it and she’s saying, ‘Is that extra tiny bit of money worth it when my mental health is suffering, it’s so risky, and I’m paying more at the pump?’”</p><p>The problem of inflation impacting wages is likely to persist through 2022. Some 85 percent of employers are worried that planned wage increases this year, which are already substantially higher than in recent years, will be eroded by inflation, according to a new survey of more than 5,000 employers across industries by compensation <a href="https://www.payscale.com/research-and-insights/cbpr/" target="_blank">software company Payscale</a>.</p><p>Fortunately for you, we’re in a unique historical period in which inflation is expected to subside but labor shortages are not.</p><p>“Workers have more leverage in negotiations, and that can be a countervailing force to some of the challenges we’re facing,” like income inequality, said David Smith, an economics professor at Pepperdine’s business school. “That would be healthy in the long run.”</p><p>For now, those gains are necessary to keep up with the growing price of goods. But if the price of goods moderates, these long-overdue wage gains could mean something in real terms to Americans.</p><h3>What employers are going to have to do about it</h3><p>Inflation is bad for employers because they have to spend more to keep their employees from looking for better wages somewhere else. In order to keep those workers, employers may need to raise wages along with inflation rates, offer better benefits, or change the way they operate.</p><p>Raising wages is the most straightforward approach. Some 44 percent of companies — substantially more than it’s been in the six years Payscale has been collecting this data — say they plan to give raises of 3 percent or more on average this year. Fewer than 10 percent are raising wages more than 5 percent, which would be<strong> </strong>more in line with inflation.</p><p>“There are some employers that are just going out there and saying, ‘We have enough wealth, and we can go out and be dominant in compensation as a differentiator,’” Shelly Holt, chief people officer at Payscale, said. “When you look at a midsize organization or a smaller organization, they might not have the luxury of doing that.”</p><p>Those companies will have to lean more heavily on other types of perks to attract and retain employees. That could include better health care coverage, more time off, and remote work options, among other offerings. That fits in with some of the realizations people have had during the Great Resignation.</p><p>“Employees are looking for more than just pay. Pay is a critical factor, but they want workforce flexibility, they want to live better lives, and that is also increasing what [employers] are thinking about for benefits and total rewards,” Holt said.</p><p>Payscale found that companies are offering a wider range of benefits this year than they had pre-pandemic. Before the pandemic, 40 percent of the companies surveyed offered remote work options, now 65 percent do. The share of companies offering mental health and wellness programs rose 7 percentage points to 65 percent this year. There were also moderate jumps in the share of companies offering four-day workweeks and child care subsidies.</p><p>The things that can help set companies apart require a shift in mentality, from treating employees like labor to treating them like people, according to<strong> </strong>Allie Kelly, chief marketing officer at recruitment platform <a href="https://www.jobvite.com/" target="_blank">Jobvite</a>. That means continually reevaluating offerings to keep up with what’s important to their workers.</p><p>“People have a different perception and understanding of their own self-worth and what’s important to them in their life. Money is a part of that but it’s not enough,” Kelly said, citing perks as varied as child care, shorter workdays, and more professional development, in addition to cheaper benefits and better pay.</p><p>While potentially cheaper than a 7.5 percent annual raise, many of these perks do cost money. Companies will have to decide whether they can or should pass those costs on to customers, which could potentially exacerbate inflation, or if they can just swallow them as a cost of business. That could mean opening for fewer hours or producing less stuff overall or lowering their profit margins, according to Erica Groshen, senior economics advisor at Cornell University’s labor school.</p><p>“We have historically high profit margins right now, and they have been for a while,” Groshen said. “So that historically would not be seen as a crisis.”</p><p>And, as has long been feared, the rising cost of human labor is also <a href="https://www.vox.com/recode/2020/3/31/21200010/corona',
		// 	author: 'Rani Molla',
		// 	source: 'voxdotcom',
		// 	published: '2022-02-16T09:00:00-05:00',
		// 	ttr: 320,
		// };

		channel.send({
			embeds: [
				{
					color: '#ffaa00',
					title,
					url,
					description,
					timestamp: new Date(),
					author: {
						name: author,
					},
					image: {
						url: image,
					},
					fields: [
						{
							name: 'Reading time',
							value: ttr ? `${Math.floor(ttr / 60)} minutes` : 'Unknown',
						},
					],
					// footer: {
					//   text:
					// }
				},
			],
		});
	});
};

const config = {
	displayName: 'Post article',
	dbName: 'POST ARTICLE',
};

export { config };