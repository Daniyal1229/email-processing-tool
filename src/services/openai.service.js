const { Configuration, OpenAIApi } = require('openai');
const config = require('../config/config');

class OpenAIService {
  constructor() {
    const configuration = new Configuration({
      apiKey: config.openai.apiKey,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async categorizeEmail(content) {
    const prompt = `Categorize the following email content as "Interested", "Not Interested", or "More Information":\n\n${content}`;
    const response = await this.openai.createCompletion({
      model: 'text-davinci-002',
      prompt,
      max_tokens: 50,
    });

    return response.data.choices[0].text.trim();
  }

  async generateReply(content, category) {
    let prompt;
    if (category === 'Interested') {
      prompt = `Generate a reply for an interested customer, suggesting a demo call and proposing a time. Use the following email content as context:\n\n${content}`;
    } else if (category === 'Not Interested') {
      prompt = `Generate a polite reply for a not interested customer, thanking them for their time. Use the following email content as context:\n\n${content}`;
    } else {
      prompt = `Generate a reply providing more information based on the customer's request. Use the following email content as context:\n\n${content}`;
    }

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: [
          {role: "system", content: "You are a helpful assistant that categorizes emails."},
          {role: "user", content: `Categorize the following email content as "Interested", "Not Interested", or "More Information":\n\n${emailContent}`}
        ],
        max_tokens: 50
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      

    return response.data.choices[0].text.trim();
  }
}

module.exports = new OpenAIService();
