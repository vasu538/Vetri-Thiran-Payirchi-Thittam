const { GoogleGenerativeAI } = require('@google/generative-ai');


const generateLocalSummary = (city, temperature, humidity, condition) => {
  const tempWord = temperature >= 30 ? 'warm' : temperature <= 15 ? 'chilly' : 'pleasant';
  const humidityWord = humidity >= 70 ? 'high' : humidity <= 40 ? 'low' : 'moderate';
  return `Today's weather in ${city} is ${tempWord} and ${condition.toLowerCase()} with ${humidityWord} humidity.`;
};

const generateLocalRecommendation = (temperature, condition) => {
  const recs = [];
  const condLower = condition.toLowerCase();

  if (temperature >= 30) {
    recs.push('stay hydrated');
    recs.push('wear light cotton clothes');
    if (condLower.includes('sunny') || condLower.includes('clear')) {
      recs.push('avoid outdoor activities during peak afternoon hours');
    }
  } else if (temperature <= 15) {
    recs.push('wear warm layers');
    recs.push('keep hot drinks nearby');
  } else {
    recs.push('enjoy the comfortable temperature');
    recs.push('great day for outdoor plans');
  }

  if (condLower.includes('rain') || condLower.includes('drizzle') || condLower.includes('thunderstorm')) {
    recs.push('remember to carry an umbrella or raincoat');
  } else if (condLower.includes('cloud') || condLower.includes('overcast')) {
    recs.push('a light jacket might be handy');
  } else if (condLower.includes('snow')) {
    recs.push('watch out for slippery roads and stay warm');
  }

  if (recs.length === 0) {
    recs.push('dress comfortably for the current conditions');
  }

  // Combine recommendations list into a sentence
  const sentence = recs.slice(0, -1).join(', ') + (recs.length > 1 ? ', and ' : '') + recs.slice(-1);
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
};

/**
 * Generate AI Summary
 */
const generateSummary = async (city, temperature, humidity, condition) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key' || apiKey.trim() === '') {
    console.log('[AIService] Using rule-based fallback for weather summary (No Gemini key)');
    return generateLocalSummary(city, temperature, humidity, condition);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Generate a concise weather summary (maximum 1-2 sentences) for the following weather conditions:
    City: ${city}
    Temperature: ${temperature}°C
    Humidity: ${humidity}%
    Condition: ${condition}
    
    Response format should be simple, natural, and directly describe the current feel. Do not include markdown formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    return text || generateLocalSummary(city, temperature, humidity, condition);
  } catch (error) {
    console.error('[AIService] Gemini API error generating summary:', error.message);
    return generateLocalSummary(city, temperature, humidity, condition);
  }
};

/**
 * Generate AI Recommendation
 */
const generateRecommendation = async (temperature, condition) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key' || apiKey.trim() === '') {
    console.log('[AIService] Using rule-based fallback for weather recommendation (No Gemini key)');
    return generateLocalRecommendation(temperature, condition);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Provide actionable personalized recommendations (maximum 1-2 sentences, e.g., clothing, hydration, activities) based on these weather conditions:
    Temperature: ${temperature}°C
    Condition: ${condition}
    
    Response format should be natural, friendly, and practical. Do not include markdown formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    return text || generateLocalRecommendation(temperature, condition);
  } catch (error) {
    console.error('[AIService] Gemini API error generating recommendation:', error.message);
    return generateLocalRecommendation(temperature, condition);
  }
};

const chatWithAI = async (message) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (
    !apiKey ||
    apiKey.trim() === '' ||
    apiKey.toLowerCase() === 'your_gemini_api_key'
  ) {
    console.log('[AIService] Using local fallback for chatbot (No Gemini key)');
    return 'I am the Weather Wise Assistant. I can help you with weather-related questions.';
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.8-flash'
    });

    const prompt = `You are the Weather Wise AI Assistant.
Answer the user's weather-related question in a short, friendly and practical way.
If the question requires current weather data but no weather data is provided, say that current weather data is needed.
Do not use markdown formatting.

User question: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    return text || 'Sorry, I could not generate a response right now.';
  } catch (error) {
    console.error(
      '[AIService] Gemini API error generating chatbot response:',
      error.message
    );

    return 'Sorry, the AI assistant is temporarily unavailable. Please try again later.';
  }
};

module.exports = {
  generateSummary,
  generateRecommendation,
  chatWithAI,
};
