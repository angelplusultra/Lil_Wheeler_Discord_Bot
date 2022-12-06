import { Configuration, OpenAIApi } from 'openai'


const openAiConfig = () => {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);
    
    
        return openai

}

export default openAiConfig
