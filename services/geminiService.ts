import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const geminiService = {
  /**
   * Generates a professional RFQ message based on simple user inputs.
   */
  async generateRFQDraft(productName: string, quantity: number, roughNotes: string, language: string = 'en'): Promise<string> {
    if (!apiKey) {
      console.warn("Gemini API Key missing");
      const baseMsg = language === 'ru' 
        ? `Уважаемый поставщик,\n\nМеня интересует покупка ${quantity} единиц товара ${productName}. ${roughNotes}\n\nПожалуйста, предоставьте цену и условия доставки.\n\nС уважением.`
        : `Dear Supplier,\n\nI am interested in purchasing ${quantity} units of ${productName}. ${roughNotes}\n\nPlease provide a quote including shipping terms.\n\nBest regards.`;
      return baseMsg;
    }

    try {
      const prompt = `
        You are an expert B2B procurement assistant for the "Made-In-Uzbekistan" marketplace.
        Write a professional, concise, and polite Request for Quotation (RFQ) message for a buyer.
        
        Context:
        - Product: ${productName}
        - Quantity: ${quantity}
        - User's rough notes: "${roughNotes}"
        - Output Language: ${language === 'ru' ? 'Russian' : 'English'}

        The message should ask for price per unit, availability, and shipping estimate to a generic international location if not specified.
        Do not include placeholders like "[Your Name]" in the output, keep it generic enough to be sent immediately.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return response.text.trim();
    } catch (error) {
      console.error("Gemini AI Error:", error);
      throw new Error("Failed to generate AI draft.");
    }
  }
};