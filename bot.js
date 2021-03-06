require('dotenv').config();
const { Telegraf } = require('telegraf');
const api = require('covid19-api');
const Markup = require('telegraf/markup');
const COUNTRIES_LIST = require('./constants');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) =>
  ctx.reply(
    `Hello, ${ctx.message.from.first_name}! I'm Statistics COVID-19 bot! Let's look at a country. Enjoy:)`,
    Markup.keyboard([
      ['Ukraine', 'Belarus'],
      ['Canada', 'Poland'],
    ])
      .resize()
      .extra()
  )
);

bot.help((ctx) => ctx.reply(COUNTRIES_LIST));

bot.on('text', async (ctx) => {
  let data = {};

  try {
    data = await api.getReportsByCountries(ctx.message.text);
    const formatData = `
Country: ${data[0][0].country}
Cases: ${data[0][0].cases}
Deaths: ${data[0][0].deaths}
Recovered: ${data[0][0].recovered}
`;
    ctx.reply(formatData);
  } catch {
    ctx.reply(`Error, ${ctx.message.from.first_name}! You need some /help`);
  }
});

bot.launch();

// eslint-disable-next-line no-console
console.log('Bot starting');
